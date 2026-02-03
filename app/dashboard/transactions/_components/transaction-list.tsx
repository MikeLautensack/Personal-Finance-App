"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Transaction, Account, Category } from "@/lib/types";
import { EditTransactionModal } from "./edit-transaction-modal";

type TransactionListProps = {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TransactionList({
  transactions,
  accounts,
  categories,
}: TransactionListProps) {
  const router = useRouter();
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to delete transaction");
      }
    } catch (error) {
      alert("Failed to delete transaction");
    } finally {
      setDeletingId(null);
    }
  };

  if (transactions.length === 0) {
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400">
            No transactions found
          </p>
          <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
            Add your first transaction or adjust your filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
                  style={{
                    backgroundColor: transaction.category?.color
                      ? `${transaction.category.color}20`
                      : "#71717a20",
                  }}
                >
                  {transaction.category?.icon ||
                    (transaction.type === "transfer" ? "↔️" : "📦")}
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {transaction.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <span>{formatDate(transaction.date)}</span>
                    <span>•</span>
                    <span>
                      {transaction.account?.name || "Unknown Account"}
                    </span>
                    {transaction.type === "transfer" &&
                      transaction.transfer_account && (
                        <>
                          <span>→</span>
                          <span>{transaction.transfer_account.name}</span>
                        </>
                      )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p
                  className={`font-semibold ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : transaction.type === "expense"
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                >
                  {transaction.type === "income"
                    ? "+"
                    : transaction.type === "expense"
                    ? "-"
                    : ""}
                  {formatCurrency(transaction.amount)}
                </p>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingTransaction(transaction)}
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
                    onClick={() => handleDelete(transaction.id)}
                    disabled={deletingId === transaction.id}
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
            </div>
          ))}
        </div>
      </div>

      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          accounts={accounts}
          categories={categories}
          onClose={() => setEditingTransaction(null)}
        />
      )}
    </>
  );
}
