import { Cube } from "./icons";

/* ---------- Big hero dashboard (CRM) ---------- */
export function DashboardMockup() {
  const leads = [
    ["John Carter", "Davis Tech", "New Lead", "#7c6bf5"],
    ["Emily Davis", "BrightCorp", "Proposal Sent", "#38e0a6"],
    ["TechNova Inc.", "TechNova", "Contacted", "#e0b038"],
    ["Alex Spencer", "GreenTech", "Follow-up", "#6bb3f5"],
    ["Rachel Kim", "Northwind", "New Lead", "#7c6bf5"],
    ["Dan Lopez", "AltForms", "Contacted", "#e0b038"],
  ];
  const nav = ["Dashboard", "Notifications", "Emails", "Notes", "Tasks"];
  return (
    <div className="overflow-hidden rounded-[18px] border border-[var(--border-2)] bg-[#0c0b14] shadow-[0_40px_120px_-40px_rgba(124,107,245,0.55)]">
      <div className="flex">
        {/* sidebar */}
        <aside className="hidden w-[190px] shrink-0 flex-col gap-1 border-r border-[var(--border)] bg-[#0a0910] p-3 sm:flex">
          <div className="mb-3 flex items-center gap-2 px-2 py-1.5">
            <Cube className="h-4 w-4 text-[var(--accent)]" />
            <span className="text-[13px] font-semibold">Planquo</span>
          </div>
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-[var(--border)] p-2">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#7c6bf5] to-[#38e0a6]" />
            <div className="min-w-0">
              <div className="truncate text-[11px] font-medium">John Cornor</div>
              <div className="truncate text-[9px] text-[var(--text-faint)]">
                john@mail.com
              </div>
            </div>
          </div>
          {nav.map((n, i) => (
            <div
              key={n}
              className={`rounded-md px-2.5 py-1.5 text-[11px] ${
                i === 0
                  ? "bg-[var(--accent-soft)] text-[var(--text)]"
                  : "text-[var(--text-faint)]"
              }`}
            >
              {n}
            </div>
          ))}
        </aside>
        {/* main */}
        <div className="min-w-0 flex-1 p-3.5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[12px] font-medium text-[var(--text-muted)]">
              Dashboard
            </span>
            <span className="rounded-md bg-[var(--accent-btn)] px-2.5 py-1 text-[10px] font-medium text-white">
              + New
            </span>
          </div>
          <div className="mb-3 text-[13px] font-semibold">
            Welcome Back, Ali Husni 👋
          </div>
          <div className="mb-3 grid grid-cols-3 gap-2">
            {[
              ["Total Deals", "45", "+10%"],
              ["Revenue", "$75,250", "+10%"],
              ["Top Rep", "Sarah T", "15 deals"],
            ].map(([l, v, d]) => (
              <div
                key={l}
                className="rounded-lg border border-[var(--border)] bg-[#0f0d18] p-2.5"
              >
                <div className="text-[9px] text-[var(--text-faint)]">{l}</div>
                <div className="mt-1 text-[13px] font-semibold">{v}</div>
                <div className="text-[9px] text-[var(--mint)]">{d}</div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[#0f0d18]">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-2">
              <span className="text-[11px] font-medium">Leads &amp; Contacts</span>
              <span className="text-[9px] text-[var(--text-faint)]">Sort · Filter</span>
            </div>
            <div>
              {leads.map(([name, co, status, color]) => (
                <div
                  key={name}
                  className="flex items-center gap-2 border-b border-[var(--border)] px-3 py-1.5 last:border-0"
                >
                  <div className="h-4 w-4 rounded-full bg-[var(--surface)]" />
                  <span className="w-[84px] shrink-0 truncate text-[10px]">{name}</span>
                  <span className="hidden w-[70px] shrink-0 truncate text-[10px] text-[var(--text-faint)] md:block">
                    {co}
                  </span>
                  <span
                    className="ml-auto rounded-full px-2 py-0.5 text-[9px]"
                    style={{ background: `${color}22`, color: color as string }}
                  >
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small feature visual (generic UI card) ---------- */
export function MiniPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-[var(--border)] bg-[#0d0c15] p-3">
      {children}
    </div>
  );
}

export function BarRows({ n = 4 }: { n?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-[var(--accent-soft)]" />
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-[var(--accent)]/70 to-[var(--accent)]/10"
            style={{ width: `${90 - i * 14}%` }}
          />
        </div>
      ))}
    </div>
  );
}

export function ChipList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => (
        <span
          key={it}
          className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[11px] text-[var(--text-muted)]"
        >
          {it}
        </span>
      ))}
    </div>
  );
}

export function DonutStat() {
  return (
    <div className="flex items-center justify-center py-2">
      <div
        className="grid h-20 w-20 place-items-center rounded-full"
        style={{
          background: "conic-gradient(var(--accent) 0 35%, rgba(255,255,255,0.06) 35% 100%)",
        }}
      >
        <div className="grid h-14 w-14 place-items-center rounded-full bg-[#0d0c15] text-[13px] font-semibold">
          35%
        </div>
      </div>
    </div>
  );
}
