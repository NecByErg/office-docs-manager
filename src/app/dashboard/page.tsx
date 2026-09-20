import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getExpectedLatestTaxClearanceFY } from "@/lib/fiscalYear";
import AppFooter from "@/components/AppFooter";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

interface CompanyWithLatestTax {
  id: string;
  name: string;
  establishmentYearBS: string;
  logoUrl?: string | null;
  taxClearances: { fiscalYear: string }[];
}

export default async function DashboardPage() {
  const companies = await prisma.company.findMany({
    orderBy: { name: "asc" },
    include: {
      taxClearances: {
        where: { isDeleted: false },
        orderBy: { fiscalYear: "desc" },
        take: 1,
      },
    },
  });

  const expectedLatestFY = getExpectedLatestTaxClearanceFY();

  const expiredCompanies = companies.filter((c: CompanyWithLatestTax) => {
    const latest = c.taxClearances[0];
    return !latest || latest.fiscalYear !== expectedLatestFY;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Office Documents Manager</h1>
            <p className="text-xs text-gray-500">By Dear Er</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md px-3 py-1.5"
            >
              Admin
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {expiredCompanies.length > 0 && (
          <div className="mb-6 border border-amber-300 bg-amber-50 rounded-md p-4">
            <p className="text-sm font-medium text-amber-800">
              ⚠ Tax Clearance renewal needed for {expiredCompanies.length}{" "}
              {expiredCompanies.length === 1 ? "company" : "companies"}:
            </p>
            <p className="text-sm text-amber-700 mt-1">
              {expiredCompanies.map((c: CompanyWithLatestTax) => c.name).join(", ")}
            </p>
          </div>
        )}

        {companies.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No companies added yet.</p>
            <Link
              href="/admin"
              className="inline-block bg-gray-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-800"
            >
              Add your first company
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {companies.map((company: CompanyWithLatestTax) => {
              const latest = company.taxClearances[0];
              const isUpToDate = latest && latest.fiscalYear === expectedLatestFY;

              return (
                <Link
                  key={company.id}
                  href={`/company/${company.id}`}
                  className="border border-gray-200 bg-white rounded-lg p-6 hover:shadow-lg hover:border-gray-300 transition"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {company.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={company.logoUrl}
                        alt={`${company.name} logo`}
                        className="w-14 h-14 rounded-full object-cover border border-gray-200 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-lg font-semibold shrink-0">
                        {company.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h2 className="company-card-name truncate">{company.name}</h2>
                      <p className="text-xs text-gray-500 mt-1">
                        Established {company.establishmentYearBS} B.S.
                      </p>
                    </div>
                  </div>
                  <div
                    className={`inline-block text-xs px-2 py-1 rounded ${
                      isUpToDate
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {isUpToDate
                      ? `Tax Clearance up to date (${latest.fiscalYear})`
                      : "Tax Clearance renewal needed"}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <AppFooter />
    </div>
  );
}
