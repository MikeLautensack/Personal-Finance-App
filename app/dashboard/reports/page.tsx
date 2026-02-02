export default function ReportsPage() {
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
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <select className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
          <option value="this_month">This Month</option>
          <option value="last_month">Last Month</option>
          <option value="last_3_months">Last 3 Months</option>
          <option value="last_6_months">Last 6 Months</option>
          <option value="this_year">This Year</option>
          <option value="last_year">Last Year</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      {/* Report Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Income vs Expenses */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Income vs Expenses
          </h3>
          <div className="mt-6 flex items-center justify-center py-16">
            <div className="text-center">
              <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-800 mx-auto w-fit">
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
              <p className="mt-4 text-sm text-zinc-500">
                Add transactions to see this report
              </p>
            </div>
          </div>
        </div>

        {/* Spending by Category */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Spending by Category
          </h3>
          <div className="mt-6 flex items-center justify-center py-16">
            <div className="text-center">
              <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-800 mx-auto w-fit">
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
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  />
                </svg>
              </div>
              <p className="mt-4 text-sm text-zinc-500">
                Add transactions to see this report
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Monthly Trends
          </h3>
          <div className="mt-6 flex items-center justify-center py-16">
            <div className="text-center">
              <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-800 mx-auto w-fit">
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
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <p className="mt-4 text-sm text-zinc-500">
                Add transactions to see this report
              </p>
            </div>
          </div>
        </div>

        {/* Net Worth Over Time */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Net Worth Over Time
          </h3>
          <div className="mt-6 flex items-center justify-center py-16">
            <div className="text-center">
              <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-800 mx-auto w-fit">
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
              <p className="mt-4 text-sm text-zinc-500">
                Add accounts to see this report
              </p>
            </div>
          </div>
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
              $0.00
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Largest Expense</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              $0.00
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Most Spent Category</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              —
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Transactions This Month</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              0
            </p>
          </div>
        </div>
      </div>

      {/* Mobile spacing */}
      <div className="h-20 lg:hidden" />
    </>
  );
}
