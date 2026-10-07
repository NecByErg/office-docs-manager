import { prisma } from "@/lib/prisma";
import SuchidartaClient from "@/components/SuchidartaClient";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import AppFooter from "@/components/AppFooter";

export const dynamic = "force-dynamic";

export default async function SuchidartaPage() {
  const companies = await prisma.company.findMany({
    where: {
      OR: [
        { name: { contains: "BI Engineering" } },
        { name: { contains: "Netreshwori" } },
        { name: { contains: "Diligent" } },
        { name: { contains: "Matamandali" } },
        { name: { contains: "Midas" } },
        { name: { contains: "Hints" } },
      ],
    },
    include: {
      documents: {
        include: { sectionType: true },
        where: { isDeleted: false },
      },
      taxClearances: {
        where: { isDeleted: false },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Office Documents Manager
            </h1>
            <p className="text-xs text-gray-500">Suchidarta Generator — By Dear Er</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md px-3 py-1.5"
            >
              ← Dashboard
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <SuchidartaClient companies={companies} />
      </main>

      <AppFooter />
    </div>
  );
}
