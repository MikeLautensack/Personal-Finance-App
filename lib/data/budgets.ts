import { Budget, CreateBudgetInput, UpdateBudgetInput } from "@/lib/types";
import { getSupabaseClient } from "./utils";

export async function getBudgets(): Promise<Budget[]> {
  const { client: supabase, userId } = await getSupabaseClient();

  const { data, error } = await supabase
    .from("budgets")
    .select(
      `
      *,
      category:categories(*)
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching budgets:", error);
    return [];
  }

  return data as Budget[];
}

export async function getBudgetById(id: string): Promise<Budget | null> {
  const { client: supabase, userId } = await getSupabaseClient();

  const { data, error } = await supabase
    .from("budgets")
    .select(
      `
      *,
      category:categories(*)
    `
    )
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching budget:", error);
    return null;
  }

  return data as Budget;
}

export async function createBudget(input: CreateBudgetInput): Promise<Budget> {
  const { client: supabase, userId } = await getSupabaseClient();

  const { data, error } = await supabase
    .from("budgets")
    .insert({
      user_id: userId,
      category_id: input.category_id,
      amount: input.amount,
      period: input.period,
      start_date: input.start_date,
      end_date: input.end_date,
      is_recurring: input.is_recurring ?? true,
      alert_threshold: input.alert_threshold ?? 80,
      alert_enabled: input.alert_enabled ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating budget:", error);
    throw new Error("Failed to create budget");
  }

  return data as Budget;
}

export async function updateBudget(
  id: string,
  input: UpdateBudgetInput
): Promise<Budget | null> {
  const { client: supabase, userId } = await getSupabaseClient();

  const { data, error } = await supabase
    .from("budgets")
    .update(input)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating budget:", error);
    return null;
  }

  return data as Budget;
}

export async function deleteBudget(id: string): Promise<boolean> {
  const { client: supabase, userId } = await getSupabaseClient();

  const { error } = await supabase
    .from("budgets")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("Error deleting budget:", error);
    return false;
  }

  return true;
}
