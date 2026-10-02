import { createClient } from "@supabase/supabase-js";

const authClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export async function requireUser(req, res, next) {
  try {
    const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (!token) return res.status(401).json({ error: "Authentification requise." });
    const { data, error } = await authClient.auth.getUser(token);
    if (error || !data.user) return res.status(401).json({ error: "Session invalide." });
    req.user = data.user;
    next();
  } catch (e) {
    res.status(401).json({ error: "Impossible de vérifier la session." });
  }
}
