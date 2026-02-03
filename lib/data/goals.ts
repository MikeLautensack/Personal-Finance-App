import { Goal, CreateGoalInput, UpdateGoalInput } from "@/lib/types";
import { getSupabaseClient } from "./utils";

export async function getGoals(): Promise<Goal[]> {
  const { client: supabase, userId } = await getSupabaseClient();

  const { data, error } = await supabase
    .from("goals")
    .select(
      `
      *,
      account:accounts(*)
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching goals:", error);
    return [];
  }

  return data as Goal[];
}

export async function getGoalById(id: string): Promise<Goal | null> {
  const { client: supabase, userId } = await getSupabaseClient();

  const { data, error } = await supabase
    .from("goals")
    .select(
      `
      *,
      account:accounts(*)
    `
    )
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching goal:", error);
    return null;
  }

  return data as Goal;
}

export async function createGoal(input: CreateGoalInput): Promise<Goal> {
  const { client: supabase, userId } = await getSupabaseClient();

  const { data, error } = await supabase
    .from("goals")
    .insert({
      user_id: userId,
      name: input.name,
      target_amount: input.target_amount,
      current_amount: input.current_amount ?? 0,
      currency: input.currency ?? "USD",
      target_date: input.target_date,
      icon: input.icon,
      color: input.color,
      account_id: input.account_id,
      status: "active",
      notes: input.notes,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating goal:", error);
    throw new Error("Failed to create goal");
  }

  return data as Goal;
}

export async function updateGoal(
  id: string,
  input: UpdateGoalInput
): Promise<Goal | null> {
  const { client: supabase, userId } = await getSupabaseClient();

  const { data, error } = await supabase
    .from("goals")
    .update(input)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating goal:", error);
    return null;
  }

  return data as Goal;
}

export async function deleteGoal(id: string): Promise<boolean> {
  const { client: supabase, userId } = await getSupabaseClient();

  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("Error deleting goal:", error);
    return false;
  }

  return true;
}
