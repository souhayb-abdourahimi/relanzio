import { createClient } from "@supabase/supabase-js";

export const db = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export async function getProfile(user) {
  const { data, error } = await db.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (error) throw error;
  if (data) return data;
  const { data: created, error: createError } = await db.from("profiles")
    .insert({ id: user.id, email: user.email, plan: "free" }).select("*").single();
  if (createError) throw createError;
  return created;
}
