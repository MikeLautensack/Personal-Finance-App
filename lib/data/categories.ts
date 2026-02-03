import {
  Category,
  CategorySearchParams,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/lib/types";
import { getSupabaseClient } from "./utils";

export async function getCategories(
  params?: CategorySearchParams
): Promise<Category[]> {
  const { client: supabase, userId } = await getSupabaseClient();

  let query = supabase
    .from("categories")
    .select("*")
    .or(`user_id.eq.${userId},is_system.eq.true`);

  // Filter by type
  if (params?.type) {
    query = query.eq("type", params.type);
  }

  // Filter by search
  if (params?.search) {
    query = query.ilike("name", `%${params.search}%`);
  }

  // Sort by sort_order
  query = query.order("sort_order", { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data as Category[];
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const { client: supabase, userId } = await getSupabaseClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .or(`user_id.eq.${userId},is_system.eq.true`)
    .single();

  if (error) {
    console.error("Error fetching category:", error);
    return null;
  }

  return data as Category;
}

export async function createCategory(
  input: CreateCategoryInput
): Promise<Category> {
  const { client: supabase, userId } = await getSupabaseClient();

  // Get the max sort_order for this type
  const { data: maxOrder } = await supabase
    .from("categories")
    .select("sort_order")
    .eq("type", input.type)
    .or(`user_id.eq.${userId},is_system.eq.true`)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const sortOrder = (maxOrder?.sort_order ?? 0) + 1;

  const { data, error } = await supabase
    .from("categories")
    .insert({
      user_id: userId,
      name: input.name,
      type: input.type,
      icon: input.icon,
      color: input.color,
      parent_id: input.parent_id,
      is_system: false,
      sort_order: sortOrder,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }

  return data as Category;
}

export async function updateCategory(
  id: string,
  input: UpdateCategoryInput
): Promise<Category | null> {
  const { client: supabase, userId } = await getSupabaseClient();

  // Don't allow updating system categories
  const { data, error } = await supabase
    .from("categories")
    .update(input)
    .eq("id", id)
    .eq("user_id", userId)
    .eq("is_system", false)
    .select()
    .single();

  if (error) {
    console.error("Error updating category:", error);
    return null;
  }

  return data as Category;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const { client: supabase, userId } = await getSupabaseClient();

  // Don't allow deleting system categories
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .eq("is_system", false);

  if (error) {
    console.error("Error deleting category:", error);
    return false;
  }

  return true;
}
