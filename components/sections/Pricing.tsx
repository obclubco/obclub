"use client";

import { Section, Kicker, Button } from "../ui/primitives";
import { Reveal, SplitWords } from "../ui/motion";
import { Mic, ArrowUpRight } from "../ui/icons";
import YouTube from "../ui/YouTube";
import type { Episode } from "../../lib/podcast";

export type EpisodeTeaser = Pick<Episode, "slug" | "title" | "excerpt" | "guest" | "videoId"> & { lessonCount: number };

export default function Pricing({ latest }: { latest?: EpisodeTeaser }) {
  if (!latest) return null;
  return (
    <div id="podcast" className="relative py-24 sm:py-28">
      <Section data-wf="/#podcast">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-start">
          <div>
            <Reveal>
              <Kicker icon={<Mic className="h-3.5 w-3.5" />}>The OB Club Podcast</Kicker>
            </Reveal>
            <h2 className="display mt-6 max-w-[14ch] text-[clamp(32px,4.4vw,56px)] leading-[1.05]">
              <SplitWords text="Behind the Business" />
            </h2>
          </div>
          <Reveal delay={0.15} className="max-w-[38ch]">
            <p className="text-[16px] text-[var(--text-muted)]">
              Real stories, real numbers, real lessons from members building in the open,
              each episode broken down into the takeaways that actually move a business.
            </p>
            <div className="mt-5">
              <Button href="/podcast" variant="dark">
                View All Episodes
              </Button>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <Reveal y={30}>
            {latest.videoId ? (
              <YouTube id={latest.videoId} title={latest.title} className="h-full" />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-[var(--border-2)] bg-[var(--bg-2)] text-[13px] text-[var(--text-faint)]">
                Recording soon
              </div>
            )}
          </Reveal>

          <Reveal delay={0.1} y={30}>
            {/* de-carded, bordered editorial panel, links to the full episode blog */}
            <a
              href={`/podcast/${latest.slug}`}
              className="group flex h-full flex-col justify-between border-t border-[var(--border)] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
            >
              <div>
                <p className="kicker">Latest Episode</p>
                <h3 className="serif mt-3 text-[clamp(20px,2.4vw,26px)] font-bold leading-snug">
                  {latest.title}
                </h3>
                <p className="mt-2 text-[13px] text-[var(--text-faint)]">
                  {latest.guest ? `With ${latest.guest} · ` : ""}
                  {latest.lessonCount} lessons inside
                </p>
                <p className="mt-4 max-w-[42ch] text-[14.5px] leading-relaxed text-[var(--text-muted)]">
                  {latest.excerpt}
                </p>
              </div>
              <span className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium text-[var(--text)]">
                Read the breakdown
                <ArrowUpRight className="h-4 w-4 -translate-x-1 transition-transform duration-500 group-hover:translate-x-0" />
              </span>
            </a>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
