import { episodes as seedEpisodes, type Episode } from "./podcast";
import { blogPosts as seedPosts, type BlogPost } from "./blog";
import { upcomingEvents as seedEvents, type OBEvent } from "./events";
import { faqs as seedFaqs, type Faq } from "./faqs";
import { PARTNERS as seedPartners, type Partner } from "./partners";

// All site content lives in the TS files in lib/. Edit them and push to main:
// the GitHub Pages workflow rebuilds the static site.

export type Quote = { name: string; role: string; quote: string; photo?: string };
export type Stats = { members: string; eventsHosted: string };

export const DEFAULT_STATS: Stats = { members: "137", eventsHosted: "6+" };

// Testimonials shown on the site. Empty hides the section.
const seedQuotes: Quote[] = [];

// Async so pages don't change if content ever moves to a CMS or API.
async function list<T>(items: T[]): Promise<T[]> {
  return items;
}

export async function getEpisodes(): Promise<Episode[]> {
  const all = await list(seedEpisodes);
  return [...all].sort((a, b) => b.number - a.number);
}

export async function getEpisode(slug: string): Promise<Episode | undefined> {
  return (await getEpisodes()).find((e) => e.slug === slug);
}

export async function getPosts(): Promise<BlogPost[]> {
  const all = await list(seedPosts);
  return [...all].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostsForEpisode(episodeSlug: string): Promise<BlogPost[]> {
  return (await getPosts()).filter((p) => p.episodeSlug === episodeSlug);
}

export async function getPost(episodeSlug: string, slug: string): Promise<BlogPost | undefined> {
  return (await getPosts()).find((p) => p.episodeSlug === episodeSlug && p.slug === slug);
}

export const getFaqs = () => list(seedFaqs);
export const getPartners = () => list(seedPartners);
export const getQuotes = () => list(seedQuotes);

/** Upcoming events only (today or later at build time), soonest first.
 *  The deploy workflow rebuilds daily so past events drop off. */
export async function getEvents(): Promise<OBEvent[]> {
  const all = await list(seedEvents);
  const today = new Date().toISOString().slice(0, 10);
  return all.filter((e) => e.date >= today).sort((a, b) => (a.date < b.date ? -1 : 1));
}

export async function getStats(): Promise<Stats> {
  const [s] = await list([DEFAULT_STATS]);
  return { ...DEFAULT_STATS, ...(s || {}) };
}
