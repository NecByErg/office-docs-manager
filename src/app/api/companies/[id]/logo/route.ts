// ==============================================
// Company Logo Upload API
// ==============================================
// Logo chai document haइन (PDF ma convert garनुपर्दैन) - image nai raख्ने,
// dashboard card ra company page ma display garna.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadFile, deleteFile } from "@/lib/blobStorage";
import sharp from "sharp";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: companyId } = await params;
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Logo must be an image (PNG/JPG)" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const originalBuffer = Buffer.from(arrayBuffer);

    // Logo lai sano/optimized square-ish image ma resize garने (dashboard card ma राम्रोसँग fit hos)
    const resizedBuffer = await sharp(originalBuffer)
      .resize(256, 256, { fit: "inside", withoutEnlargement: true })
      .png()
      .toBuffer();

    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Purano logo vaye delete garने
    if (company.logoUrl) {
      await deleteFile(company.logoUrl);
    }

    const blobFileName = `${companyId}/logo/${Date.now()}-logo.png`;
    const { url: logoUrl } = await uploadFile(blobFileName, resizedBuffer, "image/png");

    await prisma.company.update({ where: { id: companyId }, data: { logoUrl } });

    return NextResponse.json({ logoUrl }, { status: 201 });
  } catch (error) {
    console.error("Logo upload error:", error);
    return NextResponse.json({ error: "Logo upload failed" }, { status: 500 });
  }
}
