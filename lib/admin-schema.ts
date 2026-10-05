// Field definitions for every editable content type. One generic editor
// (components/admin/EntityEditor.tsx) renders any of these, so adding a field
// here is all it takes to make it editable. Paths may be dotted ("seo.title").

export type Field =
  | { type: "text"; path: string; label: string; required?: boolean; hint?: string; placeholder?: string }
  | { type: "textarea"; path: string; label: string; required?: boolean; hint?: string; rows?: number }
  | { type: "number"; path: string; label: string; required?: boolean; hint?: string }
  | { type: "date"; path: string; label: string; required?: boolean; hint?: string }
  | { type: "tags"; path: string; label: string; hint?: string } // string[] as comma list
  | { type: "paragraphs"; path: string; label: string; hint?: string; rows?: number } // string[] split on blank lines
  | { type: "lines"; path: string; label: string; hint?: string } // string[] one per line
  | { type: "image"; path: string; label: string; hint?: string }
  | { type: "youtube"; path: string; label: string; hint?: string }
  | { type: "episode"; path: string; label: string; required?: boolean; hint?: string } // select from episodes
  | { type: "list"; path: string; label: string; item: string; fields: Field[] };

export type KindDef = {
  label: string; // plural, sidebar
  singular: string;
  /** field used as the row title in lists */
  titleOf: (d: Record<string, unknown>) => string;
  subtitleOf?: (d: Record<string, unknown>) => string;
  /** stable id derived from the data (episodes/posts use slugs for URLs) */
  idOf?: (d: Record<string, unknown>) => string;
  single?: boolean; // one record only (stats)
  fields: Field[];
  blank: Record<string, unknown>;
  /** public page to open after saving */
  viewUrl?: (d: Record<string, unknown>) => string | null;
};

const s = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));

const SEO: Field[] = [
  { type: "text", path: "seo.title", label: "SEO title", hint: "About 50 to 60 characters" },
  { type: "textarea", path: "seo.description", label: "SEO description", rows: 2, hint: "About 150 characters" },
  { type: "tags", path: "seo.keywords", label: "SEO keywords" },
];

export type AdminKind = "event" | "quote" | "episode" | "post" | "partner" | "faq" | "stats";

export const KINDS: Record<AdminKind, KindDef> = {
  event: {
    label: "Events",
    singular: "Event",
    titleOf: (d) => s(d.title),
    subtitleOf: (d) =>
      [s(d.date) && s(d.date) < new Date().toISOString().slice(0, 10) ? `${s(d.date)} (past, hidden on site)` : s(d.date), s(d.time), s(d.type), s(d.place)]
        .filter(Boolean)
        .join(" · "),
    fields: [
      { type: "text", path: "title", label: "Title", required: true, placeholder: "Founders' Dinner: Rīga" },
      { type: "date", path: "date", label: "Date", required: true, hint: "Shows on /events until the day has passed." },
      { type: "text", path: "time", label: "Time", placeholder: "19:00" },
      { type: "text", path: "type", label: "Type", placeholder: "Private dinner" },
      { type: "text", path: "place", label: "Place", placeholder: "Old Town · 12 seats" },
      { type: "text", path: "url", label: "Sign-up link", hint: "Optional. Where the RSVP button goes (defaults to the WhatsApp group)." },
    ],
    blank: { title: "", date: "", time: "", type: "", place: "", url: "" },
    viewUrl: () => "/events",
  },
  quote: {
    label: "Member quotes",
    singular: "Quote",
    titleOf: (d) => s(d.name),
    subtitleOf: (d) => s(d.quote).slice(0, 90),
    fields: [
      { type: "textarea", path: "quote", label: "Quote", required: true, rows: 4 },
      { type: "text", path: "name", label: "Name", required: true },
      { type: "text", path: "role", label: "Role or company", placeholder: "Founder, Acme" },
      { type: "image", path: "photo", label: "Photo", hint: "Optional. Square works best." },
    ],
    blank: { quote: "", name: "", role: "", photo: "" },
    viewUrl: () => "/",
  },
  episode: {
    label: "Podcast episodes",
    singular: "Episode",
    titleOf: (d) => `#${s(d.number)} ${s(d.title)}`,
    subtitleOf: (d) => [s(d.date), s(d.guest)].filter(Boolean).join(" · "),
    idOf: (d) => s(d.slug),
    fields: [
      { type: "text", path: "title", label: "Title", required: true },
      { type: "text", path: "slug", label: "URL slug", required: true, hint: "Lowercase, dashes. Becomes /podcast/<slug>" },
      { type: "number", path: "number", label: "Episode number", required: true },
      { type: "youtube", path: "videoId", label: "YouTube video", hint: "Paste the YouTube link or ID. Leave empty for 'recording soon'." },
      { type: "text", path: "guest", label: "Guest" },
      { type: "text", path: "guestRole", label: "Guest role" },
      { type: "date", path: "date", label: "Release date", required: true },
      { type: "text", path: "duration", label: "Duration", placeholder: "48 min" },
      { type: "tags", path: "tags", label: "Tags" },
      { type: "textarea", path: "excerpt", label: "Card excerpt", rows: 2, required: true },
      { type: "paragraphs", path: "intro", label: "Intro", hint: "Blank line between paragraphs", rows: 6 },
      {
        type: "list",
        path: "lessons",
        label: "Lessons",
        item: "Lesson",
        fields: [
          { type: "text", path: "title", label: "Lesson title" },
          { type: "paragraphs", path: "body", label: "Body", rows: 5 },
        ],
      },
      { type: "lines", path: "takeaways", label: "Takeaways", hint: "One per line" },
      { type: "textarea", path: "pullQuote.text", label: "Pull quote", rows: 2 },
      { type: "text", path: "pullQuote.attribution", label: "Pull quote by" },
      ...SEO,
    ],
    blank: {
      slug: "", number: 0, title: "", videoId: null, guest: "", guestRole: "", date: "", duration: "",
      tags: [], excerpt: "", intro: [], lessons: [], takeaways: [], seo: { title: "", description: "", keywords: [] },
    },
    viewUrl: (d) => (d.slug ? `/podcast/${s(d.slug)}` : null),
  },
  post: {
    label: "Articles",
    singular: "Article",
    titleOf: (d) => s(d.title),
    subtitleOf: (d) => [s(d.date), s(d.readTime), d.episodeSlug ? `in ${s(d.episodeSlug)}` : "no episode"].filter(Boolean).join(" · "),
    idOf: (d) => s(d.slug),
    fields: [
      { type: "text", path: "title", label: "Title", required: true },
      { type: "episode", path: "episodeSlug", label: "Episode", required: true, hint: "The article shows on this episode's page, under 'Articles from this episode'." },
      { type: "text", path: "slug", label: "URL slug", required: true, hint: "Becomes /podcast/<episode>/<slug>" },
      { type: "date", path: "date", label: "Date", required: true },
      { type: "text", path: "readTime", label: "Read time", placeholder: "4 min read" },
      { type: "textarea", path: "excerpt", label: "Excerpt", rows: 2, required: true },
      { type: "paragraphs", path: "intro", label: "Intro", rows: 5 },
      {
        type: "list",
        path: "sections",
        label: "Sections",
        item: "Section",
        fields: [
          { type: "text", path: "heading", label: "Heading" },
          { type: "paragraphs", path: "body", label: "Body", rows: 6 },
        ],
      },
      ...SEO,
    ],
    blank: {
      slug: "", episodeSlug: "", title: "", excerpt: "", date: "", readTime: "", intro: [], sections: [],
      seo: { title: "", description: "", keywords: [] },
    },
    viewUrl: (d) => (d.slug && d.episodeSlug ? `/podcast/${s(d.episodeSlug)}/${s(d.slug)}` : null),
  },
  partner: {
    label: "Partners",
    singular: "Partner",
    titleOf: (d) => s(d.name),
    subtitleOf: (d) => s(d.note),
    fields: [
      { type: "text", path: "name", label: "Name", required: true },
      { type: "image", path: "src", label: "Logo", hint: "White or light logo on a transparent background (PNG/WebP/SVG)." },
      { type: "text", path: "note", label: "Label", placeholder: "Venue & hospitality" },
    ],
    blank: { name: "", src: "", note: "" },
    viewUrl: () => "/partners",
  },
  faq: {
    label: "FAQ",
    singular: "Question",
    titleOf: (d) => s(d.q),
    fields: [
      { type: "text", path: "q", label: "Question", required: true },
      { type: "textarea", path: "a", label: "Answer", required: true, rows: 4 },
    ],
    blank: { q: "", a: "" },
    viewUrl: () => "/#faq",
  },
  stats: {
    label: "Numbers",
    singular: "Numbers",
    single: true,
    titleOf: () => "Site numbers",
    idOf: () => "stats",
    fields: [
      { type: "text", path: "members", label: "Members", hint: "Shown on the home and events pages, e.g. 137" },
      { type: "text", path: "eventsHosted", label: "Events hosted", hint: "e.g. 6+" },
    ],
    blank: { members: "137", eventsHosted: "6+" },
    viewUrl: () => "/",
  },
};
export const isKind = (k: string): k is AdminKind => k in KINDS;

export function getPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined), obj);
}

export function setPath(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const [head, ...rest] = path.split(".");
  if (rest.length === 0) return { ...obj, [head]: value };
  const child = (obj[head] && typeof obj[head] === "object" ? obj[head] : {}) as Record<string, unknown>;
  return { ...obj, [head]: setPath(child, rest.join("."), value) };
}

/** Accept a full YouTube URL or a bare 11-char id. */
export function youtubeId(input: string): string | null {
  const v = input.trim();
  if (!v) return null;
  const m = v.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/);
  if (m) return m[1];
  return /^[\w-]{11}$/.test(v) ? v : null;
}
