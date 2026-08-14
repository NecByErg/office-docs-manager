"use client";

// ==============================================
// Header Search - Company खोज्ने
// ==============================================
// Top-right ma देखिने search box. Type गर्दा matching company haru
// dropdown ma देखिन्छ, click garda सिधै teो company page ma janxa।

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface CompanyOption {
  id: string;
  name: string;
}

export default function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/companies")
      .then((res) => res.json())
      .then((data) => setCompanies(data.companies || []))
      .catch(() => setCompanies([]));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = query.trim()
    ? companies.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()))
    : [];

  function handleSelect(id: string) {
    setQuery("");
    setShowResults(false);
    router.push(`/company/${id}`);
  }

  return (
    <div ref={containerRef} className="relative w-52">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowResults(true);
        }}
        onFocus={() => setShowResults(true)}
        placeholder="Search company..."
        className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
      />
      {showResults && query.trim() && (
        <div className="absolute right-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
          {filtered.length === 0 ? (
            <p className="text-xs text-gray-400 px-3 py-2">No matching company</p>
          ) : (
            filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelect(c.id)}
                className="w-full text-left text-sm px-3 py-2 hover:bg-gray-50 text-gray-800"
              >
                {c.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
