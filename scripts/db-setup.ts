// Create the obc_* tables and seed any EMPTY content kind from the lib/*.ts
// defaults. Never overwrites existing rows, so it is safe to re-run.
//   DATABASE_URL=... npx tsx scripts/db-setup.ts
import { readFileSync } from "fs";
import { join } from "path";
import postgres from "postgres";
import { episodes } from "../lib/podcast";
import { blogPosts } from "../lib/blog";
import { upcomingEvents } from "../lib/events";
import { faqs } from "../lib/faqs";
import { PARTNERS } from "../lib/partners";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");
const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url) || url.startsWith("postgres:///");
const sql = postgres(url, { max: 1, prepare: false, ssl: local ? false : "require", onnotice: () => {} });

const rid = () => Math.random().toString(36).slice(2, 10);

const seed: Record<string, { id: string; data: unknown }[]> = {
  episode: episodes.map((e) => ({ id: e.slug, data: e })),
  post: blogPosts.map((p) => ({ id: p.slug, data: p })),
  event: upcomingEvents.map((e) => ({ id: rid(), data: e })),
  faq: faqs.map((f) => ({ id: rid(), data: f })),
  partner: PARTNERS.map((p) => ({ id: rid(), data: p })),
  stats: [{ id: "stats", data: { members: "137", eventsHosted: "6+" } }],
  quote: [],
};

async function main() {
  await sql.unsafe(readFileSync(join(__dirname, "../db/schema.sql"), "utf8"));
  for (const [kind, rows] of Object.entries(seed)) {
    const [{ n }] = await sql<{ n: number }[]>`select count(*)::int as n from obc_content where kind = ${kind}`;
    if (n > 0 || rows.length === 0) {
      console.log(`${kind}: ${n} rows, skipped`);
      continue;
    }
    for (const [i, r] of rows.entries()) {
      await sql`insert into obc_content (kind, id, data, sort)
                values (${kind}, ${r.id}, ${sql.json(r.data as never)}, ${i})`;
    }
    console.log(`${kind}: seeded ${rows.length}`);
  }
  await sql.end();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
