"use client";

import { useEffect, useState, useTransition } from "react";
import { deleteLead, loadDashboard, logout, reorderEntities, setPublished, updateLead, type SavedRow } from "../../app/admin/actions";
import { KINDS, type AdminKind } from "../../lib/admin-schema";
import type { Analytics } from "../../lib/admin-data";
import EntityEditor from "./EntityEditor";
import LeadsList, { type Lead } from "./LeadsList";
import Overview from "./Overview";
import PageHeader from "./PageHeader";
import { btnGhost, btnPrimary, iconBtn } from "./ui";

type View = { section: "overview" } | { section: "leads" } | { section: AdminKind; editing?: string | "new" };
type Content = Record<string, SavedRow[]>;

const CONTENT_NAV: AdminKind[] = ["event", "quote", "episode", "post", "partner", "faq", "stats"];

const HELP: Partial<Record<AdminKind, string>> = {
  event: "Upcoming events show on /events in the calendar. Past dates hide themselves on the site.",
  quote: "Quotes appear under 'Real people. Real results.' on the home page.",
  episode: "Newest episode number shows first. The latest one is featured on the home page.",
  post: "Articles live inside a podcast episode. Pick the episode in each article to link them.",
  partner: "Shown in the home page logo strip and on /partners, in this order.",
  faq: "Shown on the home page and used for Google's FAQ rich results.",
};

// list order on the admin: events by date, episodes newest first, the rest by manual order
function ordered(kind: AdminKind, rows: SavedRow[]): SavedRow[] {
  const r = [...rows];
  if (kind === "event") return r.sort((a, b) => String(a.data.date).localeCompare(String(b.data.date)));
  if (kind === "episode") return r.sort((a, b) => Number(b.data.number) - Number(a.data.number));
  if (kind === "post") return r.sort((a, b) => String(b.data.date).localeCompare(String(a.data.date)));
  return r.sort((a, b) => a.sort - b.sort);
}

export default function AdminApp({
  hasDb,
  analytics: initialAnalytics,
  leads: initialLeads,
  content: initialContent,
}: {
  hasDb: boolean;
  analytics: Analytics | null;
  leads: Lead[];
  content: Content;
}) {
  const [view, setView] = useState<View>({ section: "overview" });
  const [content, setContent] = useState<Content>(initialContent);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [refreshing, startRefresh] = useTransition();
  // bumps on every navigation so the editor remounts when opened, but not when a save updates the view
  const [openSeq, setOpenSeq] = useState(0);
  const newLeads = leads.filter((l) => l.status === "new").length;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const go = (v: View) => {
    // editor has its own unsaved-changes guard via beforeunload; in-app switches ask here
    if (document.querySelector("[data-dirty='true']") && !confirm("Leave without saving your changes?")) return;
    setOpenSeq((n) => n + 1);
    setView(v);
  };

  const refresh = () =>
    startRefresh(async () => {
      const d = await loadDashboard();
      setAnalytics(d.analytics);
      setLeads(d.leads.map((l) => ({ ...l, created_at: new Date(l.created_at).toISOString() })));
    });

  const rowsOf = (k: AdminKind) => content[k] || [];
  const setRows = (k: AdminKind, fn: (rows: SavedRow[]) => SavedRow[]) => setContent((c) => ({ ...c, [k]: fn(c[k] || []) }));

  const navItem = (label: string, v: View, active: boolean, badge?: number) => (
    <button
      key={label}
      type="button"
      onClick={() => go(v)}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-[40px] shrink-0 items-center justify-between gap-3 whitespace-nowrap rounded-[8px] px-3 text-left text-[14px] transition-colors ${
        active ? "bg-white/10 text-[var(--text)]" : "text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text)]"
      }`}
    >
      {label}
      {!!badge && <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-black">{badge}</span>}
    </button>
  );

  return (
    <div className="md:flex">
      {/* sidebar (horizontal strip on phones) */}
      <aside className="border-b border-[var(--border)] md:sticky md:top-0 md:flex md:h-screen md:w-[236px] md:shrink-0 md:flex-col md:border-b-0 md:border-r">
        <div className="flex items-center gap-3 px-5 py-4 md:px-6 md:py-7">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/obc/logo.webp" alt="OB Club" className="h-9 w-auto" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-faint)]">Admin</span>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 [scrollbar-width:none] md:flex-1 md:flex-col md:gap-0.5 md:overflow-y-auto md:pb-0">
          {navItem("Overview", { section: "overview" }, view.section === "overview")}
          {navItem("Leads", { section: "leads" }, view.section === "leads", newLeads)}
          <p className="hidden px-3 pb-2 pt-6 text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)] md:block">Content</p>
          {CONTENT_NAV.map((k) => navItem(KINDS[k].label, { section: k }, view.section === k))}
        </nav>
        <div className="flex gap-1 px-3 pb-3 md:block md:border-t md:border-[var(--border)] md:py-4">
          <a href="/" target="_blank" className="flex min-h-[40px] items-center rounded-[8px] px-3 text-[14px] text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text)]">
            View site ↗
          </a>
          <form action={logout}>
            <button className="flex min-h-[40px] w-full items-center rounded-[8px] px-3 text-left text-[14px] text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text)]">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 md:px-12 md:py-12">
        <div className="mx-auto max-w-[980px]">
          {!hasDb && (
            <p role="alert" className="mb-8 border-l-2 border-[#e5657a] pl-4 text-[14px] text-[var(--text-muted)]">
              No database connected. Set DATABASE_URL to save changes and collect leads.
            </p>
          )}

          {view.section === "overview" && (
            <Overview
              analytics={analytics}
              leads={leads}
              onOpenLeads={() => go({ section: "leads" })}
              onRefresh={refresh}
              refreshing={refreshing}
            />
          )}

          {view.section === "leads" && (
            <LeadsSection
              leads={leads}
              onUpdate={async (id, patch) => {
                const r = await updateLead(id, patch);
                if (r.ok) setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
                return r.ok;
              }}
              onDelete={async (id) => {
                const r = await deleteLead(id);
                if (r.ok) setLeads((ls) => ls.filter((l) => l.id !== id));
                return r.ok;
              }}
            />
          )}

          {view.section !== "overview" && view.section !== "leads" && (() => {
            const kind = view.section;
            const def = KINDS[kind];
            const rows = ordered(kind, rowsOf(kind));
            const editing = def.single ? kind : view.editing;
            if (editing) {
              const row = editing === "new" ? null : rows.find((r) => r.id === editing) || null;
              return (
                <EntityEditor
                  key={`${kind}:${openSeq}`}
                  kind={kind}
                  originalId={row ? row.id : def.single ? kind : null}
                  initial={row ? row.data : def.blank}
                  initialPublished={row ? row.published : true}
                  episodes={ordered("episode", rowsOf("episode")).map((e) => ({ slug: e.id, title: `#${e.data.number} ${e.data.title}` }))}
                  single={!!def.single}
                  onBack={def.single ? undefined : () => go({ section: kind })}
                  onSaved={(saved, prevId) => {
                    setRows(kind, (rs) => [saved, ...rs.filter((r) => r.id !== prevId && r.id !== saved.id)]);
                    if (kind === "episode" && prevId && prevId !== saved.id) {
                      setRows("post", (ps) => ps.map((p) => (p.data.episodeSlug === prevId ? { ...p, data: { ...p.data, episodeSlug: saved.id } } : p)));
                    }
                    if (!def.single) setView({ section: kind, editing: saved.id });
                  }}
                  onDeleted={(id) => {
                    setRows(kind, (rs) => rs.filter((r) => r.id !== id));
                    setView({ section: kind });
                  }}
                />
              );
            }
            return (
              <ContentList
                kind={kind}
                rows={rows}
                onOpen={(id) => go({ section: kind, editing: id })}
                onToggle={async (r) => {
                  setRows(kind, (rs) => rs.map((x) => (x.id === r.id ? { ...x, published: !x.published } : x)));
                  await setPublished(kind, r.id, !r.published);
                }}
                onReorder={async (ids) => {
                  setRows(kind, (rs) => ids.map((id, n) => ({ ...rs.find((x) => x.id === id)!, sort: n })));
                  await reorderEntities(kind, ids);
                }}
              />
            );
          })()}
        </div>
      </main>
    </div>
  );
}

// ── leads ────────────────────────────────────────────────────────────────────

const LEAD_KINDS: [string, string][] = [["All", ""], ["Contact form", "contact"], ["Email sign-ups", "subscribe"]];
const LEAD_STATUS: [string, string][] = [["Any status", ""], ["New", "new"], ["Contacted", "contacted"], ["Done", "done"]];

function LeadsSection({
  leads,
  onUpdate,
  onDelete,
}: {
  leads: Lead[];
  onUpdate: (id: string, patch: { status?: string; notes?: string }) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}) {
  const [kind, setKind] = useState("");
  const [status, setStatus] = useState("");
  const shown = leads.filter((l) => (!kind || l.kind === kind) && (!status || l.status === status));
  return (
    <>
      <PageHeader
        kicker="Inbox"
        title="Leads"
        sub="Every contact form message and email sign-up, with the consent the person gave."
        action={
          <a href={`/api/admin/export${kind ? `?kind=${kind}` : ""}`} className={btnGhost}>
            Export CSV
          </a>
        }
      />
      <div className="mb-6 flex flex-wrap gap-x-6 gap-y-3 text-[14px]">
        <div className="flex flex-wrap gap-1">
          {LEAD_KINDS.map(([l, v]) => (
            <button key={l} type="button" onClick={() => setKind(v)} className={`rounded-full px-3 py-1.5 ${kind === v ? "bg-white text-black" : "text-[var(--text-muted)] hover:text-[var(--text)]"}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {LEAD_STATUS.map(([l, v]) => (
            <button key={l} type="button" onClick={() => setStatus(v)} className={`rounded-full px-3 py-1.5 ${status === v ? "bg-white/15 text-[var(--text)]" : "text-[var(--text-faint)] hover:text-[var(--text)]"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <LeadsList leads={shown} onUpdate={onUpdate} onDelete={onDelete} />
    </>
  );
}

// ── content list ─────────────────────────────────────────────────────────────

function ContentList({
  kind,
  rows,
  onOpen,
  onToggle,
  onReorder,
}: {
  kind: AdminKind;
  rows: SavedRow[];
  onOpen: (id: string | "new") => void;
  onToggle: (r: SavedRow) => void;
  onReorder: (ids: string[]) => void;
}) {
  const def = KINDS[kind];
  const manual = !["episode", "post", "event"].includes(kind);
  const move = (i: number, d: -1 | 1) => {
    const ids = rows.map((r) => r.id);
    [ids[i], ids[i + d]] = [ids[i + d], ids[i]];
    onReorder(ids);
  };
  return (
    <>
      <PageHeader
        kicker="Content"
        title={def.label}
        sub={HELP[kind]}
        action={
          <button type="button" onClick={() => onOpen("new")} className={btnPrimary}>
            Add {def.singular.toLowerCase()}
          </button>
        }
      />
      {rows.length === 0 ? (
        <p className="border-t border-[var(--border)] pt-8 text-[14px] text-[var(--text-faint)]">No {def.label.toLowerCase()} yet.</p>
      ) : (
        <ul className="border-t border-[var(--border)]">
          {rows.map((r, i) => (
            <li key={r.id} className="group flex items-center gap-3 border-b border-[var(--border)]">
              <button type="button" onClick={() => onOpen(r.id)} className="min-w-0 flex-1 py-4 text-left">
                <span className="flex items-center gap-3">
                  <span className="truncate text-[15px] group-hover:underline group-hover:underline-offset-4">{def.titleOf(r.data) || "Untitled"}</span>
                  {!r.published && (
                    <span className="shrink-0 rounded-full border border-[var(--border-2)] px-2 py-0.5 text-[11px] uppercase tracking-[0.12em] text-[var(--text-faint)]">
                      Hidden
                    </span>
                  )}
                </span>
                {def.subtitleOf && <span className="mt-0.5 block truncate text-[13px] text-[var(--text-faint)]">{def.subtitleOf(r.data)}</span>}
              </button>
              <button type="button" onClick={() => onToggle(r)} className="hidden min-h-[36px] rounded-full px-3 text-[13px] text-[var(--text-faint)] hover:text-[var(--text)] sm:block">
                {r.published ? "Hide" : "Show"}
              </button>
              {manual && (
                <span className="flex">
                  <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className={iconBtn}>
                    ↑
                  </button>
                  <button type="button" aria-label="Move down" disabled={i === rows.length - 1} onClick={() => move(i, 1)} className={iconBtn}>
                    ↓
                  </button>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
