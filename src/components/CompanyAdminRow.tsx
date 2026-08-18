"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  name: string;
  establishmentYearBS: string;
}

export default function CompanyAdminRow({ id, name, establishmentYearBS }: Props) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editYear, setEditYear] = useState(establishmentYearBS);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [deletePin, setDeletePin] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function handleSaveEdit() {
    if (!editName.trim() || !editYear.trim()) return;
    setEditLoading(true);
    setEditError("");
    try {
      const res = await fetch(`/api/companies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim(), establishmentYearBS: editYear.trim() }),
      });
      if (res.ok) {
        setIsEditing(false);
        router.refresh();
      } else {
        const data = await res.json();
        setEditError(data.error || "Update failed");
      }
    } catch {
      setEditError("Something went wrong");
    } finally {
      setEditLoading(false);
    }
  }

  async function handleConfirmDelete() {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const res = await fetch(`/api/companies/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminPin: deletePin }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        setDeleteError(data.error || "Delete failed");
      }
    } catch {
      setDeleteError("Something went wrong");
    } finally {
      setDeleteLoading(false);
    }
  }

  if (isEditing) {
    return (
      <div className="border border-gray-200 rounded-md px-3 py-2 bg-gray-50 space-y-2">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="flex-1 min-w-[160px] border border-gray-300 rounded px-2 py-1.5 text-sm"
            placeholder="Company name"
          />
          <input
            type="text"
            value={editYear}
            onChange={(e) => setEditYear(e.target.value)}
            className="w-40 border border-gray-300 rounded px-2 py-1.5 text-sm"
            placeholder="Establishment year (B.S.)"
          />
        </div>
        {editError && <p className="text-xs text-red-600">{editError}</p>}
        <div className="flex gap-2">
          <button
            onClick={handleSaveEdit}
            disabled={editLoading}
            className="text-xs bg-gray-900 text-white rounded px-3 py-1.5 disabled:opacity-50"
          >
            {editLoading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditName(name);
              setEditYear(establishmentYearBS);
              setEditError("");
            }}
            className="text-xs text-gray-500 px-2"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-100 rounded-md px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <Link href={`/company/${id}`} className="flex-1 min-w-0 hover:underline">
          <span className="text-sm text-gray-800">{name}</span>
          <span className="text-xs text-gray-500 ml-2">{establishmentYearBS} B.S.</span>
        </Link>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-blue-600 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => setShowDeletePrompt(true)}
            className="text-xs text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>

      {showDeletePrompt && (
        <div className="mt-2 pt-2 border-t border-gray-100 space-y-2">
          <p className="text-xs text-red-700 bg-red-50 rounded px-2 py-1.5">
            ⚠ यसले {name} को सबै document (Registration, VAT, Tax Clearance, Experience Letters सबै) सधैंको लागि हराउँछ — trash मा जाँदैन, फिर्ता ल्याउन मिल्दैन। Admin PIN हालेर confirm गर्नुहोस्।
          </p>
          <div className="flex items-center gap-2">
            <input
              type="password"
              value={deletePin}
              onChange={(e) => setDeletePin(e.target.value)}
              placeholder="Admin PIN"
              autoFocus
              className="w-32 border border-gray-300 rounded px-2 py-1 text-xs"
            />
            <button
              onClick={handleConfirmDelete}
              disabled={deleteLoading || !deletePin}
              className="text-xs bg-red-600 text-white rounded px-2 py-1 disabled:opacity-50"
            >
              {deleteLoading ? "Deleting..." : "Confirm Delete"}
            </button>
            <button
              onClick={() => {
                setShowDeletePrompt(false);
                setDeletePin("");
                setDeleteError("");
              }}
              className="text-xs text-gray-500 px-1"
            >
              Cancel
            </button>
          </div>
          {deleteError && <p className="text-xs text-red-600">{deleteError}</p>}
        </div>
      )}
    </div>
  );
}
