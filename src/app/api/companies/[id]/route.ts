import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminPin } from "@/lib/auth";

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

// PATCH - company ko naam/establishment year edit garne
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, establishmentYearBS } = body;

    if (!name || !establishmentYearBS) {
      return NextResponse.json(
        { error: "Company name and establishment year are required" },
        { status: 400 }
      );
    }

    const company = await prisma.company.update({
      where: { id },
      data: { name, establishmentYearBS },
    });

    return NextResponse.json({ company });
  } catch (error) {
    console.error("Update company error:", error);
    return NextResponse.json({ error: "Failed to update company" }, { status: 500 });
  }
}

// DELETE - company purai delete garne (Admin PIN chahिन्छ - yो permanent delete ho,
// company sanga jodिएko sabai document pani euta sathai हराउँछ, trash ma jaदैन)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const { adminPin } = body as { adminPin?: string };

  if (!adminPin || !verifyAdminPin(adminPin)) {
    return NextResponse.json({ error: "Incorrect Admin PIN" }, { status: 403 });
  }

  await prisma.company.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
