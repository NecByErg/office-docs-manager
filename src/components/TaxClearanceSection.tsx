"use client";

import { useState } from "react";
import { TaxClearance, SelectedDoc } from "@/types";
import DeleteButton from "./DeleteButton";

interface Props {
  companyId: string;
  taxClearances: TaxClearance[];
  fiscalYears: string[];
  selectedDocs: SelectedDoc[];
  onToggleSelect: (doc: SelectedDoc) => void;
  onRefresh: () => void;
}

export default function TaxClearanceSection({
  companyId,
  taxClearances,
  fiscalYears,
  selectedDocs,
  onToggleSelect,
  onRefresh,
}: Props) {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedYear, setSelectedYear] = useState(fiscalYears[0] || "");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadedYears = new Set(taxClearances.map((t) => t.fiscalYear));

  async function handleUpload() {
    if (!file || !selectedYear) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uploadType", "tax_clearance");
      formData.append("companyId", companyId);
      formData.append("fiscalYear", selectedYear);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        setShowUploadForm(false);
        setFile(null);
        onRefresh();
      } else {
        const data = await res.json();
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Tax Clearance</h2>
        <button
          onClick={() => setShowUploadForm((v) => !v)}
          className="text-xs bg-gray-900 text-white rounded px-2.5 py-1.5"
        >
          + Add Year
        </button>
      </div>

      {showUploadForm && (
        <div className="mb-4 border border-gray-200 rounded-md p-3 bg-gray-50 space-y-2">
          <div className="flex gap-2 items-center">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1.5"
            >
              {fiscalYears.map((year) => (
                <option key={year} value={year}>
                  {year} {uploadedYears.has(year) ? "(will replace existing)" : ""}
                </option>
              ))}
            </select>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="text-sm"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="text-xs bg-gray-900 text-white rounded px-3 py-1.5 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
            <button
              onClick={() => setShowUploadForm(false)}
              className="text-xs text-gray-500 px-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {taxClearances.length === 0 ? (
        <p className="text-sm text-gray-400">No tax clearance documents yet.</p>
      ) : (
        <div className="space-y-2">
          {taxClearances.map((tc) => {
            const isSelected = selectedDocs.some((s) => s.docId === tc.id);
            return (
              <div
                key={tc.id}
                className="flex items-center justify-between border border-gray-100 rounded-md px-3 py-2.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() =>
                      onToggleSelect({
                        docType: "tax_clearance",
                        docId: tc.id,
                        order: selectedDocs.length + 1,
                        label: `Tax Clearance ${tc.fiscalYear}`,
                      })
                    }
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800">
                      {tc.fiscalYear}{" "}
                      {tc.isLatest && (
                        <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded ml-1">
                          Latest
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{tc.fileName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={tc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View
                  </a>
                  <DeleteButton docType="tax_clearance" docId={tc.id} onDeleted={onRefresh} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
