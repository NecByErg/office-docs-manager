"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import RestoreButton from "./RestoreButton";

interface TrashedStaticDoc {
  id: string;
  fileName: string;
  deletedAt: Date | string | null;
  company: { name: string };
  sectionType: { label: string };
}

interface TrashedTaxClearance {
  id: string;
  fileName: string;
  fiscalYear: string;
  deletedAt: Date | string | null;
  company: { name: string };
}

interface TrashedExperienceLetter {
  id: string;
  fileName: string;
  fiscalYear: string;
  deletedAt: Date | string | null;
  company: { name: string };
  sector: { name: string };
}

interface Props {
  staticDocs: TrashedStaticDoc[];
  taxClearances: TrashedTaxClearance[];
  experienceLetters: TrashedExperienceLetter[];
}

function daysRemaining(deletedAt: Date | string | null): number {
  if (!deletedAt) return 30;
  const deletedDate = new Date(deletedAt);
  const purgeDate = new Date(deletedDate);
  purgeDate.setDate(purgeDate.getDate() + 30);
  const diffMs = purgeDate.getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export default function TrashClient({ staticDocs, taxClearances, experienceLetters }: Props) {
  const router = useRouter();
  const refresh = () => router.refresh();

  const totalItems = staticDocs.length + taxClearances.length + experienceLetters.length;

  return (
    <>
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href="/admin" className="text-xs text-gray-500 hover:underline">
            ← Back to Admin
          </Link>
          <h1 className="text-lg font-semibold text-gray-900 mt-1">Trash</h1>
          <p className="text-xs text-gray-500">
            Deleted items are kept for 30 days, then permanently removed.
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-4">
        {totalItems === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12">Trash is empty.</p>
        ) : (
          <>
            {staticDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-gray-200 rounded-md px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {doc.company.name} — {doc.sectionType.label}
                  </p>
                  <p className="text-xs text-gray-500">
                    {doc.fileName} · {daysRemaining(doc.deletedAt)} days left
                  </p>
                </div>
                <RestoreButton docType="static" docId={doc.id} onRestored={refresh} />
              </div>
            ))}

            {taxClearances.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-gray-200 rounded-md px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {doc.company.name} — Tax Clearance {doc.fiscalYear}
                  </p>
                  <p className="text-xs text-gray-500">
                    {doc.fileName} · {daysRemaining(doc.deletedAt)} days left
                  </p>
                </div>
                <RestoreButton docType="tax_clearance" docId={doc.id} onRestored={refresh} />
              </div>
            ))}

            {experienceLetters.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-gray-200 rounded-md px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {doc.company.name} — {doc.sector.name} Experience Letter ({doc.fiscalYear})
                  </p>
                  <p className="text-xs text-gray-500">
                    {doc.fileName} · {daysRemaining(doc.deletedAt)} days left
                  </p>
                </div>
                <RestoreButton docType="experience_letter" docId={doc.id} onRestored={refresh} />
              </div>
            ))}
          </>
        )}
      </main>
    </>
  );
}
