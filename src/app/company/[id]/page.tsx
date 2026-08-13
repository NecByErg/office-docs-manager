import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateFiscalYears } from "@/lib/fiscalYear";
import CompanyDetailClient from "@/components/CompanyDetailClient";
import AppFooter from "@/components/AppFooter";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
    notFound();
  }

  const [sectionTypes, sectors] = await Promise.all([
    prisma.documentSectionType.findMany({ orderBy: [{ isDefault: "desc" }, { label: "asc" }] }),
    prisma.sector.findMany({ orderBy: { name: "asc" } }),
  ]);

  const fiscalYears = generateFiscalYears(company.establishmentYearBS);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CompanyDetailClient
        company={company}
        sectionTypes={sectionTypes}
        sectors={sectors}
        fiscalYears={fiscalYears}
      />
      <AppFooter />
    </div>
  );
}
