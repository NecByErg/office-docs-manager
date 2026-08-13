"use client";

import { useState } from "react";
import { SelectedDoc } from "@/types";

interface Props {
  companyId: string;
  companyName: string;
  selectedDocs: SelectedDoc[];
  onOrderChange: (docId: string, newOrder: number) => void;
  onClear: () => void;
}

export default function MergeDownloadBar({
  companyId,
  companyName,
  selectedDocs,
  onOrderChange,
  onClear,
}: Props) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  if (selectedDocs.length === 0) return null;

  async function handleDownload() {
    setDownloading(true);
    setError("");
    try {
      const res = await fetch("/api/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          selectedDocs: selectedDocs.map((d) => ({
            docType: d.docType,
            docId: d.docId,
            order: d.order,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Merge failed");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, "_");
      const today = new Date().toISOString().split("T")[0];
      a.download = `${safeCompanyName}_LegalDocuments_${today}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Something went wrong while merging.");
    } finally {
      setDownloading(false);
    }
  }

  const sorted = [...selectedDocs].sort((a, b) => a.order - b.order);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-gray-800">
            {selectedDocs.length} document{selectedDocs.length > 1 ? "s" : ""} selected — set order below
          </p>
          <button onClick={onClear} className="text-xs text-gray-500 hover:underline">
            Clear all
          </button>
        </div>

        <div className="space-y-1.5 mb-3 max-h-32 overflow-y-auto">
          {sorted.map((doc) => (
            <div key={doc.docId} className="flex items-center gap-2 text-sm">
              <input
                type="number"
                min={1}
                value={doc.order}
                onChange={(e) => onOrderChange(doc.docId, parseInt(e.target.value, 10) || 1)}
                className="w-14 border border-gray-300 rounded px-2 py-1 text-xs"
              />
              <span className="text-gray-700 truncate">{doc.label}</span>
            </div>
          ))}
        </div>

        {error && <p className="text-xs text-red-600 mb-2">{error}</p>}

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full bg-gray-900 text-white rounded-md py-2.5 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {downloading ? "Merging PDFs..." : `Download Merged PDF (${selectedDocs.length} files)`}
        </button>
      </div>
    </div>
  );
}
