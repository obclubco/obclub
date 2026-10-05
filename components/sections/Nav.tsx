"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Button, Arrow } from "../ui/primitives";
import { Menu, Close } from "../ui/icons";

const WHATSAPP = "https://chat.whatsapp.com/KJfMcHDByFaCrceZFesOp9?mode=gi_t";

const links: [string, string][] = [
  ["Home", "/"],
  ["Events", "/events"],
  ["Podcast", "/podcast"],
  ["Partners", "/partners"],
  ["Contact", "/contact"],
];

const EASE = [0.22, 1, 0.36, 1] as const;

// slow, staggered reveal for the pill's contents (logo → links → CTA).
const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: EASE, delay },
});

// mobile menu: items write in one after another as the pill expands
const menuList = {
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.14 } },
  hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};
const menuItem = {
  hidden: { opacity: 0, x: -14 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
};

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  // IntersectionObserver sentinel drives the compact/expanded morph.
  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.setAttribute("data-nav-sentinel", "");
    sentinel.style.cssText =
      "position:absolute;top:24px;left:0;width:1px;height:1px;pointer-events:none;";
    document.body.prepend(sentinel);
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(sentinel);
    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, []);

  const solid = scrolled || open;
  const maxWidth = open ? 1140 : !mounted ? 560 : scrolled ? 920 : 1140;

  return (
    <header
      data-wf="/#nav"
      className="fixed inset-x-0 top-0 z-50 mx-auto flex w-full max-w-[1140px] justify-center px-4 pt-4"
    >
      {/* one pill that both scroll-morphs AND expands to hold the mobile menu */}
      <motion.nav
        initial={{ y: -18, opacity: 1, maxWidth: 560 }}
        animate={{
          y: 0,
          opacity: 1,
          maxWidth,
          paddingTop: scrolled && !open ? 8 : 12,
          paddingBottom: scrolled && !open ? 8 : 12,
          borderRadius: open ? 22 : scrolled ? 18 : 12,
          backgroundColor: solid ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.5)",
          borderColor: solid ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.10)",
          boxShadow: solid
            ? "0 18px 50px -28px rgba(0,0,0,0.9)"
            : "0 0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.6, ease: EASE }}
        className={`flex w-full flex-col overflow-hidden border px-4 ${solid ? "" : "backdrop-blur-md"}`}
      >
        {/* top row — always visible */}
        <div className="flex w-full items-center justify-between gap-4">
          <motion.div {...reveal(0.4)}>
            <Link href="/" className="flex items-center" aria-label="OB Club home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/obc/logo.webp" alt="OB Club" className="h-11 w-auto" />
            </Link>
          </motion.div>

          <ul className="hidden items-center gap-6 lg:flex">
            {links.map(([label, href], i) => (
              <motion.li key={label} {...reveal(0.5 + i * 0.08)}>
                <Link
                  href={href}
                  className="group relative whitespace-nowrap text-[13.5px] text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                >
                  {label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
                </Link>
              </motion.li>
            ))}
          </ul>

          <motion.div {...reveal(0.5 + links.length * 0.08)} className="hidden lg:block">
            <Button href={WHATSAPP}>Join Community</Button>
          </motion.div>

          {/* hamburger → morphs to X; toggles the in-pill expansion */}
          <button
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--border-2)] outline-none transition-colors hover:border-white/50 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className="relative grid h-5 w-5 place-items-center">
              <motion.span
                animate={{ opacity: open ? 0 : 1, rotate: open ? -90 : 0, scale: open ? 0.6 : 1 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="absolute"
              >
                <Menu className="h-5 w-5" />
              </motion.span>
              <motion.span
                animate={{ opacity: open ? 1 : 0, rotate: open ? 0 : 90, scale: open ? 1 : 0.6 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="absolute"
              >
                <Close className="h-5 w-5" />
              </motion.span>
            </span>
          </button>
        </div>

        {/* mobile menu — expands INSIDE the pill; items write in, reverses on close */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="mobilemenu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="w-full overflow-hidden lg:hidden"
            >
              <motion.ul
                variants={menuList}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="flex flex-col pt-2"
              >
                {links.map(([label, href]) => (
                  <motion.li key={label} variants={menuItem}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className="group flex items-center justify-between border-b border-[var(--border)] py-3.5 text-[16px] text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                    >
                      {label}
                      <Arrow className="-translate-x-1 opacity-60 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
              <motion.div variants={menuItem} initial="hidden" animate="show" className="py-4">
                <Button href={WHATSAPP} className="w-full">
                  Join Community
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
