"use client";

import { useState, useRef } from "react";
import { CompanyDocument, SectionType, SelectedDoc } from "@/types";
import DeleteButton from "./DeleteButton";

interface Props {
  companyId: string;
  documents: CompanyDocument[];
  sectionTypes: SectionType[];
  selectedDocs: SelectedDoc[];
  onToggleSelect: (doc: SelectedDoc) => void;
  onRefresh: () => void;
}

export default function StaticDocumentsSection({
  companyId,
  documents,
  sectionTypes,
  selectedDocs,
  onToggleSelect,
  onRefresh,
}: Props) {
  const [uploadingSectionId, setUploadingSectionId] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  async function handleFileSelect(sectionTypeId: string, file: File) {
    setUploadingSectionId(sectionTypeId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uploadType", "static");
      formData.append("companyId", companyId);
      formData.append("sectionTypeId", sectionTypeId);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        onRefresh();
      } else {
        const data = await res.json();
        alert(data.error || "Upload failed");
      }
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploadingSectionId(null);
    }
  }

  return (
    <section className="bg-white border border-gray-200 rounded-lg p-5">
      <h2 className="font-semibold text-gray-900 mb-4">Legal Documents</h2>
      <div className="space-y-3">
        {sectionTypes.map((section) => {
          const doc = documents.find((d) => d.sectionTypeId === section.id);
          const isSelected = selectedDocs.some((s) => s.docId === doc?.id);
          const isUploading = uploadingSectionId === section.id;

          return (
            <div
              key={section.id}
              className="flex items-center justify-between border border-gray-100 rounded-md px-3 py-2.5"
            >
              <div className="flex items-center gap-3 min-w-0">
                {doc && (
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() =>
                      onToggleSelect({
                        docType: "static",
                        docId: doc.id,
                        order: selectedDocs.length + 1,
                        label: `${section.label}`,
                      })
                    }
                    className="shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800">{section.label}</p>
                  {doc ? (
                    <p className="text-xs text-gray-500 truncate">{doc.fileName}</p>
                  ) : (
                    <p className="text-xs text-gray-400">Not uploaded</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {doc && (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View
                  </a>
                )}
                <input
                  ref={(el) => {
                    fileInputRefs.current[section.id] = el;
                  }}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(section.id, file);
                    e.target.value = "";
                  }}
                />
                <button
                  onClick={() => fileInputRefs.current[section.id]?.click()}
                  disabled={isUploading}
                  className="text-xs bg-gray-900 text-white rounded px-2.5 py-1 disabled:opacity-50"
                >
                  {isUploading ? "Uploading..." : doc ? "Replace" : "Upload"}
                </button>
                {doc && (
                  <DeleteButton docType="static" docId={doc.id} onDeleted={onRefresh} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
