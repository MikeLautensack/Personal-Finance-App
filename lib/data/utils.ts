import { createClient, createAdminClient } from "@/lib/supabase/server";

// Development user ID - used when auth is disabled
const DEV_USER_ID = "00000000-0000-0000-0000-000000000000";

// Helper to get the current user ID
export async function getUserId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return user.id;
  }

  // Fallback for local development without auth
  return DEV_USER_ID;
}

// Helper to get a Supabase client that works for the current auth state
// Uses admin client (bypasses RLS) when no user is authenticated
export async function getSupabaseClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is authenticated, use the regular client (respects RLS)
  if (user) {
    return { client: supabase, userId: user.id };
  }

  // For local development without auth, use admin client (bypasses RLS)
  const adminClient = createAdminClient();
  return { client: adminClient, userId: DEV_USER_ID };
}
