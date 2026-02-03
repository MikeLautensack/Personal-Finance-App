"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Account, Category, Transaction, TransactionType } from "@/lib/types";

type EditTransactionModalProps = {
  transaction: Transaction;
  accounts: Account[];
  categories: Category[];
  onClose: () => void;
};

const transactionTypes: { id: TransactionType; name: string; color: string }[] =
  [
    { id: "expense", name: "Expense", color: "red" },
    { id: "income", name: "Income", color: "green" },
    { id: "transfer", name: "Transfer", color: "blue" },
  ];

export function EditTransactionModal({
  transaction,
  accounts,
  categories,
  onClose,
}: EditTransactionModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, setType] = useState<TransactionType>(transaction.type);
  const [error, setError] = useState<string | null>(null);

  const filteredCategories = categories.filter((c) =>
    type === "transfer" ? false : c.type === type
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const body = {
      type,
      description: formData.get("description") as string,
      amount: parseFloat(formData.get("amount") as string),
      date: formData.get("date") as string,
      account_id: formData.get("account_id") as string,
      category_id:
        type !== "transfer"
          ? (formData.get("category_id") as string) || undefined
          : undefined,
      transfer_account_id:
        type === "transfer"
          ? (formData.get("transfer_account_id") as string)
          : undefined,
      notes: (formData.get("notes") as string) || undefined,
    };

    try {
      const response = await fetch(`/api/transactions/${transaction.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update transaction");
      }

      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Edit Transaction
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <svg
              className="h-6 w-6"
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

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Type
            </label>
            <div className="mt-2 flex gap-2">
              {transactionTypes.map((t) => (
                <label
                  key={t.id}
                  className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 p-3 transition-colors ${
                    type === t.id
                      ? t.color === "red"
                        ? "border-red-500 bg-red-50 text-red-700 dark:border-red-500 dark:bg-red-900/20 dark:text-red-400"
                        : t.color === "green"
                        ? "border-green-500 bg-green-50 text-green-700 dark:border-green-500 dark:bg-green-900/20 dark:text-green-400"
                        : "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-400"
                      : "border-zinc-200 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={t.id}
                    checked={type === t.id}
                    onChange={() => setType(t.id)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{t.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Description
            </label>
            <input
              type="text"
              name="description"
              required
              defaultValue={transaction.description}
              className="mt-1 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Amount
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                  $
                </span>
                <input
                  type="number"
                  name="amount"
                  step="0.01"
                  min="0.01"
                  required
                  defaultValue={transaction.amount}
                  className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 pl-8 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Date
              </label>
              <input
                type="date"
                name="date"
                required
                defaultValue={transaction.date}
                className="mt-1 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {type === "transfer" ? "From Account" : "Account"}
            </label>
            <select
              name="account_id"
              required
              defaultValue={transaction.account_id}
              className="mt-1 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="">Select an account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.icon} {account.name}
                </option>
              ))}
            </select>
          </div>

          {type === "transfer" && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                To Account
              </label>
              <select
                name="transfer_account_id"
                required
                defaultValue={transaction.transfer_account_id}
                className="mt-1 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="">Select destination account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.icon} {account.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {type !== "transfer" && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Category
              </label>
              <select
                name="category_id"
                defaultValue={transaction.category_id}
                className="mt-1 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="">Select a category</option>
                {filteredCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              rows={2}
              defaultValue={transaction.notes}
              placeholder="Add any notes..."
              className="mt-1 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
