import type { ReactNode } from "react";

export default function PageHeader({ kicker, title, action, sub }: { kicker?: string; title: string; action?: ReactNode; sub?: ReactNode }) {
  return (
    <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {kicker && <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-faint)]">{kicker}</p>}
        <h1 className="serif mt-2 text-[clamp(28px,3.4vw,38px)] font-bold leading-tight">{title}</h1>
        {sub && <p className="mt-2 max-w-[60ch] text-[14px] text-[var(--text-faint)]">{sub}</p>}
      </div>
      {action && <div className="flex shrink-0 gap-2">{action}</div>}
    </header>
  );
}
