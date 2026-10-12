"use client";

import { useEffect, useState, type ComponentType, type SVGProps } from "react";
import { Section, Kicker, Button } from "../ui/primitives";
import { Reveal } from "../ui/motion";
import { Calendar, Clock, Pin, CheckList } from "../ui/icons";
import { APPLY_URL, fmtDay, type OBEvent } from "../../lib/events";

// Status from the visitor's own date ("Upcoming · In 3 weeks"). Worked out after
// mount, so the static HTML never carries a countdown frozen at build time.
function status(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const now = new Date();
  const days = Math.round(
    (Date.UTC(y, m - 1, d) - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) / 86_400_000,
  );
  if (days < 0) return "Past event";
  if (days === 0) return "Happening today";
  if (days === 1) return "Upcoming · Tomorrow";
  if (days < 7) return `Upcoming · In ${days} days`;
  if (days < 60) {
    const w = Math.round(days / 7);
    return `Upcoming · In ${w} week${w > 1 ? "s" : ""}`;
  }
  return `Upcoming · In ${Math.round(days / 30)} months`;
}

type Detail = { icon: ComponentType<SVGProps<SVGSVGElement>>; label: string; value: string; sub?: string };

/** The next event, shown large: title and apply button on top, details in a strip below. */
export default function EventFeature({ event }: { event: OBEvent }) {
  const [label, setLabel] = useState("Upcoming");
  useEffect(() => setLabel(status(event.date)), [event.date]);

  const d = fmtDay(event.date);
  const details: Detail[] = [
    { icon: Calendar, label: "Date", value: d.weekday, sub: d.long },
    ...(event.time ? [{ icon: Clock, label: "Time", value: event.time }] : []),
    { icon: Pin, label: "Where", value: event.place },
    { icon: CheckList, label: "Entry", value: "By application" },
  ];

  return (
    <Section className="py-24 sm:py-28">
      <Reveal className="mb-10 flex justify-center">
        <Kicker icon={<Calendar className="h-3.5 w-3.5" />}>What&rsquo;s next</Kicker>
      </Reveal>

      <Reveal delay={0.1}>
        <article className="relative overflow-hidden rounded-[28px] border border-[var(--border-2)] bg-black/70 backdrop-blur-md">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-white/[0.05] blur-3xl"
          />

          <div className="relative flex flex-col gap-8 p-6 sm:p-10 lg:flex-row lg:items-end lg:justify-between lg:p-12">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-[var(--border-2)] bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                {label}
              </span>
              <h2 className="display mt-7 text-[clamp(40px,12vw,112px)] leading-[0.92]">{event.title}</h2>
              <p className="mt-6 max-w-[44ch] text-[16px] leading-relaxed text-[var(--text-muted)] sm:text-[17px]">
                Places are by application. Apply through OBC Networking to get on the guest list.
              </p>
            </div>
            <Button href={event.url || APPLY_URL} className="self-start lg:self-auto">
              Apply to attend
            </Button>
          </div>

          <div className="relative overflow-hidden border-t border-[var(--border)]">
            <dl
              className={`-mb-px -mr-px grid grid-cols-2 ${
                details.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
              }`}
            >
              {details.map(({ icon: Icon, label: name, value, sub }) => (
                <div
                  key={name}
                  className="border-b border-r border-[var(--border)] p-5 last:odd:col-span-2 sm:p-8 lg:last:odd:col-span-1"
                >
                  <dt className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--text-faint)]">
                    <Icon className="h-4 w-4 text-[var(--text-muted)]" />
                    {name}
                  </dt>
                  <dd className="serif mt-4 text-[clamp(18px,2vw,24px)] font-bold leading-tight">{value}</dd>
                  {sub && <dd className="mt-1 text-[14px] text-[var(--text-muted)]">{sub}</dd>}
                </div>
              ))}
            </dl>
          </div>
        </article>
      </Reveal>
    </Section>
  );
}
