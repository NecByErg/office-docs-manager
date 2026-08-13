import { prisma } from "@/lib/prisma";
import TrashClient from "@/components/TrashClient";
import AppFooter from "@/components/AppFooter";

export default async function TrashPage() {
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TrashClient
        staticDocs={staticDocs}
        taxClearances={taxClearances}
        experienceLetters={experienceLetters}
      />
      <AppFooter />
    </div>
  );
}
