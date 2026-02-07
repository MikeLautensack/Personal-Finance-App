// ============================================
// Database Model Types
// ============================================

export type AccountType =
  | "checking"
  | "savings"
  | "credit_card"
  | "investment"
  | "loan"
  | "cash"
  | "other";

export type TransactionType = "expense" | "income" | "transfer";

export type CategoryType = "expense" | "income";

export type BudgetPeriod = "weekly" | "monthly" | "yearly";

export type GoalStatus = "active" | "completed" | "cancelled";

export type RecurringFrequency =
  | "daily"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "yearly";

// ============================================
// Core Models
// ============================================

export type Account = {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  institution?: string;
  account_number?: string;
  color?: string;
  icon?: string;
  is_active: boolean;
  include_in_net_worth: boolean;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  user_id?: string;
  name: string;
  type: CategoryType;
  icon?: string;
  color?: string;
  parent_id?: string;
  is_system: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  account_id: string;
  category_id?: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  notes?: string;
  date: string;
  transfer_account_id?: string;
  is_recurring: boolean;
  recurring_rule_id?: string;
  tags?: string[];
  location?: string;
  receipt_url?: string;
  is_pending: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  account?: Account;
  category?: Category;
  transfer_account?: Account;
};

export type Budget = {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period: BudgetPeriod;
  start_date: string;
  end_date?: string;
  is_recurring: boolean;
  alert_threshold: number;
  alert_enabled: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  category?: Category;
};

export type Goal = {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  currency: string;
  target_date?: string;
  icon?: string;
  color?: string;
  account_id?: string;
  status: GoalStatus;
  completed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  account?: Account;
};

export type GoalContribution = {
  id: string;
  goal_id: string;
  amount: number;
  date: string;
  notes?: string;
  created_at: string;
};

export type RecurringRule = {
  id: string;
  user_id: string;
  account_id: string;
  category_id?: string;
  type: TransactionType;
  amount: number;
  description: string;
  frequency: RecurringFrequency;
  start_date: string;
  end_date?: string;
  next_occurrence: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type UserPreferences = {
  id: string;
  user_id: string;
  currency: string;
  date_format: string;
  first_day_of_week: number;
  budget_alerts: boolean;
  weekly_summary: boolean;
  goal_progress_alerts: boolean;
  show_cents: boolean;
  dark_mode: "light" | "dark" | "system";
  created_at: string;
  updated_at: string;
};

// ============================================
// API Request/Response Types
// ============================================

// Accounts
export type CreateAccountInput = {
  name: string;
  type: AccountType;
  balance?: number;
  currency?: string;
  institution?: string;
  account_number?: string;
  color?: string;
  icon?: string;
};

export type UpdateAccountInput = {
  name?: string;
  type?: AccountType;
  balance?: number;
  institution?: string;
  account_number?: string;
  color?: string;
  icon?: string;
  is_active?: boolean;
  include_in_net_worth?: boolean;
};

// Categories
export type CreateCategoryInput = {
  name: string;
  type: CategoryType;
  icon?: string;
  color?: string;
  parent_id?: string;
};

export type UpdateCategoryInput = {
  name?: string;
  icon?: string;
  color?: string;
  parent_id?: string;
  sort_order?: number;
};

// Transactions
export type CreateTransactionInput = {
  account_id: string;
  category_id?: string;
  type: TransactionType;
  amount: number;
  description: string;
  notes?: string;
  date: string;
  transfer_account_id?: string;
  tags?: string[];
  location?: string;
  is_pending?: boolean;
};

export type UpdateTransactionInput = {
  account_id?: string;
  category_id?: string;
  type?: TransactionType;
  amount?: number;
  description?: string;
  notes?: string;
  date?: string;
  transfer_account_id?: string;
  tags?: string[];
  location?: string;
  is_pending?: boolean;
};

// Budgets
export type CreateBudgetInput = {
  category_id: string;
  amount: number;
  period: BudgetPeriod;
  start_date: string;
  end_date?: string;
  is_recurring?: boolean;
  alert_threshold?: number;
  alert_enabled?: boolean;
};

export type UpdateBudgetInput = {
  amount?: number;
  period?: BudgetPeriod;
  end_date?: string;
  is_recurring?: boolean;
  alert_threshold?: number;
  alert_enabled?: boolean;
};

// Goals
export type CreateGoalInput = {
  name: string;
  target_amount: number;
  current_amount?: number;
  currency?: string;
  target_date?: string;
  icon?: string;
  color?: string;
  account_id?: string;
  notes?: string;
};

export type UpdateGoalInput = {
  name?: string;
  target_amount?: number;
  current_amount?: number;
  target_date?: string;
  icon?: string;
  color?: string;
  account_id?: string;
  status?: GoalStatus;
  notes?: string;
};

// ============================================
// Search/Filter Params Types
// ============================================

export type TransactionSearchParams = {
  type?: TransactionType | "all";
  month?: string; // YYYY-MM format
  search?: string;
  account_id?: string;
  category_id?: string;
  sort?: "date" | "amount";
  order?: "asc" | "desc";
};

export type AccountSearchParams = {
  type?: AccountType | "all";
  is_active?: "true" | "false";
  sort?: "name" | "balance" | "type";
  order?: "asc" | "desc";
};

export type CategorySearchParams = {
  type?: CategoryType;
  search?: string;
};

// ============================================
// Paginated Response Types
// ============================================

export type PaginatedResponse<T> = {
  data: T[];
  nextCursor: number | null;
  total: number;
};

// ============================================
// Summary/Aggregate Types
// ============================================

export type TransactionSummary = {
  income: number;
  expenses: number;
  net: number;
};

export type AccountSummary = {
  total_assets: number;
  total_liabilities: number;
  net_worth: number;
};

export type BudgetProgress = {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
};
