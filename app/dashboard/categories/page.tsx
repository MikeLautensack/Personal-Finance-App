"use client";

import { useState } from "react";

const defaultCategories = [
  {
    id: "groceries",
    name: "Groceries",
    icon: "🛒",
    type: "expense",
    color: "#22c55e",
  },
  {
    id: "dining",
    name: "Dining Out",
    icon: "🍽️",
    type: "expense",
    color: "#f97316",
  },
  {
    id: "transportation",
    name: "Transportation",
    icon: "🚗",
    type: "expense",
    color: "#3b82f6",
  },
  {
    id: "utilities",
    name: "Utilities",
    icon: "💡",
    type: "expense",
    color: "#eab308",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: "🎬",
    type: "expense",
    color: "#a855f7",
  },
  {
    id: "shopping",
    name: "Shopping",
    icon: "🛍️",
    type: "expense",
    color: "#ec4899",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: "🏥",
    type: "expense",
    color: "#ef4444",
  },
  {
    id: "housing",
    name: "Housing",
    icon: "🏠",
    type: "expense",
    color: "#6366f1",
  },
  {
    id: "subscriptions",
    name: "Subscriptions",
    icon: "📱",
    type: "expense",
    color: "#14b8a6",
  },
  {
    id: "salary",
    name: "Salary",
    icon: "💼",
    type: "income",
    color: "#22c55e",
  },
  {
    id: "freelance",
    name: "Freelance",
    icon: "💻",
    type: "income",
    color: "#3b82f6",
  },
  {
    id: "investments",
    name: "Investment Returns",
    icon: "📈",
    type: "income",
    color: "#a855f7",
  },
  {
    id: "other_income",
    name: "Other Income",
    icon: "💰",
    type: "income",
    color: "#eab308",
  },
  {
    id: "other_expense",
    name: "Other Expense",
    icon: "📦",
    type: "expense",
    color: "#71717a",
  },
];

export default function CategoriesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");

  const expenseCategories = defaultCategories.filter(
    (c) => c.type === "expense"
  );
  const incomeCategories = defaultCategories.filter((c) => c.type === "income");

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
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Category
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab("expense")}
          className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
            activeTab === "expense"
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          Expense Categories
        </button>
        <button
          onClick={() => setActiveTab("income")}
          className={`rounded-full px-6 py-2 text-sm font-medium transition-colors ${
            activeTab === "income"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          Income Categories
        </button>
      </div>

      {/* Category Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(activeTab === "expense" ? expenseCategories : incomeCategories).map(
          (category) => (
            <div
              key={category.id}
              className="group rounded-xl border border-zinc-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      {category.name}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {category.type === "expense" ? "Expense" : "Income"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Add Category
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Coffee"
                  className="mt-1 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Type
                </label>
                <div className="mt-2 flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="type"
                      value="expense"
                      defaultChecked
                      className="text-emerald-600"
                    />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      Expense
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="type"
                      value="income"
                      className="text-emerald-600"
                    />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      Income
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Icon
                </label>
                <input
                  type="text"
                  placeholder="Enter an emoji"
                  className="mt-1 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Color
                </label>
                <input
                  type="color"
                  defaultValue="#22c55e"
                  className="mt-1 h-10 w-full cursor-pointer rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile spacing */}
      <div className="h-20 lg:hidden" />
    </>
  );
}
