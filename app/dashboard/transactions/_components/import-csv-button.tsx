"use client";

import { useState } from "react";
import { Account } from "@/lib/types";
import { ImportCSVModal } from "./import-csv-modal";

type ImportCSVButtonProps = {
  accounts: Account[];
};

export function ImportCSVButton({ accounts }: ImportCSVButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white px-6 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
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
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        Import CSV
      </button>

      {showModal && (
        <ImportCSVModal
          accounts={accounts}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
