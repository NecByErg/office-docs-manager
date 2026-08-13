import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - trash ma vako sabai document dekhaune (static + tax clearance + experience letters)
export async function GET() {
  const [staticDocs, taxClearances, experienceLetters] = await Promise.all([
    prisma.companyDocument.findMany({
      where: { isDeleted: true },
      include: { company: true, sectionType: true },
      orderBy: { deletedAt: "desc" },
    }),
    prisma.taxClearance.findMany({
      where: { isDeleted: true },
      include: { company: true },
      orderBy: { deletedAt: "desc" },
    }),
    prisma.experienceLetter.findMany({
      where: { isDeleted: true },
      include: { company: true, sector: true },
      orderBy: { deletedAt: "desc" },
    }),
  ]);

  return NextResponse.json({ staticDocs, taxClearances, experienceLetters });
}
