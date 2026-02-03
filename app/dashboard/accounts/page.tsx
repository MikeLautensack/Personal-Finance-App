import { getAccounts, getAccountSummary } from "@/lib/data";
import { AccountSearchParams } from "@/lib/types";
import { AccountSummaryCards } from "./_components/account-summary";
import { AccountList } from "./_components/account-list";
import { AddAccountButton } from "./_components/add-account-button";
import { AccountFilters } from "./_components/account-filters";

type PageProps = {
  searchParams: Promise<{
    type?: string;
    is_active?: string;
    sort?: string;
    order?: string;
  }>;
};

export default async function AccountsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Build search params for data fetching
  const queryParams: AccountSearchParams = {
    type: (params.type as AccountSearchParams["type"]) || "all",
    is_active: params.is_active as "true" | "false" | undefined,
    sort: (params.sort as "name" | "balance" | "type") || "name",
    order: (params.order as "asc" | "desc") || "asc",
  };

  // Fetch data in parallel
  const [accounts, summary] = await Promise.all([
    getAccounts(queryParams),
    getAccountSummary(),
  ]);

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Accounts
          </h2>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Manage your bank accounts, credit cards, and investments
          </p>
        </div>
        <AddAccountButton />
      </div>

      {/* Account Summary Cards */}
      <AccountSummaryCards summary={summary} />

      {/* Filters */}
      <AccountFilters currentType={queryParams.type || "all"} />

      {/* Account List */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Your Accounts
        </h3>
        <AccountList accounts={accounts} />
      </div>

      {/* Mobile spacing */}
      <div className="h-20 lg:hidden" />
    </>
  );
}
