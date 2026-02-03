"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { AccountType } from "@/lib/types";

type AccountFiltersProps = {
  currentType: string;
};

const accountTypes: { id: AccountType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "checking", label: "Checking" },
  { id: "savings", label: "Savings" },
  { id: "credit_card", label: "Credit Cards" },
  { id: "investment", label: "Investments" },
  { id: "loan", label: "Loans" },
  { id: "cash", label: "Cash" },
];

export function AccountFilters({ currentType }: AccountFiltersProps) {
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

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      {accountTypes.map((type) => (
        <button
          key={type.id}
          onClick={() => handleTypeChange(type.id)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            currentType === type.id
              ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          }`}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
}
