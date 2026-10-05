"use client";

import type { ReactNode } from "react";
import { Section, Kicker, Button } from "../ui/primitives";
import { Rise, RiseWords } from "../ui/motion";

export default function PageHero({
  kicker,
  title,
  subtitle,
  primary,
  secondary,
  icon,
  titleNowrap = false,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  icon?: ReactNode;
  /** Keep the headline on one line from `sm` up; wraps (balanced) only on phones,
   *  where a single line would overflow the viewport. */
  titleNowrap?: boolean;
}) {
  return (
    <div className="bg-halo relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-20">
      <div className="grid-lines" />
      <Section className="text-center">
        <Rise className="flex justify-center">
          <Kicker icon={icon}>{kicker}</Kicker>
        </Rise>
        <h1
          className={
            "display display-tight mx-auto mt-7 text-[clamp(40px,6vw,80px)] " +
            (titleNowrap
              ? "text-balance max-w-[18ch] sm:max-w-none sm:whitespace-nowrap"
              : "max-w-[18ch]")
          }
        >
          <RiseWords text={title} />
        </h1>
        {subtitle && (
          <Rise delay={0.15}>
            <p className="mx-auto mt-6 max-w-[56ch] text-[18px] leading-relaxed text-[var(--text-muted)]">
              {subtitle}
            </p>
          </Rise>
        )}
        {(primary || secondary) && (
          <Rise delay={0.25}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              {primary && <Button href={primary.href}>{primary.label}</Button>}
              {secondary && (
                <Button href={secondary.href} variant="dark">
                  {secondary.label}
                </Button>
              )}
            </div>
          </Rise>
        )}
      </Section>
    </div>
  );
}
