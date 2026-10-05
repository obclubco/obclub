"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/* ---------------- Arrow ---------------- */
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------- Button ----------------
   Monochrome wipe-invert: a fill sweeps up from the bottom edge and the label
   flips to the opposite value. Primary (white → black), dark (outline → white).
   The arrow rides forward, is masked out, and a second arrow rides in behind it. */
type Variant = "primary" | "dark" | "ghost";

export function Button({
  children,
  href = "#",
  variant = "primary",
  arrow = true,
  className = "",
}: {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
}) {
  // nexobc button spec: pill shape, --ease-out-slow, invert-on-hover.
  const base =
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-[15px] font-medium whitespace-nowrap transition-colors duration-[600ms] ease-[var(--ease-out-slow)]";

  // shell = resting colours + the label colour it flips to on hover.
  // NOTE: the flip uses `hover:` (not `group-hover:`) because it targets the
  // element that IS `.group` — group-hover only matches DESCENDANTS.
  // fill = the wipe colour that slides up behind the label. Contrast is guaranteed:
  // primary → ink fill + white label; dark → white fill + ink label.
  const shell: Record<Variant, string> = {
    primary:
      "bg-[var(--accent-btn)] text-[var(--accent-btn-fg)] shadow-[0_16px_40px_-24px_rgba(0,0,0,0.9)] hover:text-[var(--accent-btn)]",
    dark: "bg-transparent text-[var(--text)] border border-[var(--border-2)] hover:border-white hover:text-[var(--bg)]",
    ghost: "text-[var(--text)] hover:text-[var(--accent)]",
  };
  const fill: Record<Variant, string> = {
    primary: "bg-[var(--ink)]",
    dark: "bg-white",
    ghost: "bg-transparent",
  };

  // external URLs (whatsapp, calendly, socials) open in a new tab.
  const external = /^https?:\/\//.test(href);
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <a href={href} {...ext} className={`${base} ${shell[variant]} ${className}`}>
      {/* wipe fill — translate (not scale) so it reliably covers on hover */}
      <span
        aria-hidden
        className={`absolute inset-0 z-0 translate-y-full ${fill[variant]} transition-transform duration-[600ms] ease-[var(--ease-out-slow)] group-hover:translate-y-0`}
      />
      <span className="relative z-10">{children}</span>
      {arrow && (
        <span className="relative z-10 inline-block h-4 w-4 overflow-hidden">
          <Arrow className="absolute inset-0 transition-transform duration-[600ms] ease-[var(--ease-out-slow)] group-hover:translate-x-5" />
          <Arrow className="absolute inset-0 -translate-x-5 transition-transform duration-[600ms] ease-[var(--ease-out-slow)] group-hover:translate-x-0" />
        </span>
      )}
    </a>
  );
}

/* ---------------- Kicker (section eyebrow tag) ---------------- */
export function Kicker({
  children,
  icon,
}: {
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2.5 text-[12px] font-medium uppercase tracking-[0.24em] text-[var(--text-faint)]">
      <span className="h-px w-6 bg-[var(--border-2)]" />
      {icon && <span className="text-[var(--text-muted)]">{icon}</span>}
      {children}
    </span>
  );
}

/* ---------------- Badge (hero "New" pill) ---------------- */
export function NewBadge({
  label,
  text,
  href = "#",
}: {
  label: string;
  text: string;
  href?: string;
}) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-2.5 rounded-full border border-[var(--border-2)] bg-[var(--surface)]/70 py-1.5 pl-1.5 pr-3 text-[14px] backdrop-blur"
    >
      <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--bg)]">
        {label}
      </span>
      <span className="text-[var(--text-muted)]">{text}</span>
      <Arrow className="text-[var(--text-muted)] transition-transform duration-300 group-hover:translate-x-0.5" />
    </a>
  );
}

/* ---------------- Star row ---------------- */
export function Stars({ size = 14 }: { size?: number }) {
  return (
    <span className="inline-flex gap-0.5 text-[var(--accent)]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

/* ---------------- Section wrapper ---------------- */
export function Section({
  id,
  children,
  className = "",
  ...rest
}: {
  id?: string;
  children: ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      id={id}
      className={`relative mx-auto w-full max-w-[1200px] px-5 sm:px-6 ${className}`}
      {...rest}
    >
      {children}
    </section>
  );
}

/* ---------------- Marquee ---------------- */
export function Marquee({
  children,
  speed = 32,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  return (
    <div className={`group relative overflow-hidden ${className}`}>
      <div
        className="flex w-max"
        style={{
          animation: `marquee ${speed}s linear infinite`,
        }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce){ .group > div { animation: none !important; } }
      `}</style>
    </div>
  );
}

/* ---------------- CountUp ---------------- */
export function CountUp({
  to,
  suffix = "",
  className = "",
}: {
  to: number;
  suffix?: string;
  className?: string;
}) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <Counter to={to} suffix={suffix} />
    </motion.span>
  );
}

import { useEffect, useRef, useState } from "react";
function Counter({ to, suffix }: { to: number; suffix: string }) {
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? to : 0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    if (reduce) {
      setVal(to);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const dur = 1400;
          const t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min((t - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(eased * to));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, reduce]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}
