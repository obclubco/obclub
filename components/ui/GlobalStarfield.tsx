"use client";

import { useEffect, useState } from "react";
import Starfield from "./Starfield";

/**
 * Page-wide star layer, fixed behind the content (which is lifted to z-10 in the
 * layout). An uneven radial mask makes the field sprinkle + fade "here and there"
 * rather than sit as a flat wash, and it fades OUT as the footer/CTA approaches so
 * the closing sections stay clean (the CTA keeps its own contained field).
 */
export default function GlobalStarfield() {
  const [dim, setDim] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("footer");
    if (!footer) return;
    // fire while the footer is still ~0.6 viewport below → fades before it arrives
    const io = new IntersectionObserver(([e]) => setDim(e.isIntersecting), {
      rootMargin: "0px 0px 60% 0px",
    });
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-0 transition-opacity duration-1000 ${
        dim ? "opacity-0" : "opacity-100"
      }`}
      style={{
        WebkitMaskImage:
          "radial-gradient(58% 46% at 22% 18%, #000, transparent 72%), radial-gradient(50% 42% at 82% 34%, #000, transparent 70%), radial-gradient(64% 52% at 46% 70%, rgba(0,0,0,0.75), transparent 78%)",
        maskImage:
          "radial-gradient(58% 46% at 22% 18%, #000, transparent 72%), radial-gradient(50% 42% at 82% 34%, #000, transparent 70%), radial-gradient(64% 52% at 46% 70%, rgba(0,0,0,0.75), transparent 78%)",
      }}
    >
      <Starfield density={0.00008} paused={dim} />
    </div>
  );
}
