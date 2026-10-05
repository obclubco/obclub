"use client";

import { Section, Button } from "../ui/primitives";
import { Reveal, SplitWords } from "../ui/motion";
import { Check } from "../ui/icons";
import Starfield from "../ui/Starfield";
import EmailCapture from "./EmailCapture";

const WHATSAPP = "https://chat.whatsapp.com/KJfMcHDByFaCrceZFesOp9?mode=gi_t";
const CALENDLY = "https://calendly.com/obclubco/30min";
const chips = ["Free to join", "Real people, real rooms", "Introductions that convert"];

export default function CTA() {
  return (
    <Section data-wf="/#cta" className="py-16">
      <div className="bg-halo bracket relative overflow-hidden rounded-3xl border border-[var(--border-2)] px-6 py-24 text-center">
        <div className="grid-lines grid-lines--strong" />
        <Starfield density={0.00016} />
        <Reveal>
          <p className="kicker">Ready when you are</p>
        </Reveal>
        <h2 className="display mx-auto mt-6 max-w-[16ch] text-[clamp(34px,5vw,68px)] leading-[1.03]">
          <SplitWords text="Ready to Level Up?" />
        </h2>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-[48ch] text-[17px] text-[var(--text-muted)]">
            Join the free community today, or reach out about partnering with OB Club.
            The next introduction could be the one that changes everything.
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button href={WHATSAPP}>Join Free Community</Button>
            <Button href={CALENDLY} variant="dark">
              Become a Partner
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mx-auto mt-9 flex max-w-[440px] flex-col items-center gap-3">
            <p className="text-[13px] text-[var(--text-faint)]">
              Not ready to join the group? Get one email when the next event or episode
              drops.
            </p>
            <EmailCapture
              topic="newsletter"
              cta="Keep me posted"
              successTitle="You're on the list."
              successNote="No spam. Just the next room."
            />
          </div>
        </Reveal>
        <Reveal delay={0.35}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {chips.map((c) => (
              <span
                key={c}
                className="flex items-center gap-2 text-[14px] text-[var(--text-muted)]"
              >
                <Check className="h-4 w-4 text-white" strokeWidth={2.2} />
                {c}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
