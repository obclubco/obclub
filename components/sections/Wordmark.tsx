"use client";

import { motion } from "framer-motion";

export default function Wordmark() {
  return (
    <div
      data-wf="/#wordmark"
      className="relative flex justify-center overflow-x-clip px-4 pb-2"
      aria-hidden
    >
      <motion.span
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="display block select-none whitespace-nowrap bg-gradient-to-b from-white via-white/85 to-transparent bg-clip-text pb-[0.12em] text-center text-[clamp(52px,15.5vw,230px)] font-bold leading-[1.06] tracking-[-0.03em] text-transparent"
      >
        OB&nbsp;CLUB
      </motion.span>
    </div>
  );
}
