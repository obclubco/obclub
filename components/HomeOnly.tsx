"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Renders its children on the homepage only (the "Join community" calls to action). */
export default function HomeOnly({ children }: { children: ReactNode }) {
  return usePathname() === "/" ? <>{children}</> : null;
}
