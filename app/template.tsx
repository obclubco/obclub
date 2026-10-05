"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// true until the first client mount finishes: the initial load paints the SSR
// page directly (no curtain, no fade) so content is visible without waiting on JS.
let firstLoad = true;

const EASE = [0.76, 0, 0.24, 1] as const; // strong in-out for a "case" open

/**
 * Page transition — plays on client route changes (skipped on the initial load). Two panels
 * (a closed "case") cover the viewport with the OBC wordmark centred, hold a
 * beat, then split apart at DIFFERENT speeds to reveal the page beneath. The
 * layout (Nav / Footer / starfield) lives above this template, so only the page
 * body is wrapped and re-revealed on navigation.
 */
function PageCurtain() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[999] overflow-hidden">
      {/* top half of the case */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 border-b border-white/15 bg-black"
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ delay: 0.25, duration: 0.55, ease: EASE }}
      />
      {/* bottom half — a touch slower, so the two leaves part at different speeds */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 border-t border-white/15 bg-black"
        initial={{ y: 0 }}
        animate={{ y: "100%" }}
        transition={{ delay: 0.25, duration: 0.7, ease: EASE }}
      />
      {/* centred wordmark — its own speed for the layered feel */}
      <motion.div
        className="absolute inset-0 grid place-items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.7, times: [0, 0.22, 0.5, 0.78], ease: "easeInOut" }}
      >
        <motion.span
          className="serif select-none text-[clamp(56px,12vw,140px)] font-bold tracking-[-0.03em] text-[var(--text)]"
          initial={{ y: 24, scale: 0.96, letterSpacing: "0.06em" }}
          animate={{ y: [-24, 0, 0, -40], scale: [0.96, 1, 1, 1.04] }}
          transition={{ duration: 0.7, times: [0, 0.22, 0.55, 1], ease: EASE }}
        >
          OBC
        </motion.span>
      </motion.div>
    </div>
  );
}

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const [initial] = useState(() => firstLoad);
  useEffect(() => {
    firstLoad = false;
  }, []);
  const still = reduce || initial;
  return (
    <>
      {!still && <PageCurtain />}
      <motion.div
        initial={still ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: still ? 0 : 0.3, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
