"use client";

import { Section, Kicker } from "../ui/primitives";
import { Reveal, SplitWords } from "../ui/motion";
import { Chat, Handshake, ArrowUpRight } from "../ui/icons";
import ContactForm from "./ContactForm";

const WHATSAPP = "https://chat.whatsapp.com/KJfMcHDByFaCrceZFesOp9?mode=gi_t";
const CALENDLY = "https://calendly.com/obclubco/30min";
const EMAIL = "hello@obclub.co";

const channels = [
  {
    icon: <Chat className="h-5 w-5" />,
    label: "Join the community",
    value: "Free WhatsApp room",
    href: WHATSAPP,
  },
  {
    icon: <Handshake className="h-5 w-5" />,
    label: "Partnerships",
    value: "Book a 30-min intro call",
    href: CALENDLY,
  },
  {
    icon: <ArrowUpRight className="h-5 w-5" />,
    label: "General enquiries",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
  },
];

export default function ContactBlock() {
  return (
    <Section className="py-20 sm:py-24">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        {/* left — intro + quick channels */}
        <div>
          <Reveal>
            <Kicker>Get in touch</Kicker>
          </Reveal>
          <h2 className="display mt-6 max-w-[14ch] text-[clamp(34px,4.6vw,60px)] leading-[1.04]">
            <SplitWords text="Let's find you a seat." />
          </h2>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[42ch] text-[17px] leading-relaxed text-[var(--text-muted)]">
              Fill in the form, or reach us on any channel below. Whichever you pick, a
              real person reads it.
            </p>
          </Reveal>

          <div className="mt-8">
            {channels.map((c, i) => (
              <Reveal key={c.label} delay={0.15 + i * 0.07}>
                <a
                  href={c.href}
                  {...(/^https?:\/\//.test(c.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group relative flex items-center gap-4 border-t border-[var(--border)] py-5 transition-colors duration-500 last:border-b"
                >
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-px w-0 bg-white/60 transition-all duration-700 ease-[var(--ease-entrance)] group-hover:w-full"
                  />
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[var(--border-2)] text-white transition-colors duration-500 group-hover:border-white/40">
                    {c.icon}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[15px] font-medium">{c.label}</span>
                    <span className="block text-[13.5px] text-[var(--text-muted)]">
                      {c.value}
                    </span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 -translate-x-2 text-[var(--text-faint)] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:text-[var(--text)] group-hover:opacity-100" />
                </a>
              </Reveal>
            ))}
          </div>
        </div>

        {/* right — the form */}
        <ContactForm />
      </div>
    </Section>
  );
}
