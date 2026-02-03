import {
  Transaction,
  TransactionSearchParams,
  TransactionSummary,
  CreateTransactionInput,
  UpdateTransactionInput,
} from "@/lib/types";
import { getSupabaseClient } from "./utils";

export async function getTransactions(
  params?: TransactionSearchParams
): Promise<Transaction[]> {
  const { client: supabase, userId } = await getSupabaseClient();

  let query = supabase
    .from("transactions")
    .select(
      `
      *,
      account:accounts!transactions_account_id_fkey(*),
      category:categories(*),
      transfer_account:accounts!transactions_transfer_account_id_fkey(*)
    `
    )
    .eq("user_id", userId);

  // Filter by type
  if (params?.type && params.type !== "all") {
    query = query.eq("type", params.type);
  }

  // Filter by month (YYYY-MM)
  if (params?.month) {
    const startDate = `${params.month}-01`;
    const [year, month] = params.month.split("-").map(Number);
    const endDate = new Date(year, month, 0).toISOString().split("T")[0];
    query = query.gte("date", startDate).lte("date", endDate);
  }

  // Filter by account
  if (params?.account_id) {
    query = query.eq("account_id", params.account_id);
  }

  // Filter by category
  if (params?.category_id) {
    query = query.eq("category_id", params.category_id);
  }

  // Search in description
  if (params?.search) {
    query = query.or(
      `description.ilike.%${params.search}%,notes.ilike.%${params.search}%`
    );
  }

  // Sort
  const sortField = params?.sort || "date";
  const sortOrder = params?.order || "desc";
  query = query.order(sortField, { ascending: sortOrder === "asc" });

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }

  return data as Transaction[];
}

export async function getTransactionById(
  id: string
): Promise<Transaction | null> {
  const { client: supabase, userId } = await getSupabaseClient();

  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
      *,
      account:accounts!transactions_account_id_fkey(*),
      category:categories(*),
      transfer_account:accounts!transactions_transfer_account_id_fkey(*)
    `
    )
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching transaction:", error);
    return null;
  }

  return data as Transaction;
}

export async function getTransactionSummary(
  month?: string
): Promise<TransactionSummary> {
  const { client: supabase, userId } = await getSupabaseClient();

  let query = supabase
    .from("transactions")
    .select("type, amount")
    .eq("user_id", userId);

  if (month) {
    const startDate = `${month}-01`;
    const [year, monthNum] = month.split("-").map(Number);
    const endDate = new Date(year, monthNum, 0).toISOString().split("T")[0];
    query = query.gte("date", startDate).lte("date", endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching transaction summary:", error);
    return { income: 0, expenses: 0, net: 0 };
  }

  const income = data
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = data
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return {
    income,
    expenses,
    net: income - expenses,
  };
}

export async function createTransaction(
  input: CreateTransactionInput
): Promise<Transaction> {
  const { client: supabase, userId } = await getSupabaseClient();

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: userId,
      account_id: input.account_id,
      category_id: input.category_id,
      type: input.type,
      amount: input.amount,
      currency: "USD",
      description: input.description,
      notes: input.notes,
      date: input.date,
      transfer_account_id: input.transfer_account_id,
      is_recurring: false,
      tags: input.tags,
      location: input.location,
      is_pending: input.is_pending ?? false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating transaction:", error);
    throw new Error("Failed to create transaction");
  }

  // Note: Account balance is automatically updated by database trigger
  return data as Transaction;
}

export async function updateTransaction(
  id: string,
  input: UpdateTransactionInput
): Promise<Transaction | null> {
  const { client: supabase, userId } = await getSupabaseClient();

  const { data, error } = await supabase
    .from("transactions")
    .update(input)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating transaction:", error);
    return null;
  }

  // Note: Account balance is automatically updated by database trigger
  return data as Transaction;
}

export async function deleteTransaction(id: string): Promise<boolean> {
  const { client: supabase, userId } = await getSupabaseClient();

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("Error deleting transaction:", error);
    return false;
  }

  // Note: Account balance is automatically updated by database trigger
  return true;
}
