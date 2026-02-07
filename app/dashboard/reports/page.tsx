import { getAccounts, getAccountSummary, getCategories } from "@/lib/data";
import { getSupabaseClient } from "@/lib/data/utils";
import { Transaction, Category } from "@/lib/types";
import { PeriodFilter } from "./_components/period-filter";
import { IncomeExpenseChart } from "./_components/income-expense-chart";
import { CategoryBreakdown } from "./_components/category-breakdown";
import { MonthlyTrendsChart } from "./_components/monthly-trends-chart";
import { NetWorthChart } from "./_components/net-worth-chart";

// ============================================
// Period date range helpers
// ============================================

type DateRange = { start: string; end: string };

function getDateRange(period: string): DateRange {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth(); // 0-indexed

  switch (period) {
    case "last_month": {
      const s = new Date(y, m - 1, 1);
      const e = new Date(y, m, 0);
      return { start: fmt(s), end: fmt(e) };
    }
    case "last_3_months": {
      const s = new Date(y, m - 2, 1);
      const e = new Date(y, m + 1, 0);
      return { start: fmt(s), end: fmt(e) };
    }
    case "last_6_months": {
      const s = new Date(y, m - 5, 1);
      const e = new Date(y, m + 1, 0);
      return { start: fmt(s), end: fmt(e) };
    }
    case "this_year": {
      return { start: `${y}-01-01`, end: fmt(new Date(y, 11, 31)) };
    }
    case "last_year": {
      return {
        start: `${y - 1}-01-01`,
        end: `${y - 1}-12-31`,
      };
    }
    case "this_month":
    default: {
      const s = new Date(y, m, 1);
      const e = new Date(y, m + 1, 0);
      return { start: fmt(s), end: fmt(e) };
    }
  }
}

function fmt(d: Date): string {
  return d.toISOString().split("T")[0];
}

function getMonthLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short" });
}

function getMonthKey(dateStr: string): string {
  return dateStr.slice(0, 7); // YYYY-MM
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ============================================
// Data fetching
// ============================================

async function getTransactionsInRange(
  start: string,
  end: string
): Promise<Transaction[]> {
  const { client: supabase, userId } = await getSupabaseClient();

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching transactions for reports:", error);
    return [];
  }

  return data as Transaction[];
}

// ============================================
// Page
// ============================================

type PageProps = {
  searchParams: Promise<{ period?: string }>;
};

export default async function ReportsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const period = params.period || "this_month";
  const { start, end } = getDateRange(period);

  // Fetch all data in parallel
  const [transactions, accountSummary, accounts, categories] =
    await Promise.all([
      getTransactionsInRange(start, end),
      getAccountSummary(),
      getAccounts(),
      getCategories(),
    ]);

  const categoryMap = new Map<string, Category>(
    categories.map((c) => [c.id, c])
  );

  // ---- Income vs Expenses ----
  let totalIncome = 0;
  let totalExpenses = 0;
  for (const txn of transactions) {
    if (txn.type === "income") totalIncome += Number(txn.amount);
    if (txn.type === "expense") totalExpenses += Number(txn.amount);
  }

  // ---- Spending by Category ----
  const categoryTotals = new Map<string, number>();
  for (const txn of transactions) {
    if (txn.type === "expense" && txn.category_id) {
      categoryTotals.set(
        txn.category_id,
        (categoryTotals.get(txn.category_id) || 0) + Number(txn.amount)
      );
    }
  }

  const categoryData = Array.from(categoryTotals.entries())
    .map(([catId, amount]) => {
      const cat = categoryMap.get(catId);
      return {
        id: catId,
        name: cat?.name || "Uncategorized",
        icon: cat?.icon,
        color: cat?.color,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  // ---- Monthly Trends ----
  // Group transactions by month
  const monthlyMap = new Map<
    string,
    { income: number; expenses: number }
  >();

  // Pre-fill all months in range so we get months with 0
  const startDate = new Date(start + "T00:00:00");
  const endDate = new Date(end + "T00:00:00");
  const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  while (cursor <= endDate) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap.set(key, { income: 0, expenses: 0 });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  for (const txn of transactions) {
    const key = getMonthKey(txn.date);
    const entry = monthlyMap.get(key);
    if (entry) {
      if (txn.type === "income") entry.income += Number(txn.amount);
      if (txn.type === "expense") entry.expenses += Number(txn.amount);
    }
  }

  const monthlyTrends = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      label: getMonthLabel(`${month}-01`),
      income: data.income,
      expenses: data.expenses,
    }));

  // ---- Net Worth Over Time ----
  // Approximate: start from current net worth and walk backwards
  // by subtracting each month's net flow
  const netWorth = accountSummary.net_worth;
  const sortedMonths = Array.from(monthlyMap.entries()).sort(([a], [b]) =>
    b.localeCompare(a)
  ); // newest first

  const netWorthPoints: { label: string; value: number }[] = [];
  let runningNetWorth = netWorth;

  // Most recent month = current net worth
  for (const [month, data] of sortedMonths) {
    netWorthPoints.push({
      label: getMonthLabel(`${month}-01`),
      value: runningNetWorth,
    });
    // Walk backward: subtract this month's net flow
    runningNetWorth -= data.income - data.expenses;
  }

  netWorthPoints.reverse(); // chronological order

  // ---- Quick Stats ----
  const expenseTransactions = transactions.filter((t) => t.type === "expense");
  const dayCount = Math.max(
    1,
    Math.ceil(
      (new Date(end).getTime() - new Date(start).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1
  );

  const avgDailySpending =
    expenseTransactions.length > 0 ? totalExpenses / dayCount : 0;

  const largestExpense =
    expenseTransactions.length > 0
      ? expenseTransactions.reduce((max, t) =>
          Number(t.amount) > Number(max.amount) ? t : max
        )
      : null;

  const topCategory = categoryData.length > 0 ? categoryData[0] : null;

  const transactionCount = transactions.length;

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Reports
        </h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Analyze your financial data with detailed reports
        </p>
      </div>

      {/* Time Period Filter */}
      <PeriodFilter currentPeriod={period} />

      {/* Report Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Income vs Expenses */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Income vs Expenses
          </h3>
          {transactions.length === 0 ? (
            <EmptyState icon="bar" message="Add transactions to see this report" />
          ) : (
            <IncomeExpenseChart income={totalIncome} expenses={totalExpenses} />
          )}
        </div>

        {/* Spending by Category */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Spending by Category
          </h3>
          {expenseTransactions.length === 0 ? (
            <EmptyState icon="pie" message="Add expenses to see this report" />
          ) : (
            <CategoryBreakdown
              categories={categoryData}
              total={totalExpenses}
            />
          )}
        </div>

        {/* Monthly Trends */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Monthly Trends
          </h3>
          {monthlyTrends.length === 0 ? (
            <EmptyState icon="trend" message="Add transactions to see trends" />
          ) : (
            <MonthlyTrendsChart data={monthlyTrends} />
          )}
        </div>

        {/* Net Worth Over Time */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Net Worth Over Time
          </h3>
          {accounts.length === 0 ? (
            <EmptyState
              icon="growth"
              message="Add accounts to see net worth trends"
            />
          ) : (
            <NetWorthChart
              data={netWorthPoints}
              currentNetWorth={netWorth}
            />
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Quick Stats
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Average Daily Spending</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {formatCurrency(avgDailySpending)}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Largest Expense</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {largestExpense
                ? formatCurrency(Number(largestExpense.amount))
                : "—"}
            </p>
            {largestExpense && (
              <p className="mt-0.5 truncate text-xs text-zinc-500">
                {largestExpense.description}
              </p>
            )}
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Top Category</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {topCategory
                ? `${topCategory.icon || ""} ${topCategory.name}`
                : "—"}
            </p>
            {topCategory && (
              <p className="mt-0.5 text-xs text-zinc-500">
                {formatCurrency(topCategory.amount)} (
                {topCategory.percentage.toFixed(0)}% of expenses)
              </p>
            )}
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Total Transactions</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {transactionCount}
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">
              {expenseTransactions.length} expenses,{" "}
              {transactions.filter((t) => t.type === "income").length} income
            </p>
          </div>
        </div>
      </div>

      {/* Mobile spacing */}
      <div className="h-20 lg:hidden" />
    </>
  );
}

// ============================================
// Empty state helper
// ============================================

function EmptyState({
  icon,
  message,
}: {
  icon: "bar" | "pie" | "trend" | "growth";
  message: string;
}) {
  const iconPaths: Record<string, React.ReactNode> = {
    bar: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    ),
    pie: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
        />
      </>
    ),
    trend: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
      />
    ),
    growth: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    ),
  };

  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="mx-auto w-fit rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
          <svg
            className="h-8 w-8 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {iconPaths[icon]}
          </svg>
        </div>
        <p className="mt-4 text-sm text-zinc-500">{message}</p>
      </div>
    </div>
  );
}
