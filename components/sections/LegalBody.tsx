import type { ReactNode } from "react";
import { Section } from "../ui/primitives";
import { LAST_UPDATED, formatDate } from "../../lib/legal";

// Readable prose column shared by /privacy, /terms and /imprint.
// Plain semantic HTML inside; styling comes from the descendant selectors below.
const prose = [
  "mx-auto max-w-[72ch]",
  "[&_h2]:[font-family:var(--font-serif),var(--font-remark)] [&_h2]:mt-14 [&_h2]:mb-4 [&_h2]:text-[24px] [&_h2]:font-bold [&_h2]:leading-snug [&_h2]:text-[var(--text)]",
  "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-[17px] [&_h3]:font-semibold [&_h3]:text-[var(--text)]",
  "[&_p]:mt-4 [&_p]:text-[16px] [&_p]:leading-relaxed [&_p]:text-[var(--text-muted)]",
  "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:text-[16px] [&_ul]:leading-relaxed [&_ul]:text-[var(--text-muted)] [&_li]:marker:text-[var(--text-faint)]",
  "[&_a]:text-[var(--text)] [&_a]:underline [&_a]:decoration-[var(--border-2)] [&_a]:underline-offset-4 [&_a:hover]:decoration-[var(--text)]",
  "[&_strong]:font-semibold [&_strong]:text-[var(--text)]",
].join(" ");

export default function LegalBody({ children }: { children: ReactNode }) {
  return (
    <Section className="pb-28">
      <div className={prose}>
        <p className="!mt-0 border-b border-[var(--border)] pb-6 !text-[14px] !text-[var(--text-faint)]">
          Last updated: {formatDate(LAST_UPDATED)}
        </p>
        {children}
      </div>
    </Section>
  );
}

// Two-column facts table (processors, imprint details). Scrolls sideways inside
// its own box on narrow screens so the page never scrolls horizontally.
export function LegalTable({
  head,
  rows,
}: {
  head: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="mt-6 overflow-x-auto rounded-[var(--radius)] border border-[var(--border)]">
      <table className="w-full min-w-[520px] border-collapse text-left text-[14px] leading-relaxed">
        <thead>
          <tr className="border-b border-[var(--border)] text-[var(--text-faint)]">
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-[var(--border)] align-top last:border-b-0"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={
                    "px-4 py-3 " +
                    (j === 0 ? "text-[var(--text)]" : "text-[var(--text-muted)]")
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
