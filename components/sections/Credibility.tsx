"use client";

import { Section, Kicker, Button } from "../ui/primitives";
import { Reveal, SplitWords } from "../ui/motion";
import { ArrowUpRight } from "../ui/icons";
import type { Quote, Stats } from "../../lib/content";

export default function Credibility({ stats, quotes }: { stats: Stats; quotes: Quote[] }) {
  return (
    <Section data-wf="/#gallery" className="py-24 sm:py-28">
      <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Reveal>
            <Kicker>Our Community</Kicker>
          </Reveal>
          <h2 className="display mt-6 max-w-[16ch] text-[clamp(32px,4.4vw,56px)] leading-[1.05]">
            <SplitWords text="Real people. Real results." />
          </h2>
        </div>
        <Reveal delay={0.15}>
          <Button href="/events" variant="dark">
            View Upcoming Events
          </Button>
        </Reveal>
      </div>

      <Reveal>
        <div className="mb-10 flex flex-wrap items-end gap-x-14 gap-y-6 border-y border-[var(--border)] py-7">
          <div>
            <div className="serif text-[clamp(34px,5vw,48px)] font-bold leading-none">{stats.members}</div>
            <div className="mt-2 text-[13px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
              members and growing
            </div>
          </div>
          <div>
            <div className="serif text-[clamp(34px,5vw,48px)] font-bold leading-none">{stats.eventsHosted}</div>
            <div className="mt-2 text-[13px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
              events hosted
            </div>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[
          ["/obc/event-1.webp", "OB Club members at a private networking dinner", "The dinner table"],
          ["/obc/event-2.webp", "OB Club members at a curated business event", "Curated business events"],
        ].map(([src, alt, label], i) => (
          <Reveal key={src} delay={i * 0.1} y={30}>
            <div className="bracket group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                className="h-[340px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] sm:h-[420px]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-5 left-6 flex items-center gap-2 text-[15px] font-medium text-white">
                {label}
                <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {quotes.length > 0 && (
        <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-12 border-t border-[var(--border)] pt-12 md:grid-cols-2 lg:grid-cols-3">
          {quotes.map((q, i) => (
            <Reveal key={`${q.name}-${i}`} delay={(i % 3) * 0.08}>
              <figure className="flex h-full flex-col">
                <blockquote className="serif flex-1 text-[clamp(19px,1.8vw,22px)] font-bold leading-snug">
                  {q.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  {q.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={q.photo} alt="" loading="lazy" className="h-10 w-10 rounded-full object-cover grayscale" />
                  ) : (
                    <span aria-hidden className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border-2)] text-[13px] text-[var(--text-muted)]">
                      {q.name.trim().charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="leading-tight">
                    <span className="block text-[15px] font-medium">{q.name}</span>
                    {q.role && <span className="block text-[13px] text-[var(--text-faint)]">{q.role}</span>}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}
