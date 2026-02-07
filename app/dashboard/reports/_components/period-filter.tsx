"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const periods = [
  { id: "this_month", label: "This Month" },
  { id: "last_month", label: "Last Month" },
  { id: "last_3_months", label: "Last 3 Months" },
  { id: "last_6_months", label: "Last 6 Months" },
  { id: "this_year", label: "This Year" },
  { id: "last_year", label: "Last Year" },
];

type PeriodFilterProps = {
  currentPeriod: string;
};

export function PeriodFilter({ currentPeriod }: PeriodFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (e.target.value === "this_month") {
      newParams.delete("period");
    } else {
      newParams.set("period", e.target.value);
    }
    const query = newParams.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  };

  return (
    <div className="mb-6 flex flex-wrap items-center gap-4">
      <select
        value={currentPeriod}
        onChange={handleChange}
        className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
      >
        {periods.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>
    </div>
  );
}
