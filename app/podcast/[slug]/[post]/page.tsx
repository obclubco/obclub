import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section, Button } from "../../../../components/ui/primitives";
import { ArrowUpRight } from "../../../../components/ui/icons";
import { getEpisode, getPost, getPosts, getPostsForEpisode } from "../../../../lib/content";
import { abs, OG_IMAGE } from "../../../../lib/site";

const WHATSAPP = "https://chat.whatsapp.com/KJfMcHDByFaCrceZFesOp9?mode=gi_t";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.episodeSlug, post: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; post: string }>;
}): Promise<Metadata> {
  const { slug, post } = await params;
  const p = await getPost(slug, post);
  if (!p) return { title: "Article not found | OB Club" };
  const ep = await getEpisode(slug);
  const image = ep?.videoId
    ? `https://i.ytimg.com/vi/${ep.videoId}/maxresdefault.jpg`
    : undefined;
  return {
    title: { absolute: p.seo.title },
    description: p.seo.description,
    keywords: p.seo.keywords,
    alternates: { canonical: `/podcast/${slug}/${post}` },
    openGraph: {
      title: p.seo.title,
      description: p.seo.description,
      url: `/podcast/${slug}/${post}`,
      type: "article",
      images: image ? [image] : [OG_IMAGE],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; post: string }>;
}) {
  const { slug, post } = await params;
  const p = await getPost(slug, post);
  if (!p) notFound();
  const episode = await getEpisode(slug);
  const siblings = (await getPostsForEpisode(slug)).filter((x) => x.slug !== p.slug);
  const posterUrl = episode?.videoId
    ? `https://i.ytimg.com/vi/${episode.videoId}/hqdefault.jpg`
    : "/obc/podcast.jpg";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    datePublished: p.date,
    description: p.seo.description,
    keywords: p.seo.keywords.join(", "),
    url: abs(`/podcast/${slug}/${post}`),
    mainEntityOfPage: abs(`/podcast/${slug}/${post}`),
    image: [posterUrl.startsWith("http") ? posterUrl : abs(posterUrl)],
    author: { "@type": "Organization", name: "OB Club", url: abs("/") },
    publisher: {
      "@type": "Organization",
      name: "OB Club",
      logo: { "@type": "ImageObject", url: abs("/icon.png") },
    },
    ...(episode
      ? { isPartOf: { "@type": "PodcastEpisode", name: episode.title } }
      : {}),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-halo relative overflow-hidden pt-32 pb-6 sm:pt-40">
        <div className="grid-lines" />
        <Section>
          <div className="w-full">
            {episode && (
              <Link
                href={`/podcast/${slug}`}
                className="inline-flex items-center gap-2 text-[13px] text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
              >
                <ArrowUpRight className="h-4 w-4 rotate-180" />
                From the episode: {episode.title}
              </Link>
            )}
            <p className="kicker mt-6">Article · {p.readTime}</p>
            <h1 className="display display-tight mt-4 text-[clamp(30px,4.6vw,54px)] leading-[1.05]">
              {p.title}
            </h1>
            <p className="mt-5 text-[13px] text-[var(--text-faint)]">
              {new Date(p.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </Section>
      </div>

      {/* article hero image */}
      <Section className="pb-2">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[var(--border-2)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={posterUrl}
            alt={p.title}
            className="h-full w-full object-cover"
          />
        </div>
      </Section>

      {/* body — server-rendered for SEO */}
      <Section className="py-12">
        <article className="w-full">
          <div className="space-y-5">
            {p.intro.map((para, i) => (
              <p key={i} className="text-[19px] leading-relaxed text-[var(--text)]">
                {para}
              </p>
            ))}
          </div>

          <div className="mt-10 space-y-12">
            {p.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="serif text-[clamp(22px,3vw,30px)] font-bold leading-[1.12]">
                  {s.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {s.body.map((para, j) => (
                    <p
                      key={j}
                      className="text-[16.5px] leading-relaxed text-[var(--text-muted)]"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[var(--border)] pt-10 sm:flex-row sm:items-center">
            <p className="serif max-w-[26ch] text-[clamp(19px,2.2vw,24px)] font-bold">
              Get lessons like this from the room itself.
            </p>
            <Button href={WHATSAPP}>Join Free Community</Button>
          </div>
        </article>
      </Section>

      {/* sibling articles from the same episode */}
      {siblings.length > 0 && (
        <Section className="pb-24">
          <div className="w-full">
            <p className="kicker">More from this episode</p>
            <div className="mt-6 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
              {siblings.map((s) => (
                <Link
                  key={s.slug}
                  href={`/podcast/${slug}/${s.slug}`}
                  className="group border-t border-[var(--border)] py-7"
                >
                  <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-xl border border-[var(--border-2)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={posterUrl}
                      alt={s.title}
                      className="h-full w-full object-cover opacity-80 grayscale transition-all duration-700 group-hover:scale-[1.03] group-hover:opacity-100 group-hover:grayscale-0"
                    />
                  </div>
                  <span className="text-[12px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
                    {s.readTime}
                  </span>
                  <h3 className="serif mt-2 text-[20px] font-bold leading-snug">
                    {s.title}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-2 text-[13.5px] text-[var(--text-muted)] transition-colors group-hover:text-[var(--text)]">
                    Read article
                    <ArrowUpRight className="h-4 w-4 -translate-x-1 transition-transform duration-500 group-hover:translate-x-0" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Section>
      )}
    </main>
  );
}
