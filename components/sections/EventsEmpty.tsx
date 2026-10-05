"use client";

import { Section, Kicker } from "../ui/primitives";
import { Reveal, SplitWords } from "../ui/motion";
import { Calendar } from "../ui/icons";
import EmailCapture from "./EmailCapture";

export default function EventsEmpty({ members, eventsHosted }: { members: string; eventsHosted: string }) {
  return (
    <Section className="py-24 sm:py-32">
      <div className="mx-auto max-w-[760px] text-center">
        <Reveal className="flex justify-center">
          <Kicker icon={<Calendar className="h-3.5 w-3.5" />}>What&rsquo;s next</Kicker>
        </Reveal>
        <h2 className="display mx-auto mt-6 max-w-[16ch] text-[clamp(30px,4.4vw,52px)] leading-[1.06]">
          <SplitWords text="No upcoming events just yet." />
        </h2>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-[48ch] text-[17px] leading-relaxed text-[var(--text-muted)]">
            We&rsquo;re lining up the next rooms. Drop your email and you&rsquo;ll be the
            first to hear when a date goes live, before it lands anywhere else.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-5 text-[12px] uppercase tracking-[0.18em] text-[var(--text-faint)]">
            {members} members · {eventsHosted} events hosted
          </p>
        </Reveal>
        <Reveal delay={0.25} className="mt-9 flex justify-center">
          <EmailCapture
            topic="events"
            cta="Notify me"
            successTitle="You're first in line."
            successNote="We'll email you the moment the next event is announced."
          />
        </Reveal>
      </div>
    </Section>
  );
}
