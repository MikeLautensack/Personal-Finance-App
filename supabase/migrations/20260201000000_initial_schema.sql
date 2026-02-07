-- Personal Finance App Database Schema
-- NOTE: Foreign keys removed for easier prototyping. Add them back for production.

-- ============================================
-- ACCOUNTS TABLE
-- Store bank accounts, credit cards, investments, etc.
-- ============================================
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- No FK for prototyping
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('checking', 'savings', 'credit_card', 'investment', 'loan', 'cash', 'other')),
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    institution VARCHAR(255),
    account_number VARCHAR(50), -- Last 4 digits only for security
    color VARCHAR(7), -- Hex color for UI
    icon VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT true,
    include_in_net_worth BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_type ON accounts(type);

-- ============================================
-- CATEGORIES TABLE
-- Expense and income categories for organizing transactions
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- NULL for system defaults, no FK for prototyping
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('expense', 'income')),
    icon VARCHAR(50),
    color VARCHAR(7), -- Hex color
    parent_id UUID, -- For subcategories, no FK for prototyping
    is_system BOOLEAN NOT NULL DEFAULT false, -- System defaults can't be deleted
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);

-- ============================================
-- TRANSACTIONS TABLE
-- All income, expenses, and transfers
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- No FK for prototyping
    account_id UUID NOT NULL, -- No FK for prototyping
    category_id UUID, -- No FK for prototyping
    type VARCHAR(20) NOT NULL CHECK (type IN ('expense', 'income', 'transfer')),
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    description VARCHAR(500) NOT NULL,
    notes TEXT,
    date DATE NOT NULL,
    -- For transfers
    transfer_account_id UUID, -- No FK for prototyping
    -- Recurring transaction support
    is_recurring BOOLEAN NOT NULL DEFAULT false,
    recurring_rule_id UUID,
    -- Tags for additional organization
    tags TEXT[], -- Array of tags
    -- Location data (optional)
    location VARCHAR(255),
    -- Attachments
    receipt_url VARCHAR(500),
    -- Status
    is_pending BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

-- ============================================
-- BUDGETS TABLE
-- Spending limits by category
-- ============================================
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- No FK for prototyping
    category_id UUID NOT NULL, -- No FK for prototyping
    amount DECIMAL(15, 2) NOT NULL,
    period VARCHAR(20) NOT NULL CHECK (period IN ('weekly', 'monthly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE, -- NULL for recurring budgets
    is_recurring BOOLEAN NOT NULL DEFAULT true,
    alert_threshold INTEGER DEFAULT 80, -- Percentage to trigger alert
    alert_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, category_id, period, start_date)
);

CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_category_id ON budgets(category_id);

-- ============================================
-- GOALS TABLE
-- Savings goals
-- ============================================
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- No FK for prototyping
    name VARCHAR(255) NOT NULL,
    target_amount DECIMAL(15, 2) NOT NULL,
    current_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    target_date DATE,
    icon VARCHAR(50),
    color VARCHAR(7),
    -- Link to a specific account (optional)
    account_id UUID, -- No FK for prototyping
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);

-- ============================================
-- GOAL CONTRIBUTIONS TABLE
-- Track contributions to savings goals
-- ============================================
CREATE TABLE IF NOT EXISTS goal_contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL, -- No FK for prototyping
    amount DECIMAL(15, 2) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_goal_contributions_goal_id ON goal_contributions(goal_id);

-- ============================================
-- RECURRING RULES TABLE
-- Templates for recurring transactions
-- ============================================
CREATE TABLE IF NOT EXISTS recurring_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- No FK for prototyping
    account_id UUID NOT NULL, -- No FK for prototyping
    category_id UUID, -- No FK for prototyping
    type VARCHAR(20) NOT NULL CHECK (type IN ('expense', 'income', 'transfer')),
    amount DECIMAL(15, 2) NOT NULL,
    description VARCHAR(500) NOT NULL,
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE,
    next_occurrence DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recurring_rules_user_id ON recurring_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_rules_next_occurrence ON recurring_rules(next_occurrence);

-- ============================================
-- USER PREFERENCES TABLE
-- User settings and preferences
-- ============================================
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE, -- No FK for prototyping
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    date_format VARCHAR(20) NOT NULL DEFAULT 'MM/DD/YYYY',
    first_day_of_week INTEGER NOT NULL DEFAULT 0, -- 0 = Sunday, 1 = Monday
    -- Notification preferences
    budget_alerts BOOLEAN NOT NULL DEFAULT true,
    weekly_summary BOOLEAN NOT NULL DEFAULT false,
    goal_progress_alerts BOOLEAN NOT NULL DEFAULT true,
    -- Display preferences
    show_cents BOOLEAN NOT NULL DEFAULT true,
    dark_mode VARCHAR(20) DEFAULT 'system', -- 'light', 'dark', 'system'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensure users can only access their own data
-- ============================================

-- Enable RLS on all tables
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Accounts policies
CREATE POLICY "Users can view their own accounts"
    ON accounts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own accounts"
    ON accounts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounts"
    ON accounts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own accounts"
    ON accounts FOR DELETE
    USING (auth.uid() = user_id);

-- Categories policies (include system defaults)
CREATE POLICY "Users can view their own and system categories"
    ON categories FOR SELECT
    USING (auth.uid() = user_id OR is_system = true);

CREATE POLICY "Users can create their own categories"
    ON categories FOR INSERT
    WITH CHECK (auth.uid() = user_id AND is_system = false);

CREATE POLICY "Users can update their own categories"
    ON categories FOR UPDATE
    USING (auth.uid() = user_id AND is_system = false);

CREATE POLICY "Users can delete their own categories"
    ON categories FOR DELETE
    USING (auth.uid() = user_id AND is_system = false);

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
    ON transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
    ON transactions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
    ON transactions FOR DELETE
    USING (auth.uid() = user_id);

-- Budgets policies
CREATE POLICY "Users can view their own budgets"
    ON budgets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own budgets"
    ON budgets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets"
    ON budgets FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets"
    ON budgets FOR DELETE
    USING (auth.uid() = user_id);

-- Goals policies
CREATE POLICY "Users can view their own goals"
    ON goals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own goals"
    ON goals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
    ON goals FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
    ON goals FOR DELETE
    USING (auth.uid() = user_id);

-- Goal contributions policies
CREATE POLICY "Users can view contributions to their goals"
    ON goal_contributions FOR SELECT
    USING (EXISTS (SELECT 1 FROM goals WHERE goals.id = goal_contributions.goal_id AND goals.user_id = auth.uid()));

CREATE POLICY "Users can create contributions to their goals"
    ON goal_contributions FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM goals WHERE goals.id = goal_contributions.goal_id AND goals.user_id = auth.uid()));

CREATE POLICY "Users can delete contributions to their goals"
    ON goal_contributions FOR DELETE
    USING (EXISTS (SELECT 1 FROM goals WHERE goals.id = goal_contributions.goal_id AND goals.user_id = auth.uid()));

-- Recurring rules policies
CREATE POLICY "Users can view their own recurring rules"
    ON recurring_rules FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recurring rules"
    ON recurring_rules FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recurring rules"
    ON recurring_rules FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recurring rules"
    ON recurring_rules FOR DELETE
    USING (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can view their own preferences"
    ON user_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences"
    ON user_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
    ON user_preferences FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- Auto-update timestamps and account balances
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_accounts_updated_at
    BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at
    BEFORE UPDATE ON budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
    BEFORE UPDATE ON goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recurring_rules_updated_at
    BEFORE UPDATE ON recurring_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update account balance when transaction is added/modified
CREATE OR REPLACE FUNCTION update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Update account balance based on transaction type
        IF NEW.type = 'expense' THEN
            UPDATE accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
        ELSIF NEW.type = 'income' THEN
            UPDATE accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
        ELSIF NEW.type = 'transfer' THEN
            UPDATE accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
            IF NEW.transfer_account_id IS NOT NULL THEN
                UPDATE accounts SET balance = balance + NEW.amount WHERE id = NEW.transfer_account_id;
            END IF;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        -- Reverse the balance change
        IF OLD.type = 'expense' THEN
            UPDATE accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
        ELSIF OLD.type = 'income' THEN
            UPDATE accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id;
        ELSIF OLD.type = 'transfer' THEN
            UPDATE accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
            IF OLD.transfer_account_id IS NOT NULL THEN
                UPDATE accounts SET balance = balance - OLD.amount WHERE id = OLD.transfer_account_id;
            END IF;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle updates by reversing old and applying new
        -- First reverse old transaction
        IF OLD.type = 'expense' THEN
            UPDATE accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
        ELSIF OLD.type = 'income' THEN
            UPDATE accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id;
        ELSIF OLD.type = 'transfer' THEN
            UPDATE accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
            IF OLD.transfer_account_id IS NOT NULL THEN
                UPDATE accounts SET balance = balance - OLD.amount WHERE id = OLD.transfer_account_id;
            END IF;
        END IF;
        -- Then apply new transaction
        IF NEW.type = 'expense' THEN
            UPDATE accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
        ELSIF NEW.type = 'income' THEN
            UPDATE accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
        ELSIF NEW.type = 'transfer' THEN
            UPDATE accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
            IF NEW.transfer_account_id IS NOT NULL THEN
                UPDATE accounts SET balance = balance + NEW.amount WHERE id = NEW.transfer_account_id;
            END IF;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_balance_on_transaction
    AFTER INSERT OR UPDATE OR DELETE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_account_balance();

-- Function to update goal current amount when contribution is added/deleted
CREATE OR REPLACE FUNCTION update_goal_amount()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE goals SET current_amount = current_amount + NEW.amount WHERE id = NEW.goal_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE goals SET current_amount = current_amount - OLD.amount WHERE id = OLD.goal_id;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_goal_on_contribution
    AFTER INSERT OR DELETE ON goal_contributions
    FOR EACH ROW EXECUTE FUNCTION update_goal_amount();

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- Monthly spending by category
CREATE OR REPLACE VIEW monthly_spending_by_category AS
SELECT 
    t.user_id,
    DATE_TRUNC('month', t.date) as month,
    t.category_id,
    c.name as category_name,
    c.icon as category_icon,
    c.color as category_color,
    SUM(t.amount) as total_amount,
    COUNT(*) as transaction_count
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.type = 'expense'
GROUP BY t.user_id, DATE_TRUNC('month', t.date), t.category_id, c.name, c.icon, c.color;

-- Net worth calculation
CREATE OR REPLACE VIEW user_net_worth AS
SELECT 
    user_id,
    SUM(CASE WHEN type IN ('checking', 'savings', 'investment', 'cash') THEN balance ELSE 0 END) as total_assets,
    SUM(CASE WHEN type IN ('credit_card', 'loan') THEN ABS(balance) ELSE 0 END) as total_liabilities,
    SUM(CASE 
        WHEN type IN ('checking', 'savings', 'investment', 'cash') THEN balance 
        WHEN type IN ('credit_card', 'loan') THEN -ABS(balance)
        ELSE 0 
    END) as net_worth
FROM accounts
WHERE is_active = true AND include_in_net_worth = true
GROUP BY user_id;
