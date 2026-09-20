// ==============================================
// Upload API
// ==============================================
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { convertToCompressedPdf } from "@/lib/pdfConvert";
import { uploadFile, deleteFile } from "@/lib/blobStorage";
import { backupToGoogleDrive } from "@/lib/googleDriveBackup";

const WORD_MIME_TYPES = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/msword", // .doc
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const uploadType = formData.get("uploadType") as string; // "static" | "tax_clearance" | "experience_letter" | "letterhead"
    const companyId = formData.get("companyId") as string;

    if (!file || !uploadType || !companyId) {
      return NextResponse.json(
        { error: "Missing required fields: file, uploadType, companyId" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const originalBuffer = Buffer.from(arrayBuffer);

    // ============================================
    // LETTERHEAD (Word doc) - PDF conversion NAGARNE, as-is store garne
    // ============================================
    if (uploadType === "letterhead") {
      if (!WORD_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "Letterhead must be a Word document (.doc or .docx)" },
          { status: 400 }
        );
      }

      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const blobFileName = `${companyId}/letterhead/${Date.now()}-${safeFileName}`;

      const { url: fileUrl } = await uploadFile(blobFileName, originalBuffer, file.type);
      const backupUrl = await backupToGoogleDrive(blobFileName, originalBuffer);

      const existing = await prisma.company.findUnique({ where: { id: companyId } });
      if (existing?.letterheadUrl) {
        await deleteFile(existing.letterheadUrl);
      }

      const updated = await prisma.company.update({
        where: { id: companyId },
        data: {
          letterheadUrl: fileUrl,
          letterheadBackupUrl: backupUrl,
          letterheadFileName: file.name,
          letterheadFileSizeBytes: originalBuffer.length,
          letterheadUpdatedAt: new Date(),
        },
      });

      return NextResponse.json({ company: updated }, { status: 201 });
    }

    // ============================================
    // STATIC / TAX CLEARANCE / EXPERIENCE LETTER - purano flow (PDF convert)
    // ============================================
    const { buffer: pdfBuffer } = await convertToCompressedPdf(originalBuffer, file.type);

    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const blobFileName = `${companyId}/${uploadType}/${Date.now()}-${safeFileName.replace(/\.[^.]+$/, "")}.pdf`;
    const { url: fileUrl } = await uploadFile(blobFileName, pdfBuffer);
    const backupUrl = await backupToGoogleDrive(blobFileName, pdfBuffer);

    if (uploadType === "static") {
      const sectionTypeId = formData.get("sectionTypeId") as string;
      if (!sectionTypeId) {
        return NextResponse.json({ error: "sectionTypeId required for static upload" }, { status: 400 });
      }

      const existing = await prisma.companyDocument.findUnique({
        where: { companyId_sectionTypeId: { companyId, sectionTypeId } },
      });
      if (existing) {
        await deleteFile(existing.fileUrl);
      }

      const doc = await prisma.companyDocument.upsert({
        where: { companyId_sectionTypeId: { companyId, sectionTypeId } },
        update: { fileUrl, backupUrl, fileName: file.name, fileSizeBytes: pdfBuffer.length, uploadedAt: new Date(), isDeleted: false, deletedAt: null },
        create: { companyId, sectionTypeId, fileUrl, backupUrl, fileName: file.name, fileSizeBytes: pdfBuffer.length },
      });

      return NextResponse.json({ document: doc }, { status: 201 });
    }

    if (uploadType === "tax_clearance") {
      const fiscalYear = formData.get("fiscalYear") as string;
      if (!fiscalYear) {
        return NextResponse.json({ error: "fiscalYear required for tax clearance upload" }, { status: 400 });
      }

      await prisma.taxClearance.updateMany({
        where: { companyId },
        data: { isLatest: false },
      });

      const taxClearance = await prisma.taxClearance.upsert({
        where: { companyId_fiscalYear: { companyId, fiscalYear } },
        update: { fileUrl, backupUrl, fileName: file.name, fileSizeBytes: pdfBuffer.length, isLatest: true, uploadedAt: new Date(), isDeleted: false, deletedAt: null },
        create: { companyId, fiscalYear, fileUrl, backupUrl, fileName: file.name, fileSizeBytes: pdfBuffer.length, isLatest: true },
      });

      return NextResponse.json({ taxClearance }, { status: 201 });
    }

    if (uploadType === "experience_letter") {
      const fiscalYear = formData.get("fiscalYear") as string;
      const sectorId = formData.get("sectorId") as string;
      const province = formData.get("province") as string;

      if (!fiscalYear || !sectorId || !province) {
        return NextResponse.json(
          { error: "fiscalYear, sectorId, and province required for experience letter upload" },
          { status: 400 }
        );
      }

      const experienceLetter = await prisma.experienceLetter.create({
        data: {
          companyId,
          fiscalYear,
          sectorId,
          province: province as never,
          fileUrl,
          backupUrl,
          fileName: file.name,
          fileSizeBytes: pdfBuffer.length,
        },
      });

      return NextResponse.json({ experienceLetter }, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid uploadType" }, { status: 400 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}