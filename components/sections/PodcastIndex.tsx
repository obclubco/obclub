"use client";

import Link from "next/link";
import { Section } from "../ui/primitives";
import { Reveal } from "../ui/motion";
import { ArrowUpRight, Mic } from "../ui/icons";
import type { Episode } from "../../lib/podcast";
import EmailCapture from "./EmailCapture";

function poster(videoId: string | null) {
  return videoId
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : "/obc/podcast.jpg";
}

export default function PodcastIndex({ episodes }: { episodes: Episode[] }) {
  return (
    <Section className="py-20 sm:py-24">
      {/* ── Monthly cadence + notify ──────────────────────────────────── */}
      <Reveal>
        <div className="bg-halo bracket relative mb-20 flex flex-col items-start gap-8 overflow-hidden rounded-3xl border border-[var(--border-2)] bg-[var(--bg)] p-8 sm:p-10 md:flex-row md:items-center md:justify-between">
          <div className="grid-lines grid-lines--strong" />
          <div className="relative max-w-[48ch]">
            <p className="kicker inline-flex items-center gap-2">
              <Mic className="h-3.5 w-3.5" /> Coming soon
            </p>
            <h2 className="serif mt-3 text-[clamp(24px,3.4vw,36px)] font-bold leading-snug">
              A new episode every month.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-muted)]">
              Behind the Business drops one deep-dive a month: real founders, real
              numbers, the lessons that actually move a business. Leave your email and
              we&rsquo;ll tell you the moment the next one is live.
            </p>
          </div>
          <div className="relative w-full md:w-auto md:min-w-[380px]">
            <EmailCapture
              topic="podcast"
              cta="Tune in"
              successTitle="You're subscribed."
              successNote="We'll email you when the next episode drops."
            />
          </div>
        </div>
      </Reveal>

      {/* ── Available now — real episodes, latest first ───────────────── */}
      <div>
        <p className="kicker">Available now</p>
        <div className="mt-6">
          {episodes.map((e, i) => (
            <Reveal key={e.slug} delay={i * 0.06}>
              <Link
                href={`/podcast/${e.slug}`}
                className="group relative grid grid-cols-1 items-center gap-6 border-t border-[var(--border)] py-8 transition-colors duration-500 last:border-b sm:grid-cols-[240px_1fr_auto] sm:gap-8"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-px w-0 bg-white/60 transition-all duration-700 ease-[var(--ease-out-slow)] group-hover:w-full"
                />
                <div className="relative aspect-video overflow-hidden rounded-xl border border-[var(--border-2)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={poster(e.videoId)}
                    alt={e.title}
                    className="h-full w-full object-cover opacity-80 grayscale transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-100 group-hover:grayscale-0"
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                    <Mic className="h-3 w-3" /> Ep. {e.number}
                  </span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {e.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[11px] uppercase tracking-[0.12em] text-[var(--text-faint)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="serif mt-3 text-[clamp(20px,2.4vw,28px)] font-bold leading-tight">
                    {e.title}
                  </h3>
                  <p className="mt-2 max-w-[62ch] text-[14.5px] leading-relaxed text-[var(--text-muted)]">
                    {e.excerpt}
                  </p>
                  <p className="mt-3 text-[12.5px] text-[var(--text-faint)]">
                    {e.guest ? `${e.guest} · ` : ""}
                    {e.duration} · {e.lessons.length} lessons inside
                  </p>
                </div>

                <ArrowUpRight className="hidden h-7 w-7 -translate-x-2 self-center justify-self-end text-[var(--text-faint)] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:text-[var(--text)] group-hover:opacity-100 sm:block" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
