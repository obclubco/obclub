"use client";

import { Button, Marquee, Section } from "../ui/primitives";
import { Reveal, Rise, RiseWords, ParallaxImage } from "../ui/motion";
import type { Partner } from "../../lib/partners";

const WHATSAPP = "https://chat.whatsapp.com/KJfMcHDByFaCrceZFesOp9?mode=gi_t";


export default function Hero({ partners }: { partners: Partner[] }) {
  return (
    <div id="top" className="bg-halo relative overflow-hidden pt-36 sm:pt-44">
      <div className="grid-lines" />

      <Section data-wf="/#hero" className="text-center">
        <Rise>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-2)] bg-[var(--surface)]/60 px-4 py-1.5 text-[12px] uppercase tracking-[0.2em] text-[var(--text-muted)] backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            A private ecosystem for builders
          </span>
        </Rise>

        <h1 className="display display-tight mx-auto mt-8 max-w-[16ch] text-[clamp(34px,5vw,64px)]">
          <RiseWords text="Where Entrepreneurs Meet, Network, and Build Real Business." />
        </h1>

        <Rise delay={0.15}>
          <p className="mx-auto mt-7 max-w-[56ch] text-[18px] leading-relaxed text-[var(--text-muted)]">
            A private ecosystem for builders, founders, and ambitious operators who want
            to connect and create lasting partnerships.
          </p>
        </Rise>

        <Rise delay={0.25}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button href={WHATSAPP}>Join Our Free Community</Button>
            <Button href="/events" variant="dark">
              View Events
            </Button>
          </div>
        </Rise>

        <Rise delay={0.3}>
          <p className="mx-auto mt-4 max-w-[44ch] text-[13px] text-[var(--text-faint)]">
            Free WhatsApp group. Introduce yourself, meet members, and get invited to
            events. No pitch, no spam.
          </p>
        </Rise>

        <Rise delay={0.35}>
          <p className="kicker mt-16">Our Partners</p>
        </Rise>
      </Section>

      <Rise delay={0.4} className="mt-6">
        <Marquee speed={26} className="mx-auto max-w-[760px] [mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent)]">
          {partners.concat(partners).map(({ name, src }, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={name + i}
              src={src}
              alt={name}
              className="mx-10 h-8 w-auto opacity-55 grayscale transition-opacity hover:opacity-90"
            />
          ))}
        </Marquee>
      </Rise>

      {/* Hero visual, a real OB Club networking dinner */}
      <Section className="mt-16 pb-6">
        <Reveal y={40}>
          <div className="bracket relative overflow-hidden rounded-2xl border border-[var(--border-2)] bg-[var(--surface)]">
            <ParallaxImage className="h-[440px] sm:h-[560px] lg:h-[620px]" amount={50} scale={1.14}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/obc/event-1.webp"
                alt="OB Club members at a private networking dinner"
                className="h-full w-full object-cover"
              />
            </ParallaxImage>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/10" />
            <div className="absolute bottom-5 left-6 right-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-white/70">
                  Riga · Private Dinner
                </p>
                <p className="serif mt-1 text-[22px] font-bold text-white">Real rooms. Real operators.</p>
              </div>
              <span className="rounded-full border border-white/25 bg-black px-3 py-1 text-[12px] text-white backdrop-blur">
                Members only
              </span>
            </div>
          </div>
        </Reveal>
      </Section>
    </div>
  );
}
