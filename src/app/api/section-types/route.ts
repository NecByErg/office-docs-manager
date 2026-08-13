import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sectionTypes = await prisma.documentSectionType.findMany({
    orderBy: [{ isDefault: "desc" }, { label: "asc" }],
  });
  return NextResponse.json({ sectionTypes });
}

// POST - admin le naya custom section type thapne (e.g. "Renewal Certificate")
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { label } = body;

    if (!label || typeof label !== "string") {
      return NextResponse.json({ error: "Section label is required" }, { status: 400 });
    }

    const key = label.toLowerCase().trim().replace(/\s+/g, "_");

    const sectionType = await prisma.documentSectionType.create({
      data: { key, label: label.trim(), isDefault: false },
    });

    return NextResponse.json({ sectionType }, { status: 201 });
  } catch (error) {
    console.error("Create section type error:", error);
    return NextResponse.json({ error: "Failed to create section type" }, { status: 500 });
  }
}
