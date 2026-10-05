"use client";

import { Fragment } from "react";

/** Consent checkbox whose label text carries a {privacy} token for the policy link. */
export default function Consent({
  text,
  checked,
  onChange,
  invalid = false,
  className = "",
}: {
  text: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  invalid?: boolean;
  className?: string;
}) {
  const parts = text.split("{privacy}");
  return (
    <label className={`flex cursor-pointer items-start gap-3 text-left text-[13px] leading-relaxed text-[var(--text-faint)] ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-invalid={invalid || undefined}
        className={`mt-[3px] h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-[4px] border bg-transparent transition-colors checked:border-white checked:bg-white checked:bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3.5 8.5l3 3 6-7' fill='none' stroke='black' stroke-width='2'/%3E%3C/svg%3E")] ${
          invalid ? "border-[#e5657a]" : "border-[var(--border-2)]"
        }`}
      />
      <span>
        {parts.map((p, i) => (
          <Fragment key={i}>
            {p}
            {i < parts.length - 1 && (
              <a href="/privacy" target="_blank" className="text-[var(--text-muted)] underline underline-offset-2 hover:text-[var(--text)]">
                privacy policy
              </a>
            )}
          </Fragment>
        ))}
      </span>
    </label>
  );
}
