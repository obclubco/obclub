import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "./db";
import { episodes as seedEpisodes, type Episode } from "./podcast";
import { blogPosts as seedPosts, type BlogPost } from "./blog";
import { upcomingEvents as seedEvents, type OBEvent } from "./events";
import { faqs as seedFaqs, type Faq } from "./faqs";
import { PARTNERS as seedPartners, type Partner } from "./partners";

// Everything the admin can edit. The TS files in lib/ are the seed and the
// fallback: with no DATABASE_URL (or a DB error) the site renders them unchanged.

export type Quote = { name: string; role: string; quote: string; photo?: string };
export type Stats = { members: string; eventsHosted: string };

export const DEFAULT_STATS: Stats = { members: "137", eventsHosted: "6+" };

export type ContentMap = {
  episode: Episode;
  post: BlogPost;
  event: OBEvent;
  quote: Quote;
  partner: Partner;
  faq: Faq;
  stats: Stats;
};
export type Kind = keyof ContentMap;

export const tagFor = (kind: Kind) => `content:${kind}`;

type Row<K extends Kind> = { id: string; data: ContentMap[K]; sort: number };

async function readRows<K extends Kind>(kind: K): Promise<Row<K>[] | null> {
  const sql = db();
  if (!sql) return null;
  try {
    const rows = await sql<{ id: string; data: ContentMap[K]; sort: number }[]>`
      select id, data, sort from obc_content
      where kind = ${kind} and published = true
      order by sort asc, updated_at desc`;
    return rows;
  } catch (e) {
    console.error("[content] read failed", kind, e);
    return null;
  }
}

// Cached per kind; admin saves call revalidateTag(tagFor(kind)).
function cachedKind<K extends Kind>(kind: K) {
  return unstable_cache(async () => readRows(kind), ["obc-content", kind], {
    tags: [tagFor(kind)],
    revalidate: 3600,
  });
}

const readers = {
  episode: cachedKind("episode"),
  post: cachedKind("post"),
  event: cachedKind("event"),
  quote: cachedKind("quote"),
  partner: cachedKind("partner"),
  faq: cachedKind("faq"),
  stats: cachedKind("stats"),
};

async function list<K extends Kind>(kind: K, fallback: ContentMap[K][]): Promise<ContentMap[K][]> {
  const rows = await (readers[kind] as () => Promise<Row<K>[] | null>)();
  return rows === null ? fallback : rows.map((r) => r.data);
}

export async function getEpisodes(): Promise<Episode[]> {
  const all = await list("episode", seedEpisodes);
  return [...all].sort((a, b) => b.number - a.number);
}

export async function getEpisode(slug: string): Promise<Episode | undefined> {
  return (await getEpisodes()).find((e) => e.slug === slug);
}

export async function getPosts(): Promise<BlogPost[]> {
  const all = await list("post", seedPosts);
  return [...all].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostsForEpisode(episodeSlug: string): Promise<BlogPost[]> {
  return (await getPosts()).filter((p) => p.episodeSlug === episodeSlug);
}

export async function getPost(episodeSlug: string, slug: string): Promise<BlogPost | undefined> {
  return (await getPosts()).find((p) => p.episodeSlug === episodeSlug && p.slug === slug);
}

export const getFaqs = () => list("faq", seedFaqs);
export const getPartners = () => list("partner", seedPartners);
export const getQuotes = () => list("quote", [] as Quote[]);

/** Upcoming events only (today or later), soonest first. */
export async function getEvents(): Promise<OBEvent[]> {
  const all = await list("event", seedEvents);
  const today = new Date().toISOString().slice(0, 10);
  return all.filter((e) => e.date >= today).sort((a, b) => (a.date < b.date ? -1 : 1));
}

export async function getStats(): Promise<Stats> {
  const [s] = await list("stats", [DEFAULT_STATS]);
  return { ...DEFAULT_STATS, ...(s || {}) };
}
