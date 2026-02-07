import Link from "next/link";
import {
  getAccountSummary,
  getAccounts,
  getTransactionSummary,
  getTransactionsPaginated,
  getBudgets,
  getGoals,
  getCategories,
} from "@/lib/data";

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
  });
}

function getMonthString(date: Date): string {
  return date.toISOString().slice(0, 7);
}

function calcPercentChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "+100" : "0";
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(0)}`;
}

export default async function Dashboard() {
  const now = new Date();
  const currentMonth = getMonthString(now);
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonth = getMonthString(prevMonthDate);

  // Fetch all dashboard data in parallel
  const [
    accountSummary,
    accounts,
    currentSummary,
    lastSummary,
    recentTransactions,
    budgets,
    goals,
    categories,
  ] = await Promise.all([
    getAccountSummary(),
    getAccounts(),
    getTransactionSummary(currentMonth),
    getTransactionSummary(lastMonth),
    getTransactionsPaginated(undefined, 0, 5),
    getBudgets(),
    getGoals(),
    getCategories(),
  ]);

  // Build lookup maps
  const accountMap = new Map(accounts.map((a) => [a.id, a]));
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  // Calculate savings rate
  const savingsRate =
    currentSummary.income > 0
      ? ((currentSummary.net / currentSummary.income) * 100).toFixed(0)
      : "0";

  // Calculate budget progress: sum expenses per category for current month
  const currentMonthExpenses = await getTransactionSummaryByCategory(
    currentMonth
  );

  const incomeChange = calcPercentChange(
    currentSummary.income,
    lastSummary.income
  );
  const expenseChange = calcPercentChange(
    currentSummary.expenses,
    lastSummary.expenses
  );

  // Active goals only
  const activeGoals = goals.filter((g) => g.status === "active");

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Your financial overview at a glance
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Net Worth */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Net Worth
            </h3>
            <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900">
              <svg
                className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p
            className={`mt-4 text-3xl font-bold ${
              accountSummary.net_worth >= 0
                ? "text-zinc-900 dark:text-zinc-50"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {formatCurrency(accountSummary.net_worth)}
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Assets minus liabilities
          </p>
        </div>

        {/* Income */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Income (This Month)
            </h3>
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
              <svg
                className="h-5 w-5 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 11l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(currentSummary.income)}
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {incomeChange}% from last month
          </p>
        </div>

        {/* Expenses */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Expenses (This Month)
            </h3>
            <div className="rounded-full bg-red-100 p-2 dark:bg-red-900">
              <svg
                className="h-5 w-5 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 13l-5 5m0 0l-5-5m5 5V6"
                />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-3xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(currentSummary.expenses)}
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {expenseChange}% from last month
          </p>
        </div>

        {/* Savings Rate */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Savings Rate
            </h3>
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
              <svg
                className="h-5 w-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
          <p
            className={`mt-4 text-3xl font-bold ${
              Number(savingsRate) >= 0
                ? "text-blue-600 dark:text-blue-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {savingsRate}%
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Of monthly income saved
          </p>
        </div>
      </div>

      {/* Accounts & Budgets */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Accounts Overview */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Accounts
            </h3>
            <Link
              href="/dashboard/accounts"
              className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              View all
            </Link>
          </div>
          {accounts.length === 0 ? (
            <div className="mt-6 flex flex-col items-center justify-center py-8 text-center">
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
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                No accounts yet. Add your bank accounts, credit cards, and
                investments.
              </p>
              <Link
                href="/dashboard/accounts"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Add Account
              </Link>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
              {accounts.slice(0, 5).map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full text-sm"
                      style={{
                        backgroundColor: account.color
                          ? `${account.color}20`
                          : "#71717a20",
                      }}
                    >
                      {account.icon || typeIcons[account.type] || "📦"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {account.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {typeLabels[account.type] || account.type}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      ["credit_card", "loan"].includes(account.type)
                        ? "text-red-600"
                        : account.balance >= 0
                        ? "text-zinc-900 dark:text-zinc-50"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(Math.abs(account.balance))}
                  </p>
                </div>
              ))}
              {accounts.length > 5 && (
                <div className="pt-3">
                  <Link
                    href="/dashboard/accounts"
                    className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                  >
                    +{accounts.length - 5} more accounts
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Budget Progress */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Budget Progress
            </h3>
            <Link
              href="/dashboard/budgets"
              className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Manage
            </Link>
          </div>
          {budgets.length === 0 ? (
            <div className="mt-6 flex flex-col items-center justify-center py-8 text-center">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                No budgets set. Create budgets to track your spending.
              </p>
              <Link
                href="/dashboard/budgets"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Create Budget
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {budgets.slice(0, 5).map((budget) => {
                const category = categoryMap.get(budget.category_id);
                const spent = currentMonthExpenses.get(budget.category_id) || 0;
                const percentage = Math.min(
                  (spent / budget.amount) * 100,
                  100
                );
                const isOver = spent > budget.amount;

                return (
                  <div key={budget.id}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        {category?.icon} {category?.name || "Unknown Category"}
                      </span>
                      <span
                        className={`font-medium ${
                          isOver
                            ? "text-red-600"
                            : "text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        {formatCurrency(spent)} / {formatCurrency(budget.amount)}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isOver
                            ? "bg-red-500"
                            : percentage > budget.alert_threshold
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {budgets.length > 5 && (
                <Link
                  href="/dashboard/budgets"
                  className="block text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  +{budgets.length - 5} more budgets
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Recent Transactions
          </h3>
          <Link
            href="/dashboard/transactions"
            className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            View all
          </Link>
        </div>
        {recentTransactions.data.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center py-12 text-center">
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
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              No transactions yet. Start by adding your first transaction.
            </p>
            <Link
              href="/dashboard/transactions"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Add Transaction
            </Link>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
            {recentTransactions.data.map((txn) => {
              const account = accountMap.get(txn.account_id);
              const category = txn.category_id
                ? categoryMap.get(txn.category_id)
                : undefined;

              return (
                <div
                  key={txn.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full text-sm"
                      style={{
                        backgroundColor: category?.color
                          ? `${category.color}20`
                          : "#71717a20",
                      }}
                    >
                      {category?.icon ||
                        (txn.type === "transfer" ? "↔️" : "📦")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {txn.description}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {formatDate(txn.date)}
                        {account ? ` · ${account.name}` : ""}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      txn.type === "income"
                        ? "text-green-600"
                        : txn.type === "expense"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {txn.type === "income"
                      ? "+"
                      : txn.type === "expense"
                      ? "-"
                      : ""}
                    {formatCurrency(txn.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Goals Progress */}
      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Savings Goals
          </h3>
          <Link
            href="/dashboard/goals"
            className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Manage
          </Link>
        </div>
        {activeGoals.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center py-8 text-center">
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
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              No goals yet. Set savings goals to track your progress.
            </p>
            <Link
              href="/dashboard/goals"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Create Goal
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {activeGoals.slice(0, 5).map((goal) => {
              const percentage = Math.min(
                (goal.current_amount / goal.target_amount) * 100,
                100
              );
              const remaining = goal.target_amount - goal.current_amount;

              return (
                <div key={goal.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                      {goal.icon ? `${goal.icon} ` : ""}
                      {goal.name}
                    </span>
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {formatCurrency(goal.current_amount)} /{" "}
                      {formatCurrency(goal.target_amount)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: goal.color || undefined,
                      }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-zinc-500">
                    <span>{percentage.toFixed(0)}% complete</span>
                    <span>{formatCurrency(remaining)} remaining</span>
                  </div>
                </div>
              );
            })}
            {activeGoals.length > 5 && (
              <Link
                href="/dashboard/goals"
                className="block text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                +{activeGoals.length - 5} more goals
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Mobile spacing for bottom nav */}
      <div className="h-20 lg:hidden" />
    </>
  );
}

// Helper: get expenses grouped by category for the current month
async function getTransactionSummaryByCategory(
  month: string
): Promise<Map<string, number>> {
  const { getSupabaseClient } = await import("@/lib/data/utils");
  const { client: supabase, userId } = await getSupabaseClient();

  const startDate = `${month}-01`;
  const [year, monthNum] = month.split("-").map(Number);
  const endDate = new Date(year, monthNum, 0).toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("transactions")
    .select("category_id, amount")
    .eq("user_id", userId)
    .eq("type", "expense")
    .gte("date", startDate)
    .lte("date", endDate)
    .not("category_id", "is", null);

  if (error) {
    console.error("Error fetching expenses by category:", error);
    return new Map();
  }

  const result = new Map<string, number>();
  for (const row of data) {
    const current = result.get(row.category_id) || 0;
    result.set(row.category_id, current + Number(row.amount));
  }

  return result;
}

// Lookup maps for account display
const typeLabels: Record<string, string> = {
  checking: "Checking",
  savings: "Savings",
  credit_card: "Credit Card",
  investment: "Investment",
  loan: "Loan",
  cash: "Cash",
  other: "Other",
};

const typeIcons: Record<string, string> = {
  checking: "🏦",
  savings: "💰",
  credit_card: "💳",
  investment: "📈",
  loan: "📋",
  cash: "💵",
  other: "📦",
};
