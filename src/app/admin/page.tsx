import { prisma } from "@/lib/prisma";
import AdminClient from "@/components/AdminClient";
import AppFooter from "@/components/AppFooter";

export default async function AdminPage() {
  const [companies, sectionTypes, sectors] = await Promise.all([
    prisma.company.findMany({ orderBy: { name: "asc" } }),
    prisma.documentSectionType.findMany({ orderBy: [{ isDefault: "desc" }, { label: "asc" }] }),
    prisma.sector.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminClient companies={companies} sectionTypes={sectionTypes} sectors={sectors} />
      <AppFooter />
    </div>
  );
}
