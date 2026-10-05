"use client";

import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Fragment, useRef, type CSSProperties, type ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * ParallaxImage, signature moment. As the element scrolls through the
 * viewport the inner layer drifts up and scales slightly, so the image reads
 * like it is breathing behind its frame. Frame stays fixed (overflow-hidden on
 * the parent). Fully disabled under prefers-reduced-motion.
 */
export function ParallaxImage({
  children,
  className,
  amount = 60,
  scale = 1.12,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  const s = useTransform(scrollYProgress, [0, 0.5, 1], [scale, 1, scale]);
  return (
    <div ref={ref} className={className}>
      <motion.div
        style={reduce ? undefined : { y, scale: s }}
        className="h-full w-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  blur = false,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  blur?: boolean;
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-80px" });
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, filter: blur ? "blur(10px)" : "blur(0px)" }}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y, filter: blur ? "blur(10px)" : "blur(0px)" }
      }
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  delayStep = 0.08,
}: {
  children: ReactNode[];
  className?: string;
  delayStep?: number;
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Reveal key={i} delay={i * delayStep}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}

/** Word-by-word reveal for headlines. */
export function SplitWords({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const words = text.split(" ");
  if (reduce) return <span className={className}>{text}</span>;
  return (
    <span ref={ref} className={className} style={{ display: "inline" }}>
      {words.map((w, i) => (
        <Fragment key={i}>
        {i > 0 && " "}
        <span style={{ display: "inline-block", overflow: "hidden" }}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ opacity: 0, y: "0.9em" }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: "0.9em" }}
            transition={{ duration: 0.7, ease: EASE, delay: delay + i * 0.05 }}
          >
            {w}
          </motion.span>
        </span>
        </Fragment>
      ))}
    </span>
  );
}

/**
 * Above-the-fold entrance. CSS-only (see .rise in globals.css): the element is
 * painted at full opacity with the server HTML and slides into place, so it
 * never waits on hydration. Use instead of Reveal for hero content.
 */
export function Rise({
  children,
  delay = 0,
  y = 24,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <div
      className={`rise ${className}`}
      style={{ "--d": `${delay}s`, "--rise": `${y}px` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/** Word-by-word entrance for an above-the-fold headline, CSS-only like Rise. */
export function RiseWords({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}>
            <span
              className="rise"
              style={
                { display: "inline-block", "--d": `${delay + i * 0.05}s`, "--rise": "0.9em" } as CSSProperties
              }
            >
              {w}
            </span>
          </span>
        </Fragment>
      ))}
    </>
  );
}
