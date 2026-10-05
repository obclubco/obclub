"use client";

import { useState, useTransition } from "react";
import { btnDanger, btnGhost, input } from "./ui";

export type Lead = {
  id: string;
  kind: string;
  name: string | null;
  email: string;
  intent: string | null;
  topic: string | null;
  message: string | null;
  consent: boolean;
  page: string | null;
  status: string;
  notes: string | null;
  created_at: string;
};

const STATUS = ["new", "contacted", "done"] as const;
const when = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

type Handlers = {
  onUpdate: (id: string, patch: { status?: string; notes?: string }) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
};

export default function LeadsList({ leads, onUpdate, onDelete }: { leads: Lead[] } & Handlers) {
  const [open, setOpen] = useState<string | null>(null);
  if (!leads.length) {
    return <p className="border-t border-[var(--border)] pt-8 text-[14px] text-[var(--text-faint)]">No leads match this filter yet.</p>;
  }
  return (
    <ul className="border-t border-[var(--border)]">
      {leads.map((l) => (
        <LeadRow key={l.id} lead={l} open={open === l.id} onToggle={() => setOpen(open === l.id ? null : l.id)} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </ul>
  );
}

function LeadRow({ lead: l, open, onToggle, onUpdate, onDelete }: { lead: Lead; open: boolean; onToggle: () => void } & Handlers) {
  const [pending, start] = useTransition();
  const [notes, setNotes] = useState(l.notes || "");
  const [confirm, setConfirm] = useState(false);
  const [msg, setMsg] = useState("");

  const run = (fn: () => Promise<boolean>, done?: string) =>
    start(async () => {
      const ok = await fn();
      setMsg(ok ? done || "" : "Something went wrong.");
    });

  return (
    <li className="border-b border-[var(--border)]">
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-4 py-4 text-left">
        <span className={`h-2 w-2 shrink-0 rounded-full ${l.status === "new" ? "bg-white" : "bg-white/20"}`} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px]">{l.name || l.email}</span>
          <span className="block truncate text-[13px] text-[var(--text-faint)]">
            {l.kind === "contact" ? l.intent || "Contact form" : `Sign-up: ${l.topic || "updates"}`}
            {l.name ? ` · ${l.email}` : ""}
          </span>
        </span>
        <span className="hidden shrink-0 text-[12px] uppercase tracking-[0.12em] text-[var(--text-faint)] sm:block">{l.status}</span>
        <span className="shrink-0 text-[13px] text-[var(--text-faint)]">{when(l.created_at)}</span>
      </button>

      {open && (
        <div className="pb-6 pl-6">
          {l.message && <p className="max-w-[70ch] whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--text-muted)]">{l.message}</p>}
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-[13px]">
            <dt className="text-[var(--text-faint)]">Email</dt>
            <dd>
              <a href={`mailto:${l.email}`} className="underline underline-offset-2">{l.email}</a>
            </dd>
            <dt className="text-[var(--text-faint)]">Consent</dt>
            <dd className="text-[var(--text-muted)]">{l.consent ? "Given" : "Not recorded"}</dd>
            {l.page && (
              <>
                <dt className="text-[var(--text-faint)]">Page</dt>
                <dd className="text-[var(--text-muted)]">{l.page}</dd>
              </>
            )}
          </dl>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {STATUS.map((s) => (
              <button
                key={s}
                type="button"
                disabled={pending}
                onClick={() => run(() => onUpdate(l.id, { status: s }), `Marked ${s}.`)}
                className={`min-h-[36px] rounded-full px-4 text-[13px] capitalize ${l.status === s ? "bg-white text-black" : "border border-[var(--border-2)] text-[var(--text-muted)] hover:text-[var(--text)]"}`}
              >
                {s}
              </button>
            ))}
            <a href={`mailto:${l.email}?subject=${encodeURIComponent("OB Club")}`} className={`${btnGhost} min-h-[36px]`}>
              Reply by email
            </a>
          </div>

          <label className="mt-5 block max-w-[560px]">
            <span className="mb-1.5 block text-[12px] uppercase tracking-[0.14em] text-[var(--text-faint)]">Notes</span>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={`${input} resize-y`} placeholder="Private notes for the team" />
          </label>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button type="button" disabled={pending || notes === (l.notes || "")} onClick={() => run(() => onUpdate(l.id, { notes }), "Notes saved.")} className={btnGhost}>
              Save notes
            </button>
            {confirm ? (
              <span className="flex items-center gap-2 text-[13px] text-[var(--text-muted)]">
                Delete this lead for good?
                <button type="button" disabled={pending} onClick={() => run(() => onDelete(l.id))} className={btnDanger}>
                  Delete
                </button>
                <button type="button" onClick={() => setConfirm(false)} className="px-2 text-[13px] underline underline-offset-2">
                  Cancel
                </button>
              </span>
            ) : (
              <button type="button" onClick={() => setConfirm(true)} className={btnDanger}>
                Delete
              </button>
            )}
            <span role="status" className="text-[13px] text-[var(--text-faint)]">{pending ? "Saving…" : msg}</span>
          </div>
        </div>
      )}
    </li>
  );
}
