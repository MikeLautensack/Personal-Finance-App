-- Seed data for Personal Finance App
-- This file contains only data inserts, schema is in migrations/

-- ============================================
-- DEFAULT SYSTEM CATEGORIES
-- These are available to all users
-- ============================================
INSERT INTO categories (name, type, icon, color, is_system, sort_order) VALUES
    -- Expense categories
    ('Groceries', 'expense', '🛒', '#22c55e', true, 1),
    ('Dining Out', 'expense', '🍽️', '#f97316', true, 2),
    ('Transportation', 'expense', '🚗', '#3b82f6', true, 3),
    ('Gas & Fuel', 'expense', '⛽', '#6366f1', true, 4),
    ('Utilities', 'expense', '💡', '#eab308', true, 5),
    ('Housing', 'expense', '🏠', '#8b5cf6', true, 6),
    ('Insurance', 'expense', '🛡️', '#06b6d4', true, 7),
    ('Healthcare', 'expense', '🏥', '#ef4444', true, 8),
    ('Entertainment', 'expense', '🎬', '#a855f7', true, 9),
    ('Shopping', 'expense', '🛍️', '#ec4899', true, 10),
    ('Subscriptions', 'expense', '📱', '#14b8a6', true, 11),
    ('Personal Care', 'expense', '💅', '#f472b6', true, 12),
    ('Education', 'expense', '📚', '#0ea5e9', true, 13),
    ('Gifts & Donations', 'expense', '🎁', '#f59e0b', true, 14),
    ('Travel', 'expense', '✈️', '#10b981', true, 15),
    ('Pets', 'expense', '🐾', '#84cc16', true, 16),
    ('Kids', 'expense', '👶', '#06b6d4', true, 17),
    ('Fees & Charges', 'expense', '💳', '#64748b', true, 18),
    ('Taxes', 'expense', '📋', '#475569', true, 19),
    ('Other Expense', 'expense', '📦', '#71717a', true, 20),
    -- Income categories
    ('Salary', 'income', '💼', '#22c55e', true, 1),
    ('Freelance', 'income', '💻', '#3b82f6', true, 2),
    ('Business', 'income', '🏢', '#8b5cf6', true, 3),
    ('Investments', 'income', '📈', '#a855f7', true, 4),
    ('Interest', 'income', '🏦', '#14b8a6', true, 5),
    ('Dividends', 'income', '💰', '#f59e0b', true, 6),
    ('Rental Income', 'income', '🏠', '#6366f1', true, 7),
    ('Gifts Received', 'income', '🎁', '#ec4899', true, 8),
    ('Refunds', 'income', '↩️', '#06b6d4', true, 9),
    ('Other Income', 'income', '💵', '#71717a', true, 10)
ON CONFLICT DO NOTHING;
