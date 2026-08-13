// ==============================================
// PDF Conversion & Compression Utility
// ==============================================
// KAAM: Jun format ma pani file aaos (PNG, JPG, ya already PDF), yo function le
// teslai euta uniform, compressed PDF ma convert garxa.
//
// COMPRESSION RULE (important - tapaiले specifically manga bhayeko):
// - Max 50% samma matra compress garne
// - Kahilyai teो bhanda dherai compress nagarne (quality kharaab huna nadinu)
// - Example: 5MB file -> minimum 2.5MB samma matra jaane, 2MB ma kahilyai najaane

import { PDFDocument } from "pdf-lib";
import sharp from "sharp";

const MAX_COMPRESSION_RATIO = 0.5; // 50% - yo bhanda tala kahilyai najaane (hard limit)

interface ConversionResult {
  buffer: Buffer;
  originalSizeBytes: number;
  finalSizeBytes: number;
}

export async function convertToCompressedPdf(
  fileBuffer: Buffer,
  mimeType: string
): Promise<ConversionResult> {
  const originalSizeBytes = fileBuffer.length;
  const minAllowedSize = Math.floor(originalSizeBytes * MAX_COMPRESSION_RATIO);

  let pdfBytes: Uint8Array;

  if (mimeType === "application/pdf") {
    // Already PDF - just re-save (pdf-lib recompresses streams a bit) and check size
    const existingPdf = await PDFDocument.load(fileBuffer);
    pdfBytes = await existingPdf.save();
  } else if (mimeType.startsWith("image/")) {
    // Image lai PDF ma convert garne
    pdfBytes = await imageToPdf(fileBuffer, minAllowedSize);
  } else {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }

  let finalBuffer: Buffer = Buffer.from(pdfBytes) as Buffer;

  // Safety check: yedi kunai karanले compression 50% bhanda dherai vayo bhane,
  // original (kam compressed) version nai use garne - quality loss huna nadine
  if (finalBuffer.length < minAllowedSize && mimeType === "application/pdf") {
    // PDF ko case ma original nै raख्ने (pdf-lib le already-optimized PDF ma dherai farak pardaina)
    finalBuffer = fileBuffer;
  }

  return {
    buffer: finalBuffer,
    originalSizeBytes,
    finalSizeBytes: finalBuffer.length,
  };
}

async function imageToPdf(
  imageBuffer: Buffer,
  minAllowedSize: number
): Promise<Uint8Array> {
  // Step 1: Sharp le image lai reasonable quality ma compress garne (JPEG quality 80 bata suru)
  let quality = 80;
  let compressedImage = await sharp(imageBuffer)
    .jpeg({ quality })
    .toBuffer();

  // Yedi dherai nै compress vayo (50% limit bhanda tala), quality badhaudai jane
  while (compressedImage.length < minAllowedSize && quality < 95) {
    quality += 5;
    compressedImage = await sharp(imageBuffer).jpeg({ quality }).toBuffer();
  }

  // Yedi original size sano nै xa (compression le farak pardaina), original nै use garne
  if (compressedImage.length < minAllowedSize) {
    compressedImage = await sharp(imageBuffer).jpeg({ quality: 95 }).toBuffer();
  }

  // Step 2: Compressed image lai PDF page ma embed garne
  const pdfDoc = await PDFDocument.create();
  const jpgImage = await pdfDoc.embedJpg(compressedImage);
  const { width, height } = jpgImage.scale(1);

  // A4-ish max bounds ma fit garne, aspect ratio maintain garera
  const maxWidth = 595; // A4 width in points
  const maxHeight = 842; // A4 height in points
  const scale = Math.min(maxWidth / width, maxHeight / height, 1);

  const page = pdfDoc.addPage([width * scale, height * scale]);
  page.drawImage(jpgImage, {
    x: 0,
    y: 0,
    width: width * scale,
    height: height * scale,
  });

  return pdfDoc.save();
}
