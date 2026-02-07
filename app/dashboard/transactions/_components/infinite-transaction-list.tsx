"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  Transaction,
  Account,
  Category,
  PaginatedResponse,
} from "@/lib/types";
import { EditTransactionModal } from "./edit-transaction-modal";

type InfiniteTransactionListProps = {
  accounts: Account[];
  categories: Category[];
  defaultMonth: string;
};

const PAGE_SIZE = 30;

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

async function fetchTransactions(
  params: URLSearchParams,
  cursor: number,
  defaultMonth: string
): Promise<PaginatedResponse<Transaction>> {
  const url = new URL("/api/transactions", window.location.origin);

  // Copy all existing search params (filters)
  params.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  // Apply default month if not explicitly set in URL
  // This keeps the client-side list in sync with the server-side summary
  if (!url.searchParams.has("month")) {
    url.searchParams.set("month", defaultMonth);
  }

  // Add pagination params
  url.searchParams.set("cursor", cursor.toString());
  url.searchParams.set("limit", PAGE_SIZE.toString());

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }
  return response.json();
}

export function InfiniteTransactionList({
  accounts,
  categories,
  defaultMonth,
}: InfiniteTransactionListProps) {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Build a stable key that includes the effective month
  // (either from URL or the server-provided default)
  const effectiveMonth = searchParams.get("month") || defaultMonth;
  const filterKey = searchParams.toString() || `month=${effectiveMonth}`;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["transactions", filterKey],
    queryFn: ({ pageParam }) =>
      fetchTransactions(searchParams, pageParam, defaultMonth),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 0,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  // Build lookup maps for account/category names
  const accountMap = new Map(accounts.map((a) => [a.id, a]));
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Invalidate the query to refetch
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
      } else {
        alert("Failed to delete transaction");
      }
    } catch {
      alert("Failed to delete transaction");
    } finally {
      setDeletingId(null);
    }
  };

  const allTransactions =
    data?.pages.flatMap((page) => page.data) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="h-10 w-10 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-3 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
              </div>
              <div className="h-5 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">
          Failed to load transactions: {(error as Error).message}
        </p>
        <button
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
          }
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (allTransactions.length === 0) {
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
      {/* Total count */}
      <div className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
        Showing {allTransactions.length} of {total} transaction{total !== 1 ? "s" : ""}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {allTransactions.map((transaction) => {
            const account = accountMap.get(transaction.account_id);
            const category = transaction.category_id
              ? categoryMap.get(transaction.category_id)
              : undefined;
            const transferAccount = transaction.transfer_account_id
              ? accountMap.get(transaction.transfer_account_id)
              : undefined;

            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
                    style={{
                      backgroundColor: category?.color
                        ? `${category.color}20`
                        : "#71717a20",
                    }}
                  >
                    {category?.icon ||
                      (transaction.type === "transfer" ? "↔️" : "📦")}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <span>{formatDate(transaction.date)}</span>
                      <span>•</span>
                      <span>{account?.name || "Unknown Account"}</span>
                      {transaction.type === "transfer" && transferAccount && (
                        <>
                          <span>→</span>
                          <span>{transferAccount.name}</span>
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
            );
          })}
        </div>
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={loadMoreRef} className="flex justify-center py-6">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <svg
              className="h-5 w-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading more...
          </div>
        )}
        {!hasNextPage && allTransactions.length > 0 && (
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            All transactions loaded
          </p>
        )}
      </div>

      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          accounts={accounts}
          categories={categories}
          onClose={() => {
            setEditingTransaction(null);
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
          }}
        />
      )}
    </>
  );
}
