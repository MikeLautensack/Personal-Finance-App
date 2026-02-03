"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

type CategoryTabsProps = {
  activeTab: string;
  expenseCount: number;
  incomeCount: number;
};

export function CategoryTabs({
  activeTab,
  expenseCount,
  incomeCount,
}: CategoryTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });

      return newParams.toString();
    },
    [searchParams]
  );

  const handleTabChange = (type: string) => {
    const query = createQueryString({ type: type === "expense" ? null : type });
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  };

  return (
    <div className="mb-6 flex gap-2">
      <button
        onClick={() => handleTabChange("expense")}
        className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
          activeTab === "expense"
            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
        }`}
      >
        Expense Categories ({expenseCount})
      </button>
      <button
        onClick={() => handleTabChange("income")}
        className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
          activeTab === "income"
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
        }`}
      >
        Income Categories ({incomeCount})
      </button>
    </div>
  );
}
