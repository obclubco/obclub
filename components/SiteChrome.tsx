"use client";

import type { ReactNode } from "react";
import SmoothScroll from "./ui/SmoothScroll";
import GlobalStarfield from "./ui/GlobalStarfield";
import Nav from "./sections/Nav";

/** Public-site chrome around every page. */
export default function SiteChrome({ children, footer }: { children: ReactNode; footer: ReactNode }) {
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
