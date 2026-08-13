import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sectors = await prisma.sector.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ sectors });
}

// POST - admin le naya sector thapne (e.g. "Irrigation", "Electrical")
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Sector name is required" }, { status: 400 });
    }

    const sector = await prisma.sector.create({ data: { name: name.trim() } });
    return NextResponse.json({ sector }, { status: 201 });
  } catch (error) {
    console.error("Create sector error:", error);
    return NextResponse.json({ error: "Failed to create sector" }, { status: 500 });
  }
}
