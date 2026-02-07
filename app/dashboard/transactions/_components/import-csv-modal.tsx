"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Account } from "@/lib/types";

type ImportCSVModalProps = {
  accounts: Account[];
  onClose: () => void;
};

type ImportResult = {
  imported: number;
  total: number;
  format: string;
  parseErrors?: string[];
  insertErrors?: string[];
};

export function ImportCSVModal({ accounts, onClose }: ImportCSVModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [accountId, setAccountId] = useState(accounts[0]?.id || "");
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.name.toLowerCase().endsWith(".csv") && selected.type !== "text/csv") {
        setError("Please select a CSV file");
        setFile(null);
        return;
      }
      setFile(selected);
      setError(null);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file || !accountId) return;

    setImporting(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("account_id", accountId);

      const response = await fetch("/api/transactions/import", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Import failed");
        return;
      }

      setResult(data);
      router.refresh();
    } catch {
      setError("Failed to import transactions. Please try again.");
    } finally {
      setImporting(false);
    }
  };

  const handleDone = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Import Chase CSV
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Result view */}
        {result ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
              <p className="font-medium text-emerald-800 dark:text-emerald-300">
                Successfully imported {result.imported} of {result.total}{" "}
                transactions
              </p>
              <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
                Format detected:{" "}
                {result.format === "chase_credit"
                  ? "Chase Credit Card"
                  : "Chase Checking/Savings"}
              </p>
            </div>

            {result.parseErrors && result.parseErrors.length > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  {result.parseErrors.length} row(s) skipped:
                </p>
                <ul className="mt-1 max-h-32 overflow-y-auto text-xs text-amber-600 dark:text-amber-400">
                  {result.parseErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.insertErrors && result.insertErrors.length > 0 && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                  Insert errors:
                </p>
                <ul className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {result.insertErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={handleDone}
              className="w-full rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Done
            </button>
          </div>
        ) : (
          /* Upload form */
          <div className="space-y-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Upload a CSV file exported from Chase Bank. Supports both credit
              card and checking/savings formats.
            </p>

            {/* Account selector */}
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Import to Account
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.type})
                  </option>
                ))}
              </select>
            </div>

            {/* File upload */}
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                CSV File
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 px-4 py-8 transition-colors hover:border-emerald-400 hover:bg-emerald-50/50 dark:border-zinc-700 dark:hover:border-emerald-600 dark:hover:bg-emerald-900/10"
              >
                <svg
                  className="mb-2 h-8 w-8 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                {file ? (
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {file.name}{" "}
                    <span className="text-zinc-500">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Click to select a CSV file
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      Chase credit card or checking/savings CSV
                    </p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.CSV,text/csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 rounded-full border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!file || !accountId || importing}
                className="flex-1 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {importing ? "Importing..." : "Import"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
