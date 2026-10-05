"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import SmoothScroll from "./ui/SmoothScroll";
import GlobalStarfield from "./ui/GlobalStarfield";
import Nav from "./sections/Nav";

/** Public-site chrome. The admin (/admin) renders bare, without it. */
export default function SiteChrome({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/admin")) return <>{children}</>;
  return (
    <>
      <Beacon path={pathname} />
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

// Cookieless page-view ping for the admin analytics (see app/api/collect).
function Beacon({ path }: { path: string }) {
  useEffect(() => {
    const body = JSON.stringify({ path, ref: document.referrer });
    try {
      if (!navigator.sendBeacon?.("/api/collect", new Blob([body], { type: "application/json" }))) {
        fetch("/api/collect", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
      }
    } catch {
      /* never break the page */
    }
  }, [path]);
  return null;
}
