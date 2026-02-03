import { AccountSummary } from "@/lib/types";

type AccountSummaryCardsProps = {
  summary: AccountSummary;
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function AccountSummaryCards({ summary }: AccountSummaryCardsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Total Assets
        </h3>
        <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
          {formatCurrency(summary.total_assets)}
        </p>
        <p className="mt-1 text-sm text-zinc-500">Cash + Investments</p>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Total Liabilities
        </h3>
        <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
          {formatCurrency(summary.total_liabilities)}
        </p>
        <p className="mt-1 text-sm text-zinc-500">Credit Cards + Loans</p>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Net Worth
        </h3>
        <p
          className={`mt-2 text-3xl font-bold ${
            summary.net_worth >= 0
              ? "text-zinc-900 dark:text-zinc-50"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {formatCurrency(summary.net_worth)}
        </p>
        <p className="mt-1 text-sm text-zinc-500">Assets - Liabilities</p>
      </div>
    </div>
  );
}
