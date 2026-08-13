"use client";

import { useState } from "react";

interface Props {
  docType: "static" | "tax_clearance" | "experience_letter";
  docId: string;
  onRestored: () => void;
}

export default function RestoreButton({ docType, docId, onRestored }: Props) {
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/documents/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docType, docId, adminPin: pin }),
      });
      if (res.ok) {
        setShowPinPrompt(false);
        setPin("");
        onRestored();
      } else {
        const data = await res.json();
        setError(data.error || "Restore failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (showPinPrompt) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Admin PIN"
          autoFocus
          className="w-24 border border-gray-300 rounded px-2 py-1 text-xs"
        />
        <button
          onClick={handleConfirm}
          disabled={loading || !pin}
          className="text-xs bg-green-600 text-white rounded px-2 py-1 disabled:opacity-50"
        >
          {loading ? "..." : "Confirm"}
        </button>
        <button onClick={() => setShowPinPrompt(false)} className="text-xs text-gray-500 px-1">
          Cancel
        </button>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowPinPrompt(true)}
      className="text-xs text-green-700 hover:underline"
    >
      Restore
    </button>
  );
}
