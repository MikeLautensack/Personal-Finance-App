"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Account } from "@/lib/types";
import { EditAccountModal } from "./edit-account-modal";

type AccountListProps = {
  accounts: Account[];
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

const typeLabels: Record<string, string> = {
  checking: "Checking",
  savings: "Savings",
  credit_card: "Credit Card",
  investment: "Investment",
  loan: "Loan",
  cash: "Cash",
  other: "Other",
};

const typeIcons: Record<string, string> = {
  checking: "🏦",
  savings: "💰",
  credit_card: "💳",
  investment: "📈",
  loan: "📋",
  cash: "💵",
  other: "📦",
};

export function AccountList({ accounts }: AccountListProps) {
  const router = useRouter();
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this account? All associated transactions will remain but will no longer be linked to this account."
      )
    )
      return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/accounts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to delete account");
      }
    } catch (error) {
      alert("Failed to delete account");
    } finally {
      setDeletingId(null);
    }
  };

  if (accounts.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
            <svg
              className="h-8 w-8 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400">
            No accounts added yet
          </p>
          <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
            Add your first account to start tracking your finances
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="group rounded-xl border border-zinc-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-xl"
                  style={{
                    backgroundColor: account.color
                      ? `${account.color}20`
                      : "#71717a20",
                  }}
                >
                  {account.icon || typeIcons[account.type] || "📦"}
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {account.name}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {typeLabels[account.type] || account.type}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => setEditingAccount(account)}
                  className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  title="Edit"
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
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(account.id)}
                  disabled={deletingId === account.id}
                  className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100 hover:text-red-600 dark:hover:bg-zinc-700 disabled:opacity-50"
                  title="Delete"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-4">
              <p
                className={`text-2xl font-bold ${
                  account.balance >= 0
                    ? account.type === "credit_card" || account.type === "loan"
                      ? "text-red-600"
                      : "text-zinc-900 dark:text-zinc-50"
                    : "text-red-600"
                }`}
              >
                {formatCurrency(Math.abs(account.balance))}
              </p>
              {account.institution && (
                <p className="mt-1 text-sm text-zinc-500">
                  {account.institution}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {editingAccount && (
        <EditAccountModal
          account={editingAccount}
          onClose={() => setEditingAccount(null)}
        />
      )}
    </>
  );
}
