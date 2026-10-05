"use client";

import { useState } from "react";
import { Section, Kicker } from "../ui/primitives";
import { Reveal, SplitWords } from "../ui/motion";
import { Plus } from "../ui/icons";
import { AnimatePresence, motion } from "framer-motion";
import type { Faq } from "../../lib/faqs";

export default function FAQ({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq" data-wf="/#faq" className="py-24 sm:py-28">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Reveal>
            <Kicker>FAQ</Kicker>
          </Reveal>
          <h2 className="display mt-6 max-w-[12ch] text-[clamp(32px,4.4vw,56px)] leading-[1.05]">
            <SplitWords text="Questions, answered." />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-[40ch] text-[16px] text-[var(--text-muted)]">
              Still curious? The community is a message away, always happy to help.
            </p>
          </Reveal>
        </div>

        {/* de-carded, hairline-divided accordion rows, no surface fill */}
        <div>
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05}>
              <div className="border-t border-[var(--border)] last:border-b">
                <button
                  data-hover
                  onClick={() => setOpen(open === i ? null : i)}
                  className="group flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span
                    className={`serif text-[18px] font-bold transition-colors duration-300 ${
                      open === i ? "text-[var(--text)]" : "text-[var(--text-muted)] group-hover:text-[var(--text)]"
                    }`}
                  >
                    {f.q}
                  </span>
                  <Plus
                    className={`h-4 w-4 shrink-0 text-white transition-transform duration-300 ${
                      open === i ? "rotate-45" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="max-w-[62ch] pb-6 text-[15px] leading-relaxed text-[var(--text-muted)]">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
