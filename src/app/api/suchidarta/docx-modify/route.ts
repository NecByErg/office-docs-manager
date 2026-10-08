import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { readFile } from "fs/promises";
import path from "path";

/**
 * POST /api/suchidarta/docx-modify
 * 
 * Reads the original .docx template from public/suchidarta/,
 * modifies the date, fiscal year, and office address text in the XML,
 * and returns the modified .docx as binary.
 */

const DOCX_FILES: Record<string, string> = {
  cmsrcze8c0000jv0443e2o5aa: "BI Suchidarta.docx",
  cmsrcjmk10001l10424k4dtiv: "Netreshwori Suchidarta.docx",
  cmu2bv64v0000la04vx9ei2x3: "Diligent Suchidarta.docx",
  cmsrd0y4d0001jv04qlh0pa52: "Mastamandali Suchidarta.docx",
  cmsyc4dd80000jx04khgkqvz6: "Midas Suchidarta.docx",
  cmuxm3q2r0000kz04wznn2nwb: "Hints_Suchidartat.docx",
};

/**
 * Process Word document.xml paragraphs:
 * Replaces date, fiscal year, and office address between ldlt and ljifo
 */
function modifyDocumentXml(
  xml: string,
  newDatePreeti: string,
  newFiscalYearPreeti: string,
  officeLines: string[]
): string {
  // Regex to extract all <w:p> paragraphs
  return xml.replace(/<w:p[\s>][\s\S]*?<\/w:p>/g, (paragraph) => {
    // Extract all text content inside this paragraph
    const tRegex = /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g;
    const matches: string[] = [];
    let m;
    while ((m = tRegex.exec(paragraph)) !== null) {
      matches.push(m[1]);
    }

    if (matches.length === 0) return paragraph;
    const fullText = matches.join("");

    let newText = fullText;
    let modified = false;

    // 1. Top date: matches "ldlt M ...", "ldtL M ..."
    if (newDatePreeti && (fullText.includes("ldlt") || fullText.includes("ldtL")) && !fullText.includes("lgj]bg")) {
      // Replace anything after ldlt / ldtL
      newText = fullText.replace(/(ld[lt]t?[LM]\s*[M×:]?\s*)[^\s<]+/g, `$1${newDatePreeti}`);
      if (newText === fullText) {
        // Fallback replacement
        newText = `ldlt M ${newDatePreeti}`;
      }
      modified = true;
    }

    // 2. Table date: "lgj]bg lbPsf] ldlt M..."
    else if (newDatePreeti && fullText.includes("lgj]bg lbPsf]") && fullText.includes("ldlt")) {
      newText = fullText.replace(/(lgj]bg lbPsf]\s*ldlt\s*[M×:]?\s*)[^\s<]+/g, `$1${newDatePreeti}`);
      if (newText === fullText) {
        newText = `lgj]bg lbPsf] ldlt M ${newDatePreeti}`;
      }
      modified = true;
    }

    // 3. Fiscal Year: "cf=j= M..."
    else if (newFiscalYearPreeti && (fullText.includes("cf=j=") || fullText.includes("cf= j="))) {
      newText = fullText.replace(/(cf=\s*j=\s*[M×:]?\s*)[^\s<]+/g, `$1${newFiscalYearPreeti}`);
      if (newText === fullText) {
        newText = `cf=j= M ${newFiscalYearPreeti}`;
      }
      modified = true;
    }

    // 4. Office Address Line 1: contains "k|d'v" or "Ho""" or ";lrj"
    else if (officeLines.length > 0 && (fullText.includes("k|d'v") || fullText.includes("Ho\"\"") || fullText.includes(";lrj"))) {
      newText = officeLines[0];
      modified = true;
    }

    // 5. Office Address Line 2: contains "k'jf{wf/" or "ljsf;" or "vfg]kfgL" or "ef}lts" or "sfof{no"
    else if (
      officeLines.length > 1 &&
      (fullText.includes("k'jf{wf/") ||
        fullText.includes("ljsf;") ||
        fullText.includes("vfg]kfgL") ||
        fullText.includes("ef}lts") ||
        fullText.includes("sfof{no") ||
        fullText.includes("sfo{fno"))
    ) {
      newText = officeLines.slice(1).join(" ");
      modified = true;
    }

    if (!modified) return paragraph;

    // Inject the new text into the first <w:t> tag and empty subsequent <w:t> tags
    let first = true;
    return paragraph.replace(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g, () => {
      if (first) {
        first = false;
        // Escape special XML characters
        const safeXml = newText
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        return `<w:t xml:space="preserve">${safeXml}</w:t>`;
      }
      return `<w:t xml:space="preserve"></w:t>`;
    });
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyId,
      newDatePreeti,
      newFiscalYearPreeti,
      newOfficePreeti,
    } = body as {
      companyId: string;
      newDatePreeti: string;        // e.g. "@)*#÷)$÷)%"
      newFiscalYearPreeti: string;  // e.g. "@)*#÷)*$"
      newOfficePreeti?: string;     // Multi-line Preeti office address
    };

    const docxFile = DOCX_FILES[companyId];
    if (!docxFile) {
      return NextResponse.json(
        { error: `Unknown companyId: ${companyId}` },
        { status: 400 }
      );
    }

    // Read the original .docx file from public/suchidarta/
    const docxPath = path.join(process.cwd(), "public", "suchidarta", docxFile);
    const fileBytes = await readFile(docxPath);
    const zip = await JSZip.loadAsync(fileBytes);

    const docXmlFile = zip.file("word/document.xml");
    if (!docXmlFile) {
      return NextResponse.json(
        { error: "Invalid docx: missing word/document.xml" },
        { status: 500 }
      );
    }

    const docXml = await docXmlFile.async("string");
    const officeLines = (newOfficePreeti || "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const modifiedDocXml = modifyDocumentXml(
      docXml,
      newDatePreeti,
      newFiscalYearPreeti,
      officeLines
    );

    // Update the zip with modified XML
    zip.file("word/document.xml", modifiedDocXml);

    // Generate modified docx buffer
    const modifiedBytes = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(modifiedBytes, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${docxFile}"`,
      },
    });
  } catch (err) {
    console.error("Error in docx-modify route:", err);
    return NextResponse.json(
      { error: "Failed to modify DOCX: " + String(err) },
      { status: 500 }
    );
  }
}
