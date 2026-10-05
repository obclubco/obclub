"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8.5l3 3 6.5-7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Select({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-3 rounded-[10px] border bg-transparent px-4 py-3 text-left text-[15px] text-[var(--text)] outline-none transition-colors duration-300 ${
          open ? "border-white/60" : "border-[var(--border-2)] hover:border-white/40"
        }`}
      >
        <span>{value}</span>
        <span className="text-[var(--text-faint)]">
          <Chevron open={open} />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.15 } }}
            transition={{ duration: 0.28, ease: EASE }}
            className="absolute left-0 right-0 z-30 mt-2 origin-top overflow-hidden rounded-[12px] border border-[var(--border-2)] bg-[var(--surface)] p-1.5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          >
            {options.map((opt) => {
              const active = opt === value;
              return (
                <li key={opt} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-[8px] px-3 py-2.5 text-left text-[14.5px] transition-colors duration-200 ${
                      active
                        ? "bg-white/10 text-[var(--text)]"
                        : "text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text)]"
                    }`}
                  >
                    {opt}
                    {active && (
                      <span className="text-[var(--text)]">
                        <Check />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
