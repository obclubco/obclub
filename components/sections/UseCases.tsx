"use client";

import { Section, Kicker } from "../ui/primitives";
import { Reveal, SplitWords } from "../ui/motion";
import { Handshake, Users, Calendar, Mic, Globe, Sparkle } from "../ui/icons";

const items = [
  {
    icon: <Handshake />,
    title: "Deal flow, not small talk",
    desc: "Every connection inside OBC is a door, referrals, partnerships, and quiet introductions that move the needle.",
  },
  {
    icon: <Users />,
    title: "A room of operators",
    desc: "The caliber of people is the point. You are surrounded by builders who raise your standard by default.",
  },
  {
    icon: <Calendar />,
    title: "Events worth showing up to",
    desc: "Curated dinners and roundtables, no filler panels, just the right people around one table.",
  },
  {
    icon: <Mic />,
    title: "A platform for your story",
    desc: "Members get featured on the Behind the Business podcast, real reach, real credibility.",
  },
  {
    icon: <Globe />,
    title: "Partner perks",
    desc: "Access to what our partners offer, because the network compounds.",
  },
  {
    icon: <Sparkle />,
    title: "Friendships that last",
    desc: "Co-founders, collaborators, and friends. The relationships here outlast any single deal.",
  },
];

function joinNames(names: string[]): string {
  if (names.length < 2) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export default function UseCases({ partnerNames = [] }: { partnerNames?: string[] }) {
  const cards = items.map((it) =>
    it.title === "Partner perks" && partnerNames.length
      ? { ...it, desc: `Access to what our partners offer, from ${joinNames(partnerNames)}, because the network compounds.` }
      : it,
  );
  return (
    <Section data-wf="/#benefits-grid" className="py-24 sm:py-28">
      <div className="mb-14 text-center">
        <Reveal className="flex justify-center">
          <Kicker>Inside the Club</Kicker>
        </Reveal>
        <h2 className="display mx-auto mt-6 max-w-[18ch] text-[clamp(32px,4.4vw,56px)] leading-[1.05]">
          <SplitWords text="Conversations that compound." />
        </h2>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-[52ch] text-[17px] text-[var(--text-muted)]">
            Every event, every message, every introduction pushes you forward. Here is
            how membership pays off in practice.
          </p>
        </Reveal>
      </div>

      {/* MOBILE: swipeable scroll-snap carousel of bordered cards */}
      <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
        {cards.map((c, i) => (
          <div
            key={c.title}
            className="flex w-[78%] shrink-0 snap-center flex-col rounded-2xl border border-[var(--border-2)] p-6"
          >
            <span className="text-[12px] font-medium tabular-nums tracking-[0.16em] text-[var(--text-faint)]">
              0{i + 1}
            </span>
            <span className="mt-4 grid h-11 w-11 place-items-center rounded-xl border border-[var(--border-2)] bg-white/5 text-white">
              {c.icon}
            </span>
            <h3 className="serif mt-5 text-[20px] font-bold leading-snug">{c.title}</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--text-muted)]">
              {c.desc}
            </p>
          </div>
        ))}
      </div>

      {/* DESKTOP: editorial rows, hairline-divided, not a uniform card grid */}
      <div className="mx-auto hidden max-w-[1000px] grid-cols-1 gap-x-16 md:grid md:grid-cols-2">
        {cards.map((c, i) => (
          <Reveal key={c.title} delay={(i % 2) * 0.08}>
            <div className="group relative flex items-start gap-5 border-t border-[var(--border)] py-8 transition-colors duration-300">
              <span
                aria-hidden
                className="absolute left-0 top-0 h-px w-0 bg-white/60 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full"
              />
              <span className="mt-1 w-6 shrink-0 text-[12px] font-medium tabular-nums tracking-[0.16em] text-[var(--text-faint)]">
                0{i + 1}
              </span>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[var(--border-2)] bg-white/5 text-white transition-colors duration-300 group-hover:border-white/40 group-hover:bg-white/10">
                {c.icon}
              </span>
              <div>
                <h3 className="serif text-[21px] font-bold leading-snug">{c.title}</h3>
                <p className="mt-2 max-w-[44ch] text-[14.5px] leading-relaxed text-[var(--text-muted)]">
                  {c.desc}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
