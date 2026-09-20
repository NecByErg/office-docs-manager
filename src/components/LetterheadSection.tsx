"use client";

import { useState, useRef } from "react";

interface Props {
  companyId: string;
  letterheadUrl?: string | null;
  letterheadFileName?: string | null;
  onRefresh: () => void;
}

export default function LetterheadSection({
  companyId,
  letterheadUrl,
  letterheadFileName,
  onRefresh,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleFileSelect(file: File) {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uploadType", "letterhead");
      formData.append("companyId", companyId);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
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
      <h2 className="font-semibold text-gray-900 mb-4">Letterhead (Word)</h2>

      <div className="flex items-center justify-between border border-gray-100 rounded-md px-3 py-2.5">
        <div className="min-w-0">
          {letterheadFileName ? (
            <p className="text-sm font-medium text-gray-800 truncate">{letterheadFileName}</p>
          ) : (
            <p className="text-xs text-gray-400">Not uploaded</p>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {letterheadUrl && (
            <a
            
              href={letterheadUrl}
              download={letterheadFileName || "letterhead.docx"}
              className="text-xs text-blue-600 hover:underline"
            >
              Download
            </a>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".doc,.docx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="text-xs bg-gray-900 text-white rounded px-2.5 py-1 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : letterheadUrl ? "Replace" : "Upload"}
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </section>
  );
}
