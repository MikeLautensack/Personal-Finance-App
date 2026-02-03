import {
  Account,
  AccountSearchParams,
  AccountSummary,
  CreateAccountInput,
  UpdateAccountInput,
} from "@/lib/types";
import { getSupabaseClient } from "./utils";

export async function getAccounts(
  params?: AccountSearchParams
): Promise<Account[]> {
  const { client: supabase, userId } = await getSupabaseClient();

  let query = supabase.from("accounts").select("*").eq("user_id", userId);

  // Filter by type
  if (params?.type && params.type !== "all") {
    query = query.eq("type", params.type);
  }

  // Filter by active status
  if (params?.is_active !== undefined) {
    query = query.eq("is_active", params.is_active === "true");
  }

  // Sort
  const sortField = params?.sort || "name";
  const sortOrder = params?.order || "asc";
  query = query.order(sortField, { ascending: sortOrder === "asc" });

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching accounts:", error);
    return [];
  }

  return data as Account[];
}

export async function getAccountById(id: string): Promise<Account | null> {
  const { client: supabase, userId } = await getSupabaseClient();

  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching account:", error);
    return null;
  }

  return data as Account;
}

export async function getAccountSummary(): Promise<AccountSummary> {
  const { client: supabase, userId } = await getSupabaseClient();

  const { data, error } = await supabase
    .from("accounts")
    .select("type, balance")
    .eq("user_id", userId)
    .eq("is_active", true)
    .eq("include_in_net_worth", true);

  if (error) {
    console.error("Error fetching account summary:", error);
    return { total_assets: 0, total_liabilities: 0, net_worth: 0 };
  }

  const total_assets = data
    .filter((a) =>
      ["checking", "savings", "investment", "cash"].includes(a.type)
    )
    .reduce((sum, a) => sum + Number(a.balance), 0);

  const total_liabilities = data
    .filter((a) => ["credit_card", "loan"].includes(a.type))
    .reduce((sum, a) => sum + Math.abs(Number(a.balance)), 0);

  return {
    total_assets,
    total_liabilities,
    net_worth: total_assets - total_liabilities,
  };
}

export async function createAccount(
  input: CreateAccountInput
): Promise<Account> {
  const { client: supabase, userId } = await getSupabaseClient();

  const { data, error } = await supabase
    .from("accounts")
    .insert({
      user_id: userId,
      name: input.name,
      type: input.type,
      balance: input.balance ?? 0,
      currency: input.currency ?? "USD",
      institution: input.institution,
      account_number: input.account_number,
      color: input.color,
      icon: input.icon,
      is_active: true,
      include_in_net_worth: true,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating account:", error);
    throw new Error("Failed to create account");
  }

  return data as Account;
}

export async function updateAccount(
  id: string,
  input: UpdateAccountInput
): Promise<Account | null> {
  const { client: supabase, userId } = await getSupabaseClient();

  const { data, error } = await supabase
    .from("accounts")
    .update(input)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating account:", error);
    return null;
  }

  return data as Account;
}

export async function deleteAccount(id: string): Promise<boolean> {
  const { client: supabase, userId } = await getSupabaseClient();

  const { error } = await supabase
    .from("accounts")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("Error deleting account:", error);
    return false;
  }

  return true;
}
