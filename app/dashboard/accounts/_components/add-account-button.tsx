"use client";

import { useState } from "react";
import { AddAccountModal } from "./add-account-modal";

export function AddAccountButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Account
      </button>

      {showModal && <AddAccountModal onClose={() => setShowModal(false)} />}
    </>
  );
}
