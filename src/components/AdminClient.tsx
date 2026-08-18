"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SectionType, Sector } from "@/types";
import CompanyAdminRow from "./CompanyAdminRow";

interface CompanyRow {
  id: string;
  name: string;
  establishmentYearBS: string;
}

interface Props {
  companies: CompanyRow[];
  sectionTypes: SectionType[];
  sectors: Sector[];
}

export default function AdminClient({ companies, sectionTypes, sectors }: Props) {
  const router = useRouter();

  // Add company form
  const [companyName, setCompanyName] = useState("");
  const [establishmentYear, setEstablishmentYear] = useState("");
  const [companyLoading, setCompanyLoading] = useState(false);
  const [companyError, setCompanyError] = useState("");

  // Add section type form
  const [sectionLabel, setSectionLabel] = useState("");
  const [sectionLoading, setSectionLoading] = useState(false);

  // Add sector form
  const [sectorName, setSectorName] = useState("");
  const [sectorLoading, setSectorLoading] = useState(false);

  async function handleAddCompany(e: React.FormEvent) {
    e.preventDefault();
    setCompanyError("");
    if (!companyName.trim() || !establishmentYear.trim()) return;

    setCompanyLoading(true);
    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: companyName.trim(), establishmentYearBS: establishmentYear.trim() }),
      });
      if (res.ok) {
        setCompanyName("");
        setEstablishmentYear("");
        router.refresh();
      } else {
        const data = await res.json();
        setCompanyError(data.error || "Failed to add company");
      }
    } catch {
      setCompanyError("Something went wrong");
    } finally {
      setCompanyLoading(false);
    }
  }

  async function handleAddSection(e: React.FormEvent) {
    e.preventDefault();
    if (!sectionLabel.trim()) return;
    setSectionLoading(true);
    try {
      const res = await fetch("/api/section-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: sectionLabel.trim() }),
      });
      if (res.ok) {
        setSectionLabel("");
        router.refresh();
      }
    } finally {
      setSectionLoading(false);
    }
  }

  async function handleAddSector(e: React.FormEvent) {
    e.preventDefault();
    if (!sectorName.trim()) return;
    setSectorLoading(true);
    try {
      const res = await fetch("/api/sectors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: sectorName.trim() }),
      });
      if (res.ok) {
        setSectorName("");
        router.refresh();
      }
    } finally {
      setSectorLoading(false);
    }
  }

  return (
    <>
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="text-xs text-gray-500 hover:underline">
              ← Back to Dashboard
            </Link>
            <h1 className="text-lg font-semibold text-gray-900 mt-1">Admin</h1>
          </div>
          <Link
            href="/trash"
            className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md px-3 py-1.5"
          >
            Trash
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-5">
        {/* Add Company */}
        <section className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Add Company</h2>
          <form onSubmit={handleAddCompany} className="flex flex-wrap gap-2 items-start">
            <input
              type="text"
              placeholder="Company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="flex-1 min-w-[200px] border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Establishment year (B.S.), e.g. 2070"
              value={establishmentYear}
              onChange={(e) => setEstablishmentYear(e.target.value)}
              className="w-56 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={companyLoading}
              className="bg-gray-900 text-white rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {companyLoading ? "Adding..." : "Add"}
            </button>
          </form>
          {companyError && <p className="text-xs text-red-600 mt-2">{companyError}</p>}

          <div className="mt-4 space-y-1.5">
            {companies.map((c) => (
              <CompanyAdminRow
                key={c.id}
                id={c.id}
                name={c.name}
                establishmentYearBS={c.establishmentYearBS}
              />
            ))}
          </div>
        </section>

        {/* Add Custom Document Section */}
        <section className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="font-semibold text-gray-900 mb-1">Document Sections</h2>
          <p className="text-xs text-gray-500 mb-3">
            Registration Certificate and VAT Registration are default. Add more if needed
            (e.g. Renewal Certificate, PAN Registration).
          </p>
          <form onSubmit={handleAddSection} className="flex gap-2">
            <input
              type="text"
              placeholder="New section name"
              value={sectionLabel}
              onChange={(e) => setSectionLabel(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={sectionLoading}
              className="bg-gray-900 text-white rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {sectionLoading ? "Adding..." : "Add"}
            </button>
          </form>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {sectionTypes.map((s) => (
              <span
                key={s.id}
                className="text-xs bg-gray-100 text-gray-700 rounded px-2 py-1"
              >
                {s.label} {s.isDefault && <span className="text-gray-400">(default)</span>}
              </span>
            ))}
          </div>
        </section>

        {/* Add Custom Sector */}
        <section className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="font-semibold text-gray-900 mb-1">Experience Letter Sectors</h2>
          <p className="text-xs text-gray-500 mb-3">
            Road, Bridge, Structure, Water Supply, Sanitation are default. Add more sectors if needed.
          </p>
          <form onSubmit={handleAddSector} className="flex gap-2">
            <input
              type="text"
              placeholder="New sector name (e.g. Irrigation)"
              value={sectorName}
              onChange={(e) => setSectorName(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={sectorLoading}
              className="bg-gray-900 text-white rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {sectorLoading ? "Adding..." : "Add"}
            </button>
          </form>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {sectors.map((s) => (
              <span key={s.id} className="text-xs bg-gray-100 text-gray-700 rounded px-2 py-1">
                {s.name}
              </span>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
