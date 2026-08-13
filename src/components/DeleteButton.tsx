"use client";

import { useState } from "react";

interface DeleteButtonProps {
  docType: "static" | "tax_clearance" | "experience_letter";
  docId: string;
  onDeleted: () => void;
}

export default function DeleteButton({ docType, docId, onDeleted }: DeleteButtonProps) {
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleConfirmDelete() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/documents/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docType, docId, adminPin: pin }),
      });

      if (res.ok) {
        setShowPinPrompt(false);
        setPin("");
        onDeleted();
      } else {
        const data = await res.json();
        setError(data.error || "Delete failed");
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
          onClick={handleConfirmDelete}
          disabled={loading || !pin}
          className="text-xs bg-red-600 text-white rounded px-2 py-1 disabled:opacity-50"
        >
          {loading ? "..." : "Confirm"}
        </button>
        <button
          onClick={() => {
            setShowPinPrompt(false);
            setPin("");
            setError("");
          }}
          className="text-xs text-gray-500 px-1"
        >
          Cancel
        </button>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowPinPrompt(true)}
      className="text-xs text-red-600 hover:text-red-700 hover:underline"
    >
      Delete
    </button>
  );
}
