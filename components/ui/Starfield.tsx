"use client";

import { useEffect, useRef } from "react";

/**
 * Canvas particle field, faint white dots that slowly float/drift around and
 * twinkle, matching the reference's animated starfield. Fills its positioned
 * parent. Honors prefers-reduced-motion (renders one static frame). The loop only
 * runs while the canvas is on screen, the tab is visible and `paused` is false;
 * it is capped at ~30fps and draws stars in a few alpha-bucketed batches.
 */
// star alpha in 8 steps across the original 0.25..0.80 twinkle range
const FILLS = Array.from(
  { length: 8 },
  (_, b) => `rgba(255, 255, 255, ${(0.25 + ((b + 0.5) / 8) * 0.55).toFixed(3)})`
);

export default function Starfield({
  density = 0.00008,
  className = "",
  paused = false,
}: {
  density?: number;
  className?: string;
  paused?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const syncRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    // pointer parallax — the field drifts toward the cursor, bigger stars move more
    let tmx = 0; // target offset px
    let tmy = 0;
    let mx = 0; // eased offset px
    let my = 0;
    const MAX_SHIFT = 26;

    type Star = { x: number; y: number; r: number; vx: number; vy: number; t: number; ts: number };
    let stars: Star[] = [];

    const seed = () => {
      const rect = parent.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(220, Math.round(w * h * density));
      stars = Array.from({ length: count }, () => {
        const r = Math.random() * 1.3 + 0.3;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r,
          // bigger dots drift a touch faster → gentle parallax
          vx: (Math.random() - 0.5) * (0.06 + r * 0.04),
          vy: (Math.random() - 0.5) * (0.06 + r * 0.04),
          t: Math.random() * Math.PI * 2,
          ts: Math.random() * 0.02 + 0.006,
        };
      });
    };

    const BUCKETS = 8;
    const FRAME_MS = 32; // ~30fps is plenty for slow drift
    let last = 0;
    let onScreen = true;
    const paths: Path2D[] = [];

    const frame = (t = 0) => {
      if (!reduce && running) raf = requestAnimationFrame(frame);
      if (t && t - last < FRAME_MS) return;
      // scale per-frame velocities by elapsed time so the drift speed is unchanged
      const step = last && t ? Math.min((t - last) / 16.67, 4) : 1;
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (let b = 0; b < BUCKETS; b++) paths[b] = new Path2D();
      // ease the parallax offset toward the pointer target
      mx += (tmx - mx) * 0.06 * step;
      my += (tmy - my) * 0.06 * step;
      for (const s of stars) {
        if (!reduce) {
          s.x += s.vx * step;
          s.y += s.vy * step;
          s.t += s.ts * step;
          if (s.x < -2) s.x = w + 2;
          else if (s.x > w + 2) s.x = -2;
          if (s.y < -2) s.y = h + 2;
          else if (s.y > h + 2) s.y = -2;
        }
        // depth parallax: r ∈ [0.3,1.6] → shift factor ~0.35..1
        const depth = 0.35 + (s.r / 1.6) * 0.65;
        const px = s.x + mx * depth;
        const py = s.y + my * depth;
        const b = Math.min(BUCKETS - 1, Math.floor((Math.sin(s.t) * 0.5 + 0.5) * BUCKETS));
        paths[b].moveTo(px + s.r, py);
        paths[b].arc(px, py, s.r, 0, Math.PI * 2);
      }
      for (let b = 0; b < BUCKETS; b++) {
        ctx.fillStyle = FILLS[b];
        ctx.fill(paths[b]);
      }
    };

    const shouldRun = () => !reduce && onScreen && !document.hidden && !pausedRef.current;
    const sync = () => {
      if (shouldRun()) {
        if (!running) {
          running = true;
          last = 0;
          raf = requestAnimationFrame(frame);
        }
      } else if (running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    syncRef.current = sync;

    const onPointer = (e: PointerEvent | MouseEvent) => {
      if (reduce) return;
      // normalized -0.5..0.5 across the viewport → px shift
      tmx = (e.clientX / window.innerWidth - 0.5) * -2 * MAX_SHIFT;
      tmy = (e.clientY / window.innerHeight - 0.5) * -2 * MAX_SHIFT;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    seed();
    frame();
    sync();

    // Reseed only on a real resize. Mobile URL-bar show/hide changes the height by
    // a toolbar's worth; stretch the canvas for that instead of re-randomising.
    const ro = new ResizeObserver(() => {
      const rect = parent.getBoundingClientRect();
      if (Math.abs(rect.width - w) < 1 && Math.abs(rect.height - h) < 120) {
        canvas.style.height = rect.height + "px";
        return;
      }
      seed();
      if (reduce) frame();
    });
    ro.observe(parent);

    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      sync();
    });
    io.observe(canvas);

    document.addEventListener("visibilitychange", sync);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      syncRef.current = () => {};
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [density]);

  useEffect(() => {
    pausedRef.current = paused;
    syncRef.current();
  }, [paused]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 h-full w-full ${className}`}
    />
  );
}
