import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyId,
      page1PdfBase64,
      includeRegistration = true,
      includeVat = true,
      includeTaxClearance = true,
      filename,
    } = body as {
      companyId: string;
      page1PdfBase64: string;
      includeRegistration?: boolean;
      includeVat?: boolean;
      includeTaxClearance?: boolean;
      filename?: string;
    };

    if (!companyId || !page1PdfBase64) {
      return NextResponse.json(
        { error: "companyId and page1PdfBase64 are required" },
        { status: 400 }
      );
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        documents: {
          include: { sectionType: true },
          where: { isDeleted: false },
        },
        taxClearances: {
          where: { isDeleted: false },
          orderBy: { fiscalYear: "desc" },
        },
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // 1. Create target PDF and append Page 1 (Suchidarta Application Form)
    const mergedPdf = await PDFDocument.create();

    const page1Bytes = Buffer.from(page1PdfBase64, "base64");
    const page1Doc = await PDFDocument.load(page1Bytes);
    const page1Indices = page1Doc.getPageIndices();
    const copiedPage1 = await mergedPdf.copyPages(page1Doc, page1Indices);
    copiedPage1.forEach((page) => mergedPdf.addPage(page));

    // 2. Collect URLs of supporting documents to attach in standard order
    const docsToAttach: { label: string; url: string }[] = [];

    // (A) Company Registration Certificate
    if (includeRegistration) {
      const regDoc = company.documents.find(
        (d) => d.sectionType.key === "registration"
      );
      if (regDoc?.fileUrl) {
        docsToAttach.push({ label: "Registration", url: regDoc.fileUrl });
      }
    }

    // (B) VAT / PAN Registration Certificate
    if (includeVat) {
      const vatDoc = company.documents.find(
        (d) => d.sectionType.key === "vat"
      );
      if (vatDoc?.fileUrl) {
        docsToAttach.push({ label: "VAT/PAN", url: vatDoc.fileUrl });
      }
    }

    // (C) Latest Tax Clearance Certificate
    if (includeTaxClearance) {
      // Find latest marked or highest fiscal year
      const latestTax =
        company.taxClearances.find((t) => t.isLatest) ||
        company.taxClearances[0];

      if (latestTax?.fileUrl) {
        docsToAttach.push({ label: "Tax Clearance", url: latestTax.fileUrl });
      } else {
        // Fallback: check static documents for key 'tax_clearance'
        const staticTax = company.documents.find(
          (d) => d.sectionType.key === "tax_clearance"
        );
        if (staticTax?.fileUrl) {
          docsToAttach.push({ label: "Tax Clearance", url: staticTax.fileUrl });
        }
      }
    }

    // 3. Fetch each supporting PDF and copy pages into merged document
    for (const item of docsToAttach) {
      try {
        const resp = await fetch(item.url);
        if (resp.ok) {
          const buf = await resp.arrayBuffer();
          const doc = await PDFDocument.load(buf);
          const indices = doc.getPageIndices();
          const pages = await mergedPdf.copyPages(doc, indices);
          pages.forEach((p) => mergedPdf.addPage(p));
        } else {
          console.warn(`Failed to fetch ${item.label} from ${item.url}: HTTP ${resp.status}`);
        }
      } catch (err) {
        console.error(`Error loading ${item.label} PDF:`, err);
      }
    }

    const mergedBytes = await mergedPdf.save();
    const safeName = (filename || `${company.name}_Suchidarta.pdf`).replace(
      /[^\w.-]/g,
      "_"
    );

    return new NextResponse(Buffer.from(mergedBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}"`,
      },
    });
  } catch (err) {
    console.error("Error in suchidarta merge route:", err);
    return NextResponse.json(
      { error: "Failed to generate merged Suchidarta PDF" },
      { status: 500 }
    );
  }
}
