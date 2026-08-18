import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - sabai company list dine (dashboard ko lagi)
export async function GET() {
  const companies = await prisma.company.findMany({
    orderBy: { name: "asc" },
    include: {
      taxClearances: {
        where: { isDeleted: false },
        orderBy: { fiscalYear: "desc" },
        take: 1, // latest tax clearance matra chahinxa alert check ko lagi
      },
    },
  });

  return NextResponse.json({ companies });
}

// POST - naya company add garne (admin panel bata)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, establishmentYearBS } = body;

    if (!name || !establishmentYearBS) {
      return NextResponse.json(
        { error: "Company name and establishment year are required" },
        { status: 400 }
      );
    }

    const company = await prisma.company.create({
      data: { name, establishmentYearBS },
    });

    return NextResponse.json({ company }, { status: 201 });
  } catch (error) {
    console.error("Create company error:", error);
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
  }
}
