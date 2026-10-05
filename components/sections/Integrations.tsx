"use client";

import { Section, Kicker, Button } from "../ui/primitives";
import { Reveal, SplitWords } from "../ui/motion";
import { Handshake } from "../ui/icons";
import Starfield from "../ui/Starfield";
import type { Partner } from "../../lib/partners";

const CALENDLY = "https://calendly.com/obclubco/30min";


const SM_COLS: Record<number, string> = { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4" };

// hairline dividers between cells: 2 columns on mobile, `cols` from sm up
function cellBorders(i: number, n: number, cols: number): string {
  const lastRowStart = (c: number) => n - (n % c || c);
  return [
    i % 2 ? "border-l" : "border-l-0",
    i < lastRowStart(2) ? "border-b" : "border-b-0",
    i % cols ? "sm:border-l" : "sm:border-l-0",
    i < lastRowStart(cols) ? "sm:border-b" : "sm:border-b-0",
  ].join(" ");
}

export default function Integrations({ partners }: { partners: Partner[] }) {
  const cols = Math.min(Math.max(partners.length, 1), 4);
  return (
    <Section id="partners" data-wf="/#partners" className="py-24 sm:py-28">
      <div className="mb-16 text-center">
        <Reveal className="flex justify-center">
          <Kicker icon={<Handshake className="h-3.5 w-3.5" />}>Our Partners</Kicker>
        </Reveal>
        <h2 className="display mx-auto mt-6 max-w-[18ch] text-[clamp(32px,4.4vw,56px)] leading-[1.05]">
          <SplitWords text="Backed by brands that build." />
        </h2>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-[50ch] text-[17px] text-[var(--text-muted)]">
            OB Club partners with companies that share our standard. Together we open
            doors members could not open alone.
          </p>
        </Reveal>
      </div>

      {/* logos: 2 columns on mobile, up to 4 from sm, hairline-divided cells */}
      <div className={`grid grid-cols-2 border-t border-[var(--border)] ${SM_COLS[cols]}`}>
        {partners.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.1}>
            <div className={`group flex h-full flex-col items-center justify-center gap-3 border-[var(--border)] px-3 py-10 text-center transition-colors duration-500 sm:gap-5 sm:px-6 sm:py-14 ${cellBorders(i, partners.length, cols)}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.name}
                className="h-8 w-auto max-w-[110px] object-contain opacity-70 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0 sm:h-12 sm:max-w-[160px]"
              />
              <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-faint)] sm:text-[12px] sm:tracking-[0.18em]">
                {p.note}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* highlighted become-a-partner CTA */}
      <Reveal delay={0.2}>
        <div className="bg-halo bracket relative mt-10 flex flex-col items-center justify-between gap-5 overflow-hidden rounded-3xl border border-[var(--border-2)] px-7 py-10 text-center sm:flex-row sm:text-left">
          <div className="grid-lines grid-lines--strong" />
          <Starfield density={0.00016} />
          <div className="relative">
            <p className="kicker justify-center sm:justify-start">Partnerships</p>
            <p className="serif mt-2 text-[clamp(21px,2.6vw,28px)] font-bold">
              Want to partner with OB Club?
            </p>
          </div>
          <div className="relative">
            <Button href={CALENDLY}>Become a Partner</Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
