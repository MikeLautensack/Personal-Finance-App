import { TransactionSummary } from "@/lib/types";

type TransactionSummaryCardsProps = {
  summary: TransactionSummary;
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function TransactionSummaryCards({
  summary,
}: TransactionSummaryCardsProps) {
  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-500">Income</p>
        <p className="mt-1 text-2xl font-bold text-green-600">
          {formatCurrency(summary.income)}
        </p>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-500">Expenses</p>
        <p className="mt-1 text-2xl font-bold text-red-600">
          {formatCurrency(summary.expenses)}
        </p>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-500">Net</p>
        <p
          className={`mt-1 text-2xl font-bold ${
            summary.net >= 0
              ? "text-zinc-900 dark:text-zinc-50"
              : "text-red-600"
          }`}
        >
          {formatCurrency(summary.net)}
        </p>
      </div>
    </div>
  );
}
