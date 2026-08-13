"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("Incorrect PIN. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm border border-gray-200 rounded-md bg-white p-8">
          <h1 className="text-xl font-semibold text-gray-900 text-center mb-1">
            Office Documents Manager
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6">By Dear Er</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="pin" className="block text-sm text-gray-700 mb-1">
                Access PIN
              </label>
              <input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                autoFocus
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Enter shared PIN"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white rounded-md py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Checking..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      <footer className="text-center py-6 px-4 text-xs text-gray-400 space-y-1">
        <p>
          This system is for authorized internal team use only. Documents stored here
          are confidential and intended solely for company operational purposes.
        </p>
        <p>Thanks to the team who made this possible.</p>
      </footer>
    </div>
  );
}
