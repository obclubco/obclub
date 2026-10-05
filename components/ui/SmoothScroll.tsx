"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// module-level handle so the route-change effect can reach the live instance
type LenisLike = {
  raf: (t: number) => void;
  destroy: () => void;
  scrollTo: (target: number | string | HTMLElement, opts?: Record<string, unknown>) => void;
};
let lenis: LenisLike | null = null;

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let mounted = true;
    let onClick: ((e: MouseEvent) => void) | null = null;

    import("lenis")
      .then(({ default: Lenis }) => {
        if (!mounted) return;
        lenis = new Lenis({ lerp: 0.14 }) as unknown as LenisLike;
        const loop = (t: number) => {
          lenis?.raf(t);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);

        // smooth-scroll in-page hash links (#id or /current#id)
        onClick = (e: MouseEvent) => {
          const a = (e.target as HTMLElement)?.closest?.('a[href*="#"]') as
            | HTMLAnchorElement
            | null;
          if (!a) return;
          const raw = a.getAttribute("href") || "";
          const hash = raw.indexOf("#");
          if (hash < 0) return;
          const path = raw.slice(0, hash);
          const id = raw.slice(hash + 1);
          if (!id) return;
          if (path === "" || path === window.location.pathname) {
            const el = document.getElementById(id);
            if (el) {
              e.preventDefault();
              lenis?.scrollTo(el, { offset: -96, duration: 1.1 });
              history.replaceState(null, "", `#${id}`);
            }
          }
        };
        document.addEventListener("click", onClick);
      })
      .catch(() => {});

    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      if (onClick) document.removeEventListener("click", onClick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // reset to the top on every route change (Lenis otherwise keeps its position)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return; // deep-link to a section: let it be
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
