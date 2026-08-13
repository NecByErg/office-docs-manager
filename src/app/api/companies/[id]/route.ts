import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - euta company ko sabai detail (documents, tax clearance, experience letters sabai)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      documents: {
        where: { isDeleted: false },
        include: { sectionType: true },
      },
      taxClearances: {
        where: { isDeleted: false },
        orderBy: { fiscalYear: "desc" },
      },
      experienceLetters: {
        where: { isDeleted: false },
        include: { sector: true },
        orderBy: { uploadedAt: "desc" },
      },
    },
  });

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  return NextResponse.json({ company });
}

// DELETE - company purai delete garne (admin matra, PIN check upstream ma huन्छ)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.company.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
