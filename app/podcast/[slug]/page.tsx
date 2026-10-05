import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import YouTube from "../../../components/ui/YouTube";
import { Button, Section } from "../../../components/ui/primitives";
import { Reveal } from "../../../components/ui/motion";
import { ArrowUpRight, Check, Mic, Quote } from "../../../components/ui/icons";
import { getEpisode, getEpisodes, getPostsForEpisode } from "../../../lib/content";
import { OG_IMAGE } from "../../../lib/site";

const WHATSAPP = "https://chat.whatsapp.com/KJfMcHDByFaCrceZFesOp9?mode=gi_t";

export async function generateStaticParams() {
  return (await getEpisodes()).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ep = await getEpisode(slug);
  if (!ep) return { title: "Episode not found | OB Club" };
  const image = ep.videoId
    ? `https://i.ytimg.com/vi/${ep.videoId}/maxresdefault.jpg`
    : undefined;
  return {
    title: { absolute: ep.seo.title },
    description: ep.seo.description,
    keywords: ep.seo.keywords,
    alternates: { canonical: `/podcast/${ep.slug}` },
    openGraph: {
      title: ep.seo.title,
      description: ep.seo.description,
      url: `/podcast/${ep.slug}`,
      type: "article",
      images: image ? [image] : [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: ep.seo.title,
      description: ep.seo.description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ep = await getEpisode(slug);
  if (!ep) notFound();

  const posterUrl = ep.videoId
    ? `https://i.ytimg.com/vi/${ep.videoId}/hqdefault.jpg`
    : "/obc/podcast.jpg";
  const episodes = await getEpisodes();
  const ordered = [...episodes].sort((a, b) => a.number - b.number);
  const idx = ordered.findIndex((e) => e.slug === ep.slug);
  const prevEp = idx > 0 ? ordered[idx - 1] : null;
  const nextEp = idx < ordered.length - 1 ? ordered[idx + 1] : null;
  const nav = [
    prevEp ? { label: "Previous episode", e: prevEp } : null,
    nextEp ? { label: "Next episode", e: nextEp } : null,
  ].filter(Boolean) as { label: string; e: (typeof episodes)[number] }[];
  const posts = await getPostsForEpisode(ep.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: ep.title,
    episodeNumber: ep.number,
    datePublished: ep.date,
    description: ep.seo.description,
    keywords: ep.seo.keywords.join(", "),
    partOfSeries: {
      "@type": "PodcastSeries",
      name: "Behind the Business",
    },
    ...(ep.videoId
      ? {
          associatedMedia: {
            "@type": "VideoObject",
            name: ep.title,
            description: ep.seo.description,
            thumbnailUrl: `https://i.ytimg.com/vi/${ep.videoId}/maxresdefault.jpg`,
            uploadDate: ep.date,
            embedUrl: `https://www.youtube.com/embed/${ep.videoId}`,
            contentUrl: `https://www.youtube.com/watch?v=${ep.videoId}`,
          },
        }
      : {}),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* header */}
      <div className="bg-halo relative overflow-hidden pt-32 pb-8 sm:pt-40">
        <div className="grid-lines" />
        <Section>
          <Link
            href="/podcast"
            className="group inline-flex items-center gap-2 text-[13px] text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
          >
            <ArrowUpRight className="h-4 w-4 rotate-180" />
            All episodes
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-2)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-muted)]">
              <Mic className="h-3 w-3" /> Episode {ep.number}
            </span>
            {ep.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-[var(--text-faint)]"
              >
                {t}
              </span>
            ))}
          </div>
          <h1 className="display display-tight mt-6 max-w-[20ch] text-[clamp(32px,5vw,64px)] leading-[1.04]">
            {ep.title}
          </h1>
          <p className="mt-5 text-[13.5px] text-[var(--text-faint)]">
            {ep.guest ? (
              <>
                With <span className="text-[var(--text-muted)]">{ep.guest}</span>
                {ep.guestRole ? `, ${ep.guestRole}` : ""} ·{" "}
              </>
            ) : null}
            {new Date(ep.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            · {ep.duration}
          </p>
        </Section>
      </div>

      {/* video */}
      <Section className="pb-4">
        <Reveal y={30}>
          {ep.videoId ? (
            <YouTube id={ep.videoId} title={ep.title} />
          ) : (
            <div className="bracket flex aspect-video w-full items-center justify-center rounded-xl border border-[var(--border-2)] bg-[var(--bg-2)] text-center">
              <div>
                <Mic className="mx-auto h-8 w-8 text-[var(--text-faint)]" />
                <p className="mt-3 text-[15px] font-medium">This episode is recording soon</p>
                <p className="mt-1 text-[13px] text-[var(--text-faint)]">
                  Read the breakdown below, the video drops shortly.
                </p>
              </div>
            </div>
          )}
        </Reveal>
      </Section>

      {/* article body, server-rendered for SEO. Full section width = video width. */}
      <Section className="py-14">
        <div className="w-full">
          {/* intro */}
          <div className="space-y-5">
            {ep.intro.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-[19px] leading-relaxed text-[var(--text)]"
                    : "text-[17px] leading-relaxed text-[var(--text-muted)]"
                }
              >
                {p}
              </p>
            ))}
          </div>

          {/* pull quote */}
          {ep.pullQuote && (
            <figure className="my-14 border-l-2 border-white/40 pl-6">
              <Quote className="h-7 w-7 text-[var(--text-faint)]" />
              <blockquote className="serif mt-3 text-[clamp(22px,3vw,30px)] font-bold leading-[1.2]">
                &ldquo;{ep.pullQuote.text}&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-[13px] text-[var(--text-faint)]">
                {ep.pullQuote.attribution}
              </figcaption>
            </figure>
          )}

          {/* lessons, the mini-articles inside the episode */}
          <div className="mt-14">
            <p className="kicker">Lessons from this episode</p>
            <div className="mt-8 space-y-12">
              {ep.lessons.map((l, i) => (
                <article key={l.title} className="border-t border-[var(--border)] pt-8">
                  <div className="flex items-baseline gap-4">
                    <span className="serif text-[15px] tabular-nums text-[var(--text-faint)]">
                      0{i + 1}
                    </span>
                    <h2 className="serif text-[clamp(22px,3vw,30px)] font-bold leading-[1.12]">
                      {l.title}
                    </h2>
                  </div>
                  <div className="mt-4 space-y-4 pl-0 sm:pl-9">
                    {l.body.map((p, j) => (
                      <p
                        key={j}
                        className="text-[16.5px] leading-relaxed text-[var(--text-muted)]"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* takeaways */}
          <div className="mt-16 border-t border-[var(--border)] pt-10">
            <p className="kicker">The 30-second version</p>
            <ul className="mt-6 space-y-3">
              {ep.takeaways.map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-white" strokeWidth={2.2} />
                  <span className="text-[16px] leading-relaxed text-[var(--text)]">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* inline CTA */}
          <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[var(--border)] pt-10 sm:flex-row sm:items-center">
            <p className="serif max-w-[24ch] text-[clamp(20px,2.4vw,26px)] font-bold">
              Want the room these lessons come from?
            </p>
            <Button href={WHATSAPP}>Join Free Community</Button>
          </div>
        </div>
      </Section>

      {/* deeper reads — SEO spokes for this episode */}
      {posts.length > 0 && (
        <Section className="pb-6">
          <div className="w-full">
            <p className="kicker">Go deeper</p>
            <h2 className="serif mt-4 text-[clamp(24px,3.4vw,36px)] font-bold">
              Articles from this episode
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-x-10 md:grid-cols-2">
              {posts.map((b) => (
                <Link
                  key={b.slug}
                  href={`/podcast/${ep.slug}/${b.slug}`}
                  className="group border-t border-[var(--border)] py-7"
                >
                  <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-xl border border-[var(--border-2)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={posterUrl}
                      alt={b.title}
                      className="h-full w-full object-cover opacity-80 grayscale transition-all duration-700 group-hover:scale-[1.03] group-hover:opacity-100 group-hover:grayscale-0"
                    />
                  </div>
                  <span className="text-[12px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
                    {b.readTime}
                  </span>
                  <h3 className="serif mt-2 text-[20px] font-bold leading-snug">
                    {b.title}
                  </h3>
                  <p className="mt-2 max-w-[42ch] text-[14px] leading-relaxed text-[var(--text-muted)]">
                    {b.excerpt}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-2 text-[13.5px] text-[var(--text)]">
                    Read article
                    <ArrowUpRight className="h-4 w-4 -translate-x-1 transition-transform duration-500 group-hover:translate-x-0" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* previous / next episode — podcast-index card look, 50% width each */}
      {nav.length > 0 && (
        <Section className="pb-24">
          <div className="w-full">
            <p className="kicker">Keep listening</p>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {nav.map(({ label, e }) => (
                <Link
                  key={e.slug}
                  href={`/podcast/${e.slug}`}
                  className="group relative flex items-center gap-5 overflow-hidden border-t border-[var(--border)] py-7"
                >
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-px w-0 bg-white/60 transition-all duration-700 ease-[var(--ease-out-slow)] group-hover:w-full"
                  />
                  <div className="relative aspect-video w-[42%] max-w-[200px] shrink-0 overflow-hidden rounded-xl border border-[var(--border-2)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        e.videoId
                          ? `https://i.ytimg.com/vi/${e.videoId}/hqdefault.jpg`
                          : "/obc/podcast.jpg"
                      }
                      alt={e.title}
                      className="h-full w-full object-cover opacity-80 grayscale transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-100 group-hover:grayscale-0"
                    />
                    <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                      <Mic className="h-2.5 w-2.5" /> Ep. {e.number}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[12px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
                      {label}
                    </span>
                    <h3 className="serif mt-1.5 text-[18px] font-bold leading-snug">
                      {e.title}
                    </h3>
                    <span className="mt-2 inline-flex items-center gap-2 text-[13px] text-[var(--text-muted)] transition-colors group-hover:text-[var(--text)]">
                      Read the breakdown
                      <ArrowUpRight className="h-4 w-4 -translate-x-1 transition-transform duration-500 group-hover:translate-x-0" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Section>
      )}
    </main>
  );
}
