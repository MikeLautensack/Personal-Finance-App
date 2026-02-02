import Link from "next/link";

export default function Dashboard() {
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
          <p className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            $0.00
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Assets minus liabilities
          </p>
        </div>

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
            $0.00
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            +0% from last month
          </p>
        </div>

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
            $0.00
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            +0% from last month
          </p>
        </div>

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
          <p className="mt-4 text-3xl font-bold text-blue-600 dark:text-blue-400">
            0%
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Of monthly income saved
          </p>
        </div>
      </div>

      {/* Accounts Overview */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
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
        </div>

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
      </div>

      {/* Mobile spacing for bottom nav */}
      <div className="h-20 lg:hidden" />
    </>
  );
}
