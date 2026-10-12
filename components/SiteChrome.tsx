"use client";

import { useEffect, type ReactNode } from "react";
import SmoothScroll from "./ui/SmoothScroll";
import GlobalStarfield from "./ui/GlobalStarfield";
import Nav from "./sections/Nav";

/** Public-site chrome around every page. */
export default function SiteChrome({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  // Scripts are running: switch off the no-script fallback in app/layout.tsx.
  useEffect(() => {
    document.documentElement.setAttribute("data-ready", "");
  }, []);

  return (
    <>
      <SmoothScroll />
      <GlobalStarfield />
      <Nav />
      <div className="relative z-10">
        {children}
        {footer}
      </div>
    </>
  );
}
