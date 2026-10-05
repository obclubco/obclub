import type { Analytics } from "../../lib/admin-data";
import type { Lead } from "./LeadsList";
import PageHeader from "./PageHeader";
import { btnGhost } from "./ui";

const fmt = (n: number) => n.toLocaleString("en-GB");
const when = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default function Overview({
  analytics: a,
  leads,
  onOpenLeads,
  onRefresh,
  refreshing,
}: {
  analytics: Analytics | null;
  leads: Lead[];
  onOpenLeads: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  const recent = leads.slice(0, 6);
  const max = Math.max(1, ...(a?.daily.map((d) => d.views) ?? [1]));
  const newLeads = leads.filter((l) => l.status === "new").length;
  const kpis: [string, string, string][] = a
    ? [
        ["Visitors, 7 days", fmt(a.unique7), `${fmt(a.views7)} page views`],
        ["Visitors, 30 days", fmt(a.unique30), `${fmt(a.views30)} page views`],
        ["Leads, 7 days", fmt(a.leads7), `${fmt(leads.length)} all time`],
        ["New leads", fmt(newLeads), "waiting for a reply"],
      ]
    : [];

  return (
    <>
      <PageHeader
        kicker="OB Club"
        title="Overview"
        sub="Visits are counted without cookies. Bots and your own admin visits are left out."
        action={
          <button type="button" onClick={onRefresh} disabled={refreshing} className={btnGhost}>
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        }
      />

      <section className="grid grid-cols-2 gap-y-8 border-y border-[var(--border)] py-8 lg:grid-cols-4">
        {kpis.map(([k, v, note], i) => (
          <div key={k} className={`px-1 ${i % 2 ? "pl-6" : ""} lg:pl-6 lg:first:pl-1 ${i ? "lg:border-l lg:border-[var(--border)]" : ""}`}>
            <p className="text-[12px] uppercase tracking-[0.14em] text-[var(--text-faint)]">{k}</p>
            <p className="serif mt-2 text-[40px] font-bold leading-none">{v}</p>
            <p className="mt-2 text-[13px] text-[var(--text-faint)]">{note}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-[12px] uppercase tracking-[0.14em] text-[var(--text-faint)]">Page views, last 30 days</h2>
        {a && a.views30 > 0 ? (
          <div className="mt-5 flex h-[140px] items-end gap-[3px]" role="img" aria-label={`${fmt(a.views30)} page views over 30 days`}>
            {a.daily.map((d) => (
              <div key={d.day} className="group relative flex h-full flex-1 items-end">
                <div className="w-full rounded-t-[2px] bg-white/70 transition-colors group-hover:bg-white" style={{ height: `${Math.max(d.views ? 3 : 0, (d.views / max) * 100)}%` }} />
                <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-[6px] bg-white px-2 py-1 text-[11px] text-black group-hover:block">
                  {d.day.slice(5)}: {d.views} views, {d.unique} visitors
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-[14px] text-[var(--text-faint)]">No visits recorded yet. Views appear here as soon as people browse the site.</p>
        )}
      </section>

      {a && a.views30 > 0 && (
        <section className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3">
          <Breakdown title="Top pages" rows={a.topPages.map((r) => [r.path, r.views])} />
          <Breakdown title="Came from" rows={a.referrers.map((r) => [r.ref, r.views])} />
          <Breakdown title="Devices" rows={a.devices.map((r) => [r.device, r.views])} />
        </section>
      )}

      <section className="mt-14">
        <div className="flex items-center justify-between">
          <h2 className="text-[12px] uppercase tracking-[0.14em] text-[var(--text-faint)]">Latest leads</h2>
          <button type="button" onClick={onOpenLeads} className="text-[13px] text-[var(--text-muted)] underline-offset-4 hover:text-[var(--text)] hover:underline">
            All leads
          </button>
        </div>
        {recent.length ? (
          <ul className="mt-4 border-t border-[var(--border)]">
            {recent.map((l) => (
              <li key={l.id} className="flex items-center gap-4 border-b border-[var(--border)] py-4">
                <span className={`h-2 w-2 shrink-0 rounded-full ${l.status === "new" ? "bg-white" : "bg-white/20"}`} aria-label={l.status} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px]">{l.name || l.email}</span>
                  <span className="block truncate text-[13px] text-[var(--text-faint)]">
                    {l.kind === "contact" ? l.intent || "Contact form" : `Sign-up: ${l.topic || "updates"}`}
                    {l.name ? ` · ${l.email}` : ""}
                  </span>
                </span>
                <span className="shrink-0 text-[13px] text-[var(--text-faint)]">{when(l.created_at)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-[14px] text-[var(--text-faint)]">No leads yet. Contact form messages and email sign-ups land here.</p>
        )}
      </section>
    </>
  );
}

function Breakdown({ title, rows }: { title: string; rows: [string, number][] }) {
  const top = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <div>
      <h2 className="text-[12px] uppercase tracking-[0.14em] text-[var(--text-faint)]">{title}</h2>
      <ul className="mt-4 space-y-3">
        {rows.map(([k, v]) => (
          <li key={k} className="text-[14px]">
            <div className="flex justify-between gap-3">
              <span className="truncate text-[var(--text-muted)]">{k}</span>
              <span className="tabular-nums text-[var(--text-faint)]">{v}</span>
            </div>
            <div className="mt-1.5 h-[2px] bg-white/10">
              <div className="h-full bg-white/60" style={{ width: `${(v / top) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
