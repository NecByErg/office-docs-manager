// ==============================================
// Upload API
// ==============================================
// Yo route le sabai upload handle garxa - static documents (Registration/VAT/custom),
// Tax Clearance, ra Experience Letters, sabai euta nai ठाउँमा.
//
// FLOW:
// 1. File receive garne (PNG/JPG/PDF junसुकै)
// 2. PDF ma convert + compress garne (max 50% compression, quality maintain)
// 3. Vercel Blob ma save garne (primary storage)
// 4. Google Drive ma backup pathaune (secondary, best-effort)
// 5. Database ma record banaune (kun type ho teो anusar: static/tax/experience)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { convertToCompressedPdf } from "@/lib/pdfConvert";
import { uploadFile, deleteFile } from "@/lib/blobStorage";
import { backupToGoogleDrive } from "@/lib/googleDriveBackup";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const uploadType = formData.get("uploadType") as string; // "static" | "tax_clearance" | "experience_letter"
    const companyId = formData.get("companyId") as string;

    if (!file || !uploadType || !companyId) {
      return NextResponse.json(
        { error: "Missing required fields: file, uploadType, companyId" },
        { status: 400 }
      );
    }

    // File lai buffer ma convert garne
    const arrayBuffer = await file.arrayBuffer();
    const originalBuffer = Buffer.from(arrayBuffer);

    // Step 1: PDF ma convert + compress garne
    const { buffer: pdfBuffer } = await convertToCompressedPdf(originalBuffer, file.type);

    // Step 2: Vercel Blob ma upload garne
    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const blobFileName = `${companyId}/${uploadType}/${Date.now()}-${safeFileName.replace(/\.[^.]+$/, "")}.pdf`;
    const { url: fileUrl } = await uploadFile(blobFileName, pdfBuffer);

    // Step 3: Google Drive ma backup (fail vaye pani upload continue huन्छ)
    const backupUrl = await backupToGoogleDrive(blobFileName, pdfBuffer);

    // Step 4: Database record banaune - uploadType anusar farak table ma
    if (uploadType === "static") {
      const sectionTypeId = formData.get("sectionTypeId") as string;
      if (!sectionTypeId) {
        return NextResponse.json({ error: "sectionTypeId required for static upload" }, { status: 400 });
      }

      // Purano document xa vane, purano blob file delete garne (replace huन्छ, history rakhdaina)
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

      // Naya upload automatically "latest" huन्छ, baaki sabai lai latest=false garne
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
