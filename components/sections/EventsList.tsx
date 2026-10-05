"use client";

import { Section, Kicker, Button } from "../ui/primitives";
import { Reveal, SplitWords } from "../ui/motion";
import { Calendar, ArrowUpRight } from "../ui/icons";

const WHATSAPP = "https://chat.whatsapp.com/KJfMcHDByFaCrceZFesOp9?mode=gi_t";

// Illustrative upcoming line-up, wire to a real calendar/CMS before launch.
const upcoming = [
  {
    month: "JUL",
    day: "24",
    title: "Founders' Dinner: Rīga",
    type: "Private dinner",
    place: "Old Town · 12 seats",
  },
  {
    month: "AUG",
    day: "07",
    title: "Operators Roundtable: Scaling Sales",
    type: "Roundtable",
    place: "Aston Hotel · 20 seats",
  },
  {
    month: "AUG",
    day: "21",
    title: "Summer Social & Networking",
    type: "Social",
    place: "Rooftop · Members + guests",
  },
  {
    month: "SEP",
    day: "05",
    title: "Behind the Business: Live Recording",
    type: "Podcast night",
    place: "Studio · Members only",
  },
];

export default function EventsList() {
  return (
    <Section className="py-24 sm:py-28">
      <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Reveal>
            <Kicker icon={<Calendar className="h-3.5 w-3.5" />}>What&rsquo;s next</Kicker>
          </Reveal>
          <h2 className="display mt-6 max-w-[15ch] text-[clamp(32px,4.4vw,56px)] leading-[1.05]">
            <SplitWords text="Upcoming rooms." />
          </h2>
        </div>
        <Reveal delay={0.15} className="max-w-[34ch]">
          <p className="text-[16px] text-[var(--text-muted)]">
            Seats are limited by design, small rooms, high signal. Members get first
            access to every date.
          </p>
        </Reveal>
      </div>

      <div>
        {upcoming.map((e, i) => (
          <Reveal key={e.title} delay={i * 0.06}>
            <a
              href={WHATSAPP}
              className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-x-5 border-t border-[var(--border)] py-7 transition-colors duration-500 last:border-b md:gap-x-8"
            >
              <span
                aria-hidden
                className="absolute left-0 top-0 h-px w-0 bg-white/60 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full"
              />
              <span className="flex w-14 flex-col items-center leading-none">
                <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
                  {e.month}
                </span>
                <span className="serif mt-1 text-[28px] font-bold">{e.day}</span>
              </span>
              <span>
                <span className="serif block text-[clamp(19px,2.2vw,26px)] font-bold leading-tight">
                  {e.title}
                </span>
                <span className="mt-1 block text-[13.5px] text-[var(--text-muted)]">
                  {e.type} · {e.place}
                </span>
              </span>
              <ArrowUpRight className="h-6 w-6 -translate-x-2 justify-self-end text-[var(--text-faint)] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:text-[var(--text)] group-hover:opacity-100" />
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-8 sm:flex-row">
          <p className="serif text-[clamp(19px,2.2vw,24px)] font-bold">
            Want the calendar in your pocket?
          </p>
          <Button href={WHATSAPP}>Join the Community</Button>
        </div>
      </Reveal>
    </Section>
  );
}
