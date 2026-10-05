"use client";

import { useMemo, useState } from "react";
import { Section, Kicker } from "../ui/primitives";
import { Reveal, SplitWords } from "../ui/motion";
import { Calendar as CalIcon } from "../ui/icons";
import { fmtDay, type OBEvent } from "../../lib/events";

const WHATSAPP = "https://chat.whatsapp.com/KJfMcHDByFaCrceZFesOp9?mode=gi_t";

const DOW = ["M", "T", "W", "T", "F", "S", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Monday-first weekday index for the 1st + day count for a month
function monthGrid(year: number, month: number) {
  const first = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const lead = (first + 6) % 7; // shift so Monday=0
  const days = new Date(year, month, 0).getDate();
  return { lead, days };
}

function Chevron({ dir }: { dir: "l" | "r" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d={dir === "l" ? "M10 4l-4 4 4 4" : "M6 4l4 4-4 4"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function EventsCalendar({ events }: { events: OBEvent[] }) {
  // open on the month of the next event (events arrive sorted, soonest first)
  const [view, setView] = useState(() => {
    const [y, m] = (events[0]?.date || new Date().toISOString()).split("-").map(Number);
    return { y, m };
  });
  const [active, setActive] = useState<string | null>(null);

  const byDay = useMemo(() => {
    const map = new Map<string, OBEvent>();
    for (const e of events) if (!map.has(e.date)) map.set(e.date, e);
    return map;
  }, [events]);

  const shift = (delta: number) =>
    setView(({ y, m }) => {
      const idx = (y * 12 + (m - 1) + delta);
      return { y: Math.floor(idx / 12), m: (idx % 12) + 1 };
    });

  const { lead, days } = monthGrid(view.y, view.m);
  const cells: (number | null)[] = [
    ...Array(lead).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
  const monthHasEvents = events.some((e) => {
    const [ey, em] = e.date.split("-").map(Number);
    return ey === view.y && em === view.m;
  });

  return (
    <Section className="py-24 sm:py-28">
      <div className="mb-14 text-center">
        <Reveal className="flex justify-center">
          <Kicker icon={<CalIcon className="h-3.5 w-3.5" />}>The calendar</Kicker>
        </Reveal>
        <h2 className="display mx-auto mt-6 max-w-[18ch] text-[clamp(32px,4.4vw,56px)] leading-[1.05]">
          <SplitWords text="When the rooms happen." />
        </h2>
      </div>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,420px)_1fr]">
        {/* month calendar with a switcher */}
        <Reveal>
          <div className="rounded-2xl border border-[var(--border-2)] p-6">
            <div className="mb-5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => shift(-1)}
                aria-label="Previous month"
                className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border-2)] text-[var(--text-muted)] outline-none transition-colors hover:border-white/50 hover:text-[var(--text)]"
              >
                <Chevron dir="l" />
              </button>
              <div className="text-center">
                <div className="serif text-[19px] font-bold">
                  {MONTHS[view.m - 1]} {view.y}
                </div>
                {!monthHasEvents && (
                  <div className="mt-0.5 text-[11px] text-[var(--text-faint)]">
                    No events, browse ahead
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => shift(1)}
                aria-label="Next month"
                className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border-2)] text-[var(--text-muted)] outline-none transition-colors hover:border-white/50 hover:text-[var(--text)]"
              >
                <Chevron dir="r" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {DOW.map((d, i) => (
                <div
                  key={i}
                  className="py-1 text-[11px] font-medium uppercase tracking-wide text-[var(--text-faint)]"
                >
                  {d}
                </div>
              ))}
              {cells.map((day, i) => {
                if (day === null) return <div key={`e${i}`} />;
                const iso = `${view.y}-${String(view.m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const ev = byDay.get(iso);
                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={!ev}
                    onClick={() => ev && setActive(active === iso ? null : iso)}
                    className={`aspect-square rounded-lg text-[13px] transition-all duration-300 ${
                      ev
                        ? active === iso
                          ? "bg-white font-semibold text-[var(--bg)]"
                          : "border border-white/40 bg-white/5 font-semibold text-[var(--text)] hover:border-white/70 hover:bg-white/10"
                        : "text-[var(--text-faint)]"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* upcoming events list — click jumps the calendar to that month + selects */}
        <Reveal delay={0.1}>
          <div className="border-t border-[var(--border)]">
            {events.map((e, i) => {
              const d = fmtDay(e.date);
              const [ey, em] = e.date.split("-").map(Number);
              const isActive = active === e.date;
              return (
                <div
                  key={`${e.date}-${i}`}
                  className={`flex items-center gap-4 border-b border-[var(--border)] transition-colors duration-300 ${
                    isActive ? "bg-white/[0.03]" : ""
                  }`}
                >
                <button
                  type="button"
                  onClick={() => {
                    setView({ y: ey, m: em });
                    setActive(isActive ? null : e.date);
                  }}
                  className="group flex min-w-0 flex-1 items-center gap-5 py-5 text-left"
                >
                  <span className="flex w-14 shrink-0 flex-col items-center leading-none">
                    <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-faint)]">
                      {d.month}
                    </span>
                    <span className="serif mt-1 text-[26px] font-bold">{d.day}</span>
                  </span>
                  <span className="flex-1">
                    <span className="serif block text-[clamp(17px,2vw,22px)] font-bold leading-tight">
                      {e.title}
                    </span>
                    <span className="mt-0.5 block text-[13px] text-[var(--text-muted)]">
                      {[e.time, e.type, e.place].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                </button>
                <a
                  href={e.url || WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] shrink-0 items-center rounded-full border border-[var(--border-2)] px-4 text-[13px] text-[var(--text-muted)] transition-colors hover:border-white/60 hover:text-[var(--text)]"
                >
                  Reserve
                </a>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
