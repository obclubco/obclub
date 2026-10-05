"use client";

import Link from "next/link";
import { Section, Kicker, Button } from "../ui/primitives";
import { Reveal, SplitWords } from "../ui/motion";
import { Calendar, Users, Mic, Handshake, Sparkle, ArrowUpRight } from "../ui/icons";

const WHATSAPP = "https://chat.whatsapp.com/KJfMcHDByFaCrceZFesOp9?mode=gi_t";

const pillars = [
  {
    icon: <Calendar />,
    title: "Curated Events",
    desc: "Private dinners, roundtables, and socials, small rooms, high signal. You leave with contacts that actually convert.",
    href: "/events",
  },
  {
    icon: <Users />,
    title: "Private Community",
    desc: "A living network of founders and operators. Ask, share, and get answers from people who have already done it.",
    href: WHATSAPP,
  },
  {
    icon: <Mic />,
    title: "The Podcast",
    desc: "Behind the Business, unfiltered stories, numbers, and lessons from members building in real time.",
    href: "/podcast",
  },
  {
    icon: <Handshake />,
    title: "Partnerships",
    desc: "Referrals, deals, and quiet introductions. The kind of collaboration that moves the needle for everyone involved.",
    href: "/partners",
  },
];

export default function Features() {
  return (
    <div id="events" className="relative py-24 sm:py-28">
      <Section data-wf="/#features">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <Kicker icon={<Sparkle className="h-3.5 w-3.5" />}>What you get</Kicker>
            </Reveal>
            <h2 className="display mt-6 max-w-[15ch] text-[clamp(32px,4.4vw,56px)] leading-[1.05]">
              <SplitWords text="One club. Every connection you need." />
            </h2>
          </div>
          <Reveal delay={0.15} className="max-w-[36ch]">
            <p className="text-[16px] text-[var(--text-muted)]">
              Everything OB Club offers points at the same outcome, putting you in the
              room with people who make you better.
            </p>
            <div className="mt-5">
              <Button href={WHATSAPP}>Join Free Community</Button>
            </div>
          </Reveal>
        </div>

        {/* editorial feature rows, full-width, oversized, no cards */}
        <div>
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <Link
                href={p.href}
                {...(/^https?:\/\//.test(p.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group relative grid grid-cols-[3ch_1fr_auto] items-center gap-x-5 border-t border-[var(--border)] py-8 transition-colors duration-500 last:border-b md:grid-cols-[5ch_4rem_1fr_auto] md:gap-x-8"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-px w-0 bg-white/60 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full"
                />
                <span className="serif text-[15px] tabular-nums text-[var(--text-faint)] transition-colors duration-500 group-hover:text-[var(--text)]">
                  0{i + 1}
                </span>
                <span className="hidden h-14 w-14 place-items-center rounded-xl border border-[var(--border-2)] text-white transition-all duration-500 group-hover:translate-x-1 group-hover:border-white/40 md:grid">
                  {p.icon}
                </span>
                <div className="transition-transform duration-500 group-hover:md:translate-x-1">
                  <h3 className="serif text-[clamp(23px,2.8vw,32px)] font-bold leading-[1.06]">
                    {p.title}
                  </h3>
                  <p className="mt-2 max-w-[54ch] text-[15px] leading-relaxed text-[var(--text-muted)]">
                    {p.desc}
                  </p>
                </div>
                <ArrowUpRight className="h-6 w-6 -translate-x-2 justify-self-end text-[var(--text-faint)] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:text-[var(--text)] group-hover:opacity-100" />
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </div>
  );
}
