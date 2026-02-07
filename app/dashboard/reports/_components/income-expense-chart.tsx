type IncomeExpenseChartProps = {
  income: number;
  expenses: number;
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function IncomeExpenseChart({
  income,
  expenses,
}: IncomeExpenseChartProps) {
  const max = Math.max(income, expenses, 1);
  const net = income - expenses;

  return (
    <div className="space-y-6">
      {/* Bars */}
      <div className="space-y-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              Income
            </span>
            <span className="font-semibold text-green-600">
              {formatCurrency(income)}
            </span>
          </div>
          <div className="h-8 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full rounded-lg bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
              style={{ width: `${(income / max) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              Expenses
            </span>
            <span className="font-semibold text-red-600">
              {formatCurrency(expenses)}
            </span>
          </div>
          <div className="h-8 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full rounded-lg bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
              style={{ width: `${(expenses / max) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Net summary */}
      <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Net
          </span>
          <span
            className={`text-lg font-bold ${
              net >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {net >= 0 ? "+" : ""}
            {formatCurrency(net)}
          </span>
        </div>
        {income > 0 && (
          <p className="mt-1 text-xs text-zinc-500">
            Savings rate: {((net / income) * 100).toFixed(1)}%
          </p>
        )}
      </div>
    </div>
  );
}
