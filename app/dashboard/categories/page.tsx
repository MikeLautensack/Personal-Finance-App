import { getCategories } from "@/lib/data";
import { CategorySearchParams } from "@/lib/types";
import { CategoryTabs } from "./_components/category-tabs";
import { CategoryGrid } from "./_components/category-grid";
import { AddCategoryButton } from "./_components/add-category-button";

type PageProps = {
  searchParams: Promise<{
    type?: string;
    search?: string;
  }>;
};

export default async function CategoriesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Build search params for data fetching
  const queryParams: CategorySearchParams = {
    type: (params.type as "expense" | "income") || undefined,
    search: params.search,
  };

  // Fetch all categories
  const categories = await getCategories();

  // Filter by type for display
  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");

  const activeTab = params.type || "expense";
  const displayedCategories =
    activeTab === "income" ? incomeCategories : expenseCategories;

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Categories
          </h2>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Organize your transactions with custom categories
          </p>
        </div>
        <AddCategoryButton />
      </div>

      {/* Tabs */}
      <CategoryTabs
        activeTab={activeTab}
        expenseCount={expenseCategories.length}
        incomeCount={incomeCategories.length}
      />

      {/* Category Grid */}
      <CategoryGrid categories={displayedCategories} />

      {/* Mobile spacing */}
      <div className="h-20 lg:hidden" />
    </>
  );
}
