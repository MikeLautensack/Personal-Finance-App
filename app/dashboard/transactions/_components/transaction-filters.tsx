"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Account, Category, TransactionType } from "@/lib/types";

type TransactionFiltersProps = {
  currentType: string;
  currentMonth: string;
  accounts: Account[];
  categories: Category[];
};

export function TransactionFilters({
  currentType,
  currentMonth,
  accounts,
  categories,
}: TransactionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "" || value === "all") {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });

      return newParams.toString();
    },
    [searchParams]
  );

  const handleTypeChange = (type: string) => {
    const query = createQueryString({ type: type === "all" ? null : type });
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  };

  const handleMonthChange = (month: string) => {
    const query = createQueryString({ month });
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  };

  const filterTypes: {
    id: TransactionType | "all";
    label: string;
    activeClass: string;
    inactiveClass: string;
  }[] = [
    {
      id: "all",
      label: "All",
      activeClass: "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900",
      inactiveClass:
        "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700",
    },
    {
      id: "income",
      label: "Income",
      activeClass: "bg-green-600 text-white",
      inactiveClass:
        "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50",
    },
    {
      id: "expense",
      label: "Expenses",
      activeClass: "bg-red-600 text-white",
      inactiveClass:
        "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50",
    },
    {
      id: "transfer",
      label: "Transfers",
      activeClass: "bg-blue-600 text-white",
      inactiveClass:
        "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50",
    },
  ];

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {filterTypes.map((filter) => (
        <button
          key={filter.id}
          onClick={() => handleTypeChange(filter.id)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            currentType === filter.id
              ? filter.activeClass
              : filter.inactiveClass
          }`}
        >
          {filter.label}
        </button>
      ))}

      <div className="ml-auto flex items-center gap-2">
        <input
          type="month"
          value={currentMonth}
          onChange={(e) => handleMonthChange(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>
    </div>
  );
}
