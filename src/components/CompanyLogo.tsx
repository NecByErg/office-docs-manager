"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface Props {
  companyId: string;
  companyName: string;
  logoUrl?: string | null;
}

export default function CompanyLogo({ companyId, companyName, logoUrl }: Props) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleFileSelect(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/companies/${companyId}/logo`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Logo upload failed");
      }
    } catch {
      alert("Logo upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={`${companyName} logo`}
          className="w-12 h-12 rounded-full object-cover border border-gray-200"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-semibold">
          {companyName.charAt(0).toUpperCase()}
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
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
        className="text-xs text-gray-500 hover:text-gray-800 hover:underline disabled:opacity-50"
      >
        {uploading ? "Uploading..." : logoUrl ? "Change logo" : "Add logo"}
      </button>
    </div>
  );
}
