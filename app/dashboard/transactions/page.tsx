import {
  getTransactions,
  getTransactionSummary,
  getAccounts,
  getCategories,
} from "@/lib/data";
import { TransactionSearchParams } from "@/lib/types";
import { TransactionFilters } from "./_components/transaction-filters";
import { TransactionList } from "./_components/transaction-list";
import { TransactionSummaryCards } from "./_components/transaction-summary";
import { AddTransactionButton } from "./_components/add-transaction-button";

type PageProps = {
  searchParams: Promise<{
    type?: string;
    month?: string;
    search?: string;
    account_id?: string;
    category_id?: string;
    sort?: string;
    order?: string;
  }>;
};

export default async function TransactionsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Build search params for data fetching
  const queryParams: TransactionSearchParams = {
    type: (params.type as TransactionSearchParams["type"]) || "all",
    month: params.month || new Date().toISOString().slice(0, 7),
    search: params.search,
    account_id: params.account_id,
    category_id: params.category_id,
    sort: (params.sort as "date" | "amount") || "date",
    order: (params.order as "asc" | "desc") || "desc",
  };

  // Fetch data in parallel
  const [transactions, summary, accounts, categories] = await Promise.all([
    getTransactions(queryParams),
    getTransactionSummary(queryParams.month),
    getAccounts(),
    getCategories(),
  ]);

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Transactions
          </h2>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Track your income, expenses, and transfers
          </p>
        </div>
        <AddTransactionButton accounts={accounts} categories={categories} />
      </div>

      {/* Filters */}
      <TransactionFilters
        currentType={queryParams.type || "all"}
        currentMonth={queryParams.month || ""}
        accounts={accounts}
        categories={categories}
      />

      {/* Summary */}
      <TransactionSummaryCards summary={summary} />

      {/* Transaction List */}
      <TransactionList
        transactions={transactions}
        accounts={accounts}
        categories={categories}
      />

      {/* Mobile spacing */}
      <div className="h-20 lg:hidden" />
    </>
  );
}
