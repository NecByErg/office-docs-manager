"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Company, SectionType, Sector, SelectedDoc } from "@/types";
import StaticDocumentsSection from "./StaticDocumentsSection";
import TaxClearanceSection from "./TaxClearanceSection";
import ExperienceLettersSection from "./ExperienceLettersSection";
import MergeDownloadBar from "./MergeDownloadBar";
import CompanyLogo from "./CompanyLogo";
import LetterheadSection from "./LetterheadSection";

interface Props {
  company: Company;
  sectionTypes: SectionType[];
  sectors: Sector[];
  fiscalYears: string[];
}

export default function CompanyDetailClient({
  company,
  sectionTypes,
  sectors,
  fiscalYears,
}: Props) {
  const router = useRouter();
  const [selectedDocs, setSelectedDocs] = useState<SelectedDoc[]>([]);

  // Upload/delete pachi latest data lyauna page refresh garne (server component re-fetch garxa)
  const handleRefresh = useCallback(() => {
    router.refresh();
  }, [router]);

  function handleToggleSelect(doc: SelectedDoc) {
    setSelectedDocs((prev) => {
      const exists = prev.find((d) => d.docId === doc.docId);
      if (exists) {
        return prev.filter((d) => d.docId !== doc.docId);
      }
      return [...prev, doc];
    });
  }

  function handleOrderChange(docId: string, newOrder: number) {
    setSelectedDocs((prev) =>
      prev.map((d) => (d.docId === docId ? { ...d, order: newOrder } : d))
    );
  }

  function handleClear() {
    setSelectedDocs([]);
  }

  return (
    <>
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/dashboard" className="text-xs text-gray-500 hover:underline">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-4 mt-2">
            <CompanyLogo companyId={company.id} companyName={company.name} logoUrl={company.logoUrl} />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{company.name}</h1>
              <p className="text-xs text-gray-500">Established {company.establishmentYearBS} B.S.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-5 pb-40">
        <LetterheadSection
          companyId={company.id}
          letterheadUrl={company.letterheadUrl}
          letterheadFileName={company.letterheadFileName}
          onRefresh={handleRefresh}
        />

        <StaticDocumentsSection
          companyId={company.id}
          documents={company.documents}
          sectionTypes={sectionTypes}
          selectedDocs={selectedDocs}
          onToggleSelect={handleToggleSelect}
          onRefresh={handleRefresh}
        />

        <TaxClearanceSection
          companyId={company.id}
          taxClearances={company.taxClearances}
          fiscalYears={fiscalYears}
          selectedDocs={selectedDocs}
          onToggleSelect={handleToggleSelect}
          onRefresh={handleRefresh}
        />

        <ExperienceLettersSection
          companyId={company.id}
          experienceLetters={company.experienceLetters}
          sectors={sectors}
          fiscalYears={fiscalYears}
          selectedDocs={selectedDocs}
          onToggleSelect={handleToggleSelect}
          onRefresh={handleRefresh}
        />
      </main>

      <MergeDownloadBar
        companyId={company.id}
        companyName={company.name}
        selectedDocs={selectedDocs}
        onOrderChange={handleOrderChange}
        onClear={handleClear}
      />
    </>
  );
}
