// ==============================================
// Merge API
// ==============================================
// KAAM: User le company detail page ma kehi documents select garxa (checkbox),
// harek ma sequence number dinxa (1, 2, 3...), ani "Download" click garxa.
// Yo route le teो sequence anusar sabai PDF haru euta PDF ma merge garera
// download ko lagi pathaidinxa.
//
// Filename auto-generate huन्छ: CompanyName_LegalDocuments_Date.pdf

import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { prisma } from "@/lib/prisma";

interface SelectedDoc {
  docType: "static" | "tax_clearance" | "experience_letter";
  docId: string;
  order: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, selectedDocs } = body as {
      companyId: string;
      selectedDocs: SelectedDoc[];
    };

    if (!companyId || !selectedDocs || selectedDocs.length === 0) {
      return NextResponse.json({ error: "No documents selected" }, { status: 400 });
    }

    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // User le diyeko order anusar sort garne (Question 8 - number input sequence)
    const sorted = [...selectedDocs].sort((a, b) => a.order - b.order);

    // Harek selected doc ko fileUrl database bata fetch garne
    const fileUrls: string[] = [];
    for (const item of sorted) {
      let fileUrl: string | null = null;

      if (item.docType === "static") {
        const doc = await prisma.companyDocument.findUnique({ where: { id: item.docId } });
        fileUrl = doc?.fileUrl ?? null;
      } else if (item.docType === "tax_clearance") {
        const doc = await prisma.taxClearance.findUnique({ where: { id: item.docId } });
        fileUrl = doc?.fileUrl ?? null;
      } else if (item.docType === "experience_letter") {
        const doc = await prisma.experienceLetter.findUnique({ where: { id: item.docId } });
        fileUrl = doc?.fileUrl ?? null;
      }

      if (fileUrl) fileUrls.push(fileUrl);
    }

    if (fileUrls.length === 0) {
      return NextResponse.json({ error: "Selected documents not found" }, { status: 404 });
    }

    // Merge garne: naya blank PDF banaera, harek file ko pages copy garera thapdai jane
    const mergedPdf = await PDFDocument.create();

    for (const url of fileUrls) {
      const response = await fetch(url);
      const fileBuffer = await response.arrayBuffer();
      const sourcePdf = await PDFDocument.load(fileBuffer);
      const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();

    // Filename auto-generate: CompanyName_LegalDocuments_Date.pdf
    const safeCompanyName = company.name.replace(/[^a-zA-Z0-9]/g, "_");
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const outputFilename = `${safeCompanyName}_LegalDocuments_${today}.pdf`;

    // Merge history log garne (simple record, kasले garyo track hudaina)
    await prisma.mergeLog.create({
      data: { companyId, outputFileName: outputFilename },
    });

    return new NextResponse(Buffer.from(mergedBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${outputFilename}"`,
      },
    });
  } catch (error) {
    console.error("Merge error:", error);
    return NextResponse.json({ error: "Failed to merge documents" }, { status: 500 });
  }
}
