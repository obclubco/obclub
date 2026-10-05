"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { deleteEntity, saveEntity, uploadMedia, type SavedRow } from "../../app/admin/actions";
import { KINDS, getPath, setPath, youtubeId, type AdminKind, type Field } from "../../lib/admin-schema";
import { btnDanger, btnGhost, btnPrimary, iconBtn, input, label as labelCls } from "./ui";

type Data = Record<string, unknown>;
type Episodes = { slug: string; title: string }[];

export default function EntityEditor({
  kind,
  originalId,
  initial,
  initialPublished,
  episodes,
  single,
  onSaved,
  onDeleted,
  onBack,
}: {
  kind: AdminKind;
  originalId: string | null;
  initial: Data;
  initialPublished: boolean;
  episodes: Episodes;
  single: boolean;
  onSaved: (row: SavedRow, prevId: string | null) => void;
  onDeleted: (id: string) => void;
  onBack?: () => void;
}) {
  const def = KINDS[kind];
  const [data, setData] = useState<Data>(initial);
  const [published, setPublishedState] = useState(initialPublished);
  const [saved, setSaved] = useState(() => JSON.stringify([initial, initialPublished]));
  const [status, setStatus] = useState<{ tone: "ok" | "err"; text: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pending, start] = useTransition();

  const dirty = JSON.stringify([data, published]) !== saved;
  const view = def.viewUrl?.(data) ?? null;
  const set = (path: string, v: unknown) => setData((d) => setPath(d, path, v));

  // warn before leaving with unsaved edits
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const save = () =>
    start(async () => {
      setStatus(null);
      const r = await saveEntity(kind, originalId, data, published);
      if (!r.ok) {
        setStatus({ tone: "err", text: r.error });
        return;
      }
      setSaved(JSON.stringify([data, published]));
      setStatus({ tone: "ok", text: published ? "Saved. It's live on the site." : "Saved as hidden." });
      if (r.row) onSaved(r.row, originalId);
    });

  // Cmd/Ctrl+S saves
  const saveRef = useRef(save);
  saveRef.current = save;
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveRef.current();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const remove = () =>
    start(async () => {
      if (!originalId) return;
      const r = await deleteEntity(kind, originalId);
      if (r.ok) onDeleted(originalId);
      else setStatus({ tone: "err", text: r.error });
    });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="mt-4"
      data-dirty={dirty ? "true" : "false"}
    >
      {onBack && (
        <button type="button" onClick={onBack} className="mb-4 text-[13px] text-[var(--text-faint)] hover:text-[var(--text)]">
          ← {def.label}
        </button>
      )}
      <h1 className="serif text-[clamp(26px,3vw,34px)] font-bold leading-tight">
        {single ? def.label : originalId ? def.titleOf(data) || def.singular : `New ${def.singular.toLowerCase()}`}
      </h1>

      <div className="mt-8 flex max-w-[760px] flex-col gap-6">
        {def.fields.map((f) => (
          <FieldInput key={f.path} field={f} value={getPath(data, f.path)} onChange={(v) => set(f.path, v)} episodes={episodes} />
        ))}
      </div>

      {/* sticky action bar */}
      <div className="sticky bottom-0 -mx-5 mt-12 flex flex-wrap items-center gap-3 border-t border-[var(--border)] bg-black/95 px-5 py-4 backdrop-blur-sm sm:-mx-8 sm:px-8 md:-mx-12 md:px-12">
        <button type="submit" disabled={pending || (!dirty && !!originalId)} className={btnPrimary}>
          {pending ? "Saving…" : "Save"}
        </button>
        {!single && (
          <label className="flex min-h-[44px] cursor-pointer items-center gap-2 px-2 text-[14px] text-[var(--text-muted)]">
            <input type="checkbox" checked={published} onChange={(e) => setPublishedState(e.target.checked)} className="h-4 w-4 accent-white" />
            Visible on site
          </label>
        )}
        {view && originalId && (
          <a href={view} target="_blank" className={btnGhost}>
            View ↗
          </a>
        )}
        <span role="status" aria-live="polite" className={`text-[13px] ${status?.tone === "err" ? "text-[#e5657a]" : "text-[var(--text-faint)]"}`}>
          {status?.text || (dirty ? "Unsaved changes" : "")}
        </span>
        {originalId && !single && (
          <span className="ml-auto flex items-center gap-2">
            {confirmDelete ? (
              <>
                <span className="text-[13px] text-[var(--text-muted)]">Delete for good?</span>
                <button type="button" onClick={remove} disabled={pending} className={btnDanger}>
                  Delete
                </button>
                <button type="button" onClick={() => setConfirmDelete(false)} className="px-2 text-[13px] underline underline-offset-2">
                  Cancel
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setConfirmDelete(true)} className={btnDanger}>
                Delete
              </button>
            )}
          </span>
        )}
      </div>
    </form>
  );
}

// ── fields ───────────────────────────────────────────────────────────────────

function Label({ f, htmlFor }: { f: Field; htmlFor?: string }) {
  const req = "required" in f && f.required;
  return (
    <label htmlFor={htmlFor} className={labelCls}>
      {f.label}
      {req && <span className="text-[var(--text-muted)]"> *</span>}
    </label>
  );
}

function Hint({ f }: { f: Field }) {
  return "hint" in f && f.hint ? <p className="mt-1.5 text-[12.5px] text-[var(--text-faint)]">{f.hint}</p> : null;
}

const str = (v: unknown) => (v == null ? "" : String(v));
const arr = (v: unknown) => (Array.isArray(v) ? (v as unknown[]).map(str) : []);

function FieldInput({ field: f, value, onChange, episodes }: { field: Field; value: unknown; onChange: (v: unknown) => void; episodes: Episodes }) {
  const id = `f-${f.path.replace(/\W/g, "-")}`;
  switch (f.type) {
    case "text":
      return (
        <div>
          <Label f={f} htmlFor={id} />
          <input id={id} className={input} value={str(value)} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />
          <Hint f={f} />
        </div>
      );
    case "number":
      return (
        <div>
          <Label f={f} htmlFor={id} />
          <input id={id} type="number" className={`${input} max-w-[180px]`} value={str(value)} onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} />
          <Hint f={f} />
        </div>
      );
    case "date":
      return (
        <div>
          <Label f={f} htmlFor={id} />
          <input id={id} type="date" className={`${input} max-w-[220px] [color-scheme:dark]`} value={str(value)} onChange={(e) => onChange(e.target.value)} />
          <Hint f={f} />
        </div>
      );
    case "textarea":
      return (
        <div>
          <Label f={f} htmlFor={id} />
          <textarea id={id} rows={f.rows ?? 3} className={`${input} resize-y`} value={str(value)} onChange={(e) => onChange(e.target.value)} />
          <Hint f={f} />
        </div>
      );
    case "tags":
      return <SplitText f={f} id={id} value={arr(value)} onChange={onChange} join=", " split={(t) => t.split(",")} rows={1} />;
    case "lines":
      return <SplitText f={f} id={id} value={arr(value)} onChange={onChange} join={"\n"} split={(t) => t.split("\n")} rows={5} />;
    case "paragraphs":
      return <SplitText f={f} id={id} value={arr(value)} onChange={onChange} join={"\n\n"} split={(t) => t.split(/\n\s*\n/)} rows={f.rows ?? 6} />;
    case "episode":
      return (
        <div>
          <Label f={f} htmlFor={id} />
          <select id={id} className={`${input} [color-scheme:dark]`} value={str(value)} onChange={(e) => onChange(e.target.value)}>
            <option value="">Choose an episode…</option>
            {episodes.map((e) => (
              <option key={e.slug} value={e.slug}>
                {e.title}
              </option>
            ))}
          </select>
        </div>
      );
    case "youtube":
      return <YouTubeInput f={f} id={id} value={value == null ? null : str(value)} onChange={onChange} />;
    case "image":
      return <ImageInput f={f} id={id} value={str(value)} onChange={onChange} />;
    case "list":
      return <ListInput f={f} value={Array.isArray(value) ? (value as Data[]) : []} onChange={onChange} episodes={episodes} />;
  }
}

/** string[] edited as one text block; keeps what the user typed until it changes upstream */
function SplitText({
  f,
  id,
  value,
  onChange,
  join,
  split,
  rows,
}: {
  f: Field;
  id: string;
  value: string[];
  onChange: (v: unknown) => void;
  join: string;
  split: (t: string) => string[];
  rows: number;
}) {
  const [text, setText] = useState(() => value.join(join));
  const parsed = useMemo(() => split(text).map((s) => s.trim()).filter(Boolean), [text, split]);
  // resync when the upstream value changes from elsewhere (e.g. list reorder)
  const upstream = value.join("\u0000");
  const lastSent = useRef(upstream);
  useEffect(() => {
    if (upstream !== lastSent.current) {
      setText(value.join(join));
      lastSent.current = upstream;
    }
  }, [upstream, value, join]);

  const update = (t: string) => {
    setText(t);
    const next = split(t).map((s) => s.trim()).filter(Boolean);
    lastSent.current = next.join("\u0000");
    onChange(next);
  };

  return (
    <div>
      <Label f={f} htmlFor={id} />
      {rows === 1 ? (
        <input id={id} className={input} value={text} onChange={(e) => update(e.target.value)} placeholder="Comma, separated" />
      ) : (
        <textarea id={id} rows={rows} className={`${input} resize-y leading-relaxed`} value={text} onChange={(e) => update(e.target.value)} />
      )}
      <Hint f={f} />
      {rows > 1 && parsed.length > 0 && (
        <p className="mt-1 text-[12px] text-[var(--text-faint)]">
          {parsed.length} {f.type === "paragraphs" ? "paragraph" : "line"}
          {parsed.length === 1 ? "" : "s"}
        </p>
      )}
    </div>
  );
}

function YouTubeInput({ f, id, value, onChange }: { f: Field; id: string; value: string | null; onChange: (v: unknown) => void }) {
  const [text, setText] = useState(value || "");
  const vid = youtubeId(text);
  return (
    <div>
      <Label f={f} htmlFor={id} />
      <input
        id={id}
        className={input}
        value={text}
        placeholder="https://www.youtube.com/watch?v=…"
        onChange={(e) => {
          setText(e.target.value);
          onChange(youtubeId(e.target.value));
        }}
      />
      <Hint f={f} />
      {text && !vid && <p className="mt-1.5 text-[12.5px] text-[#e5657a]">That doesn&rsquo;t look like a YouTube link.</p>}
      {vid && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`https://i.ytimg.com/vi/${vid}/mqdefault.jpg`} alt="Video thumbnail" className="mt-3 w-[240px] rounded-[8px] border border-[var(--border)]" />
      )}
    </div>
  );
}

function ImageInput({ f, id, value, onChange }: { f: Field; id: string; value: string; onChange: (v: unknown) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setBusy(true);
    setErr("");
    const fd = new FormData();
    fd.set("file", file);
    const r = await uploadMedia(fd);
    setBusy(false);
    if (r.ok && r.url) onChange(r.url);
    else setErr(r.ok ? "Upload failed." : r.error);
  };

  return (
    <div>
      <Label f={f} htmlFor={id} />
      <div className="flex flex-wrap items-center gap-4">
        <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[10px] border border-[var(--border-2)] bg-white/[0.03]">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-[11px] text-[var(--text-faint)]">None</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className={btnGhost}>
            {busy ? "Uploading…" : value ? "Replace" : "Upload"}
          </button>
          {value && (
            <button type="button" onClick={() => onChange("")} className={btnDanger}>
              Remove
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          id={id}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />
      </div>
      <Hint f={f} />
      {err && <p className="mt-1.5 text-[12.5px] text-[#e5657a]">{err}</p>}
    </div>
  );
}

function ListInput({ f, value, onChange, episodes }: { f: Extract<Field, { type: "list" }>; value: Data[]; onChange: (v: unknown) => void; episodes: Episodes }) {
  const update = (i: number, next: Data) => onChange(value.map((it, j) => (j === i ? next : it)));
  const move = (i: number, d: -1 | 1) => {
    const n = [...value];
    [n[i], n[i + d]] = [n[i + d], n[i]];
    onChange(n);
  };
  return (
    <fieldset>
      <legend className={labelCls}>{f.label}</legend>
      <div className="border-t border-[var(--border)]">
        {value.map((item, i) => (
          <div key={i} className="border-b border-[var(--border)] py-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[13px] text-[var(--text-muted)]">
                {f.item} {i + 1}
              </span>
              <span className="flex items-center">
                <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className={iconBtn}>
                  ↑
                </button>
                <button type="button" aria-label="Move down" disabled={i === value.length - 1} onClick={() => move(i, 1)} className={iconBtn}>
                  ↓
                </button>
                <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="ml-2 px-2 text-[13px] text-[#e5657a] hover:underline">
                  Remove
                </button>
              </span>
            </div>
            <div className="flex flex-col gap-4 pl-4">
              {f.fields.map((sf) => (
                <FieldInput
                  key={`${i}-${sf.path}`}
                  field={{ ...sf, path: `${f.path}.${i}.${sf.path}` } as Field}
                  value={getPath(item, sf.path)}
                  onChange={(v) => update(i, setPath(item, sf.path, v))}
                  episodes={episodes}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...value, {}])} className={`${btnGhost} mt-4`}>
        Add {f.item.toLowerCase()}
      </button>
    </fieldset>
  );
}
