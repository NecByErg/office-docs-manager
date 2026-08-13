"use client";

import { useState, useMemo } from "react";
import { ExperienceLetter, Sector, SelectedDoc, PROVINCES } from "@/types";
import DeleteButton from "./DeleteButton";

interface Props {
  companyId: string;
  experienceLetters: ExperienceLetter[];
  sectors: Sector[];
  fiscalYears: string[];
  selectedDocs: SelectedDoc[];
  onToggleSelect: (doc: SelectedDoc) => void;
  onRefresh: () => void;
}

export default function ExperienceLettersSection({
  companyId,
  experienceLetters,
  sectors,
  fiscalYears,
  selectedDocs,
  onToggleSelect,
  onRefresh,
}: Props) {
  // Filters
  const [filterYear, setFilterYear] = useState("all");
  const [filterSector, setFilterSector] = useState("all");
  const [filterProvince, setFilterProvince] = useState("all");

  // Upload form state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadYear, setUploadYear] = useState(fiscalYears[0] || "");
  const [uploadSectorId, setUploadSectorId] = useState(sectors[0]?.id || "");
  const [uploadProvince, setUploadProvince] = useState(PROVINCES[0].value);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    return experienceLetters.filter((el) => {
      if (filterYear !== "all" && el.fiscalYear !== filterYear) return false;
      if (filterSector !== "all" && el.sectorId !== filterSector) return false;
      if (filterProvince !== "all" && el.province !== filterProvince) return false;
      return true;
    });
  }, [experienceLetters, filterYear, filterSector, filterProvince]);

  async function handleUpload() {
    if (!file || !uploadYear || !uploadSectorId || !uploadProvince) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uploadType", "experience_letter");
      formData.append("companyId", companyId);
      formData.append("fiscalYear", uploadYear);
      formData.append("sectorId", uploadSectorId);
      formData.append("province", uploadProvince);

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
        <h2 className="font-semibold text-gray-900">Experience Letters</h2>
        <button
          onClick={() => setShowUploadForm((v) => !v)}
          className="text-xs bg-gray-900 text-white rounded px-2.5 py-1.5"
        >
          + Add Letter
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="text-xs border border-gray-300 rounded px-2 py-1.5"
        >
          <option value="all">All Fiscal Years</option>
          {fiscalYears.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select
          value={filterSector}
          onChange={(e) => setFilterSector(e.target.value)}
          className="text-xs border border-gray-300 rounded px-2 py-1.5"
        >
          <option value="all">All Sectors</option>
          {sectors.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select
          value={filterProvince}
          onChange={(e) => setFilterProvince(e.target.value)}
          className="text-xs border border-gray-300 rounded px-2 py-1.5"
        >
          <option value="all">All Provinces</option>
          {PROVINCES.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      {/* Upload form */}
      {showUploadForm && (
        <div className="mb-4 border border-gray-200 rounded-md p-3 bg-gray-50 space-y-2">
          <div className="flex flex-wrap gap-2">
            <select
              value={uploadYear}
              onChange={(e) => setUploadYear(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1.5"
            >
              {fiscalYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              value={uploadSectorId}
              onChange={(e) => setUploadSectorId(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1.5"
            >
              {sectors.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <select
              value={uploadProvince}
              onChange={(e) => setUploadProvince(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1.5"
            >
              {PROVINCES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
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
            <button onClick={() => setShowUploadForm(false)} className="text-xs text-gray-500 px-2">
              Cancel
            </button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400">No experience letters match this filter.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((el) => {
            const isSelected = selectedDocs.some((s) => s.docId === el.id);
            return (
              <div
                key={el.id}
                className="flex items-center justify-between border border-gray-100 rounded-md px-3 py-2.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() =>
                      onToggleSelect({
                        docType: "experience_letter",
                        docId: el.id,
                        order: selectedDocs.length + 1,
                        label: `Experience Letter (${el.sector.name}, ${el.fiscalYear})`,
                      })
                    }
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {el.sector.name} · {el.fiscalYear} · {el.province}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{el.fileName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={el.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View
                  </a>
                  <DeleteButton docType="experience_letter" docId={el.id} onDeleted={onRefresh} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
