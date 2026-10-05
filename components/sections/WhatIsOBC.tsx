"use client";

import { Section, Kicker, Button } from "../ui/primitives";
import { Reveal, SplitWords } from "../ui/motion";
import YouTube from "../ui/YouTube";

const WHATSAPP = "https://chat.whatsapp.com/KJfMcHDByFaCrceZFesOp9?mode=gi_t";

export default function WhatIsOBC() {
  return (
    <Section data-wf="/#about" className="py-24 sm:py-28">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Reveal>
            <Kicker>The Network</Kicker>
          </Reveal>
          <h2 className="display mt-6 text-[clamp(34px,4.6vw,60px)] leading-[1.04]">
            <SplitWords text="What is OB Club?" />
          </h2>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[46ch] text-[17px] leading-relaxed text-[var(--text-muted)]">
              OB Club is an exclusive network for online entrepreneurs, builders, and
              ambitious operators. We bring together founders through curated events, a
              thriving community, and meaningful collaboration, creating an ecosystem
              where businesses grow and connections turn into opportunities.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8">
              <Button href={WHATSAPP} className="hover:opacity-90">
                Join Free Community
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal y={30}>
          <YouTube id="KJf18ZYYV_M" title="What is OBC?" />
        </Reveal>
      </div>
    </Section>
  );
}
