import "server-only";
import postgres from "postgres";

// One pooled client per server instance. Works with a local Postgres, Neon, or a
// Supabase pooler URL (prepare:false keeps transaction-mode poolers happy).
// Returns null when DATABASE_URL is unset so the public site can fall back to
// its built-in content instead of failing.
let client: postgres.Sql | null = null;

export function db(): postgres.Sql | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!client) {
    const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url) || url.startsWith("postgres:///");
    client = postgres(url, {
      max: 3,
      prepare: false,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: local ? false : "require",
    });
  }
  return client;
}
