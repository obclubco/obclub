"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import { db } from "../../lib/db";
import { checkCredentials, endSession, requireAdmin, startSession } from "../../lib/auth";
import { KINDS, getPath, isKind, type AdminKind, type Field } from "../../lib/admin-schema";
import { tagFor } from "../../lib/content";
import { getAnalytics, listLeads, type Analytics } from "../../lib/admin-data";
import { rateLimit } from "../../lib/ratelimit";

export type SavedRow = { id: string; data: Record<string, unknown>; sort: number; published: boolean };
type Result = { ok: true; id?: string; url?: string; row?: SavedRow } | { ok: false; error: string };

function requireDb() {
  const sql = db();
  if (!sql) throw new Error("Database is not configured (DATABASE_URL).");
  return sql;
}

// ── auth ─────────────────────────────────────────────────────────────────────

export async function login(_prev: { error?: string } | undefined, form: FormData) {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
  const rl = rateLimit(`login:${ip}`, { limit: 6, windowMs: 5 * 60_000 });
  if (!rl.ok) return { error: "Too many attempts. Try again in a few minutes." };

  const user = String(form.get("user") || "");
  const pw = String(form.get("password") || "");
  if (!checkCredentials(user, pw)) return { error: "Wrong login or password." };
  await startSession(user.trim().toLowerCase());
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin");
}

// ── content ──────────────────────────────────────────────────────────────────

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function validate(kind: AdminKind, data: Record<string, unknown>): string | null {
  const fields = KINDS[kind].fields as Field[];
  for (const f of fields) {
    if ("required" in f && f.required) {
      const v = getPath(data, f.path);
      if (v === undefined || v === null || String(v).trim() === "") return `${f.label} is required.`;
    }
  }
  if ((kind === "episode" || kind === "post") && !SLUG.test(String(data.slug || "")))
    return "URL slug can only use lowercase letters, numbers and dashes.";
  return null;
}

function refresh(kind: AdminKind) {
  revalidateTag(tagFor(kind));
  if (kind === "episode" || kind === "post") revalidatePath("/sitemap.xml");
}

export async function saveEntity(
  kind: string,
  originalId: string | null,
  data: Record<string, unknown>,
  published: boolean,
): Promise<Result> {
  await requireAdmin();
  if (!isKind(kind)) return { ok: false, error: "Unknown type." };
  const def = KINDS[kind];
  const err = validate(kind, data);
  if (err) return { ok: false, error: err };

  const sql = requireDb();
  const derived = def.idOf ? def.idOf(data) : null;
  const id = derived || originalId || randomBytes(5).toString("hex");
  let sortOut = 0;

  try {
    if (id !== originalId) {
      const [clash] = await sql`select 1 from obc_content where kind = ${kind} and id = ${id}`;
      if (clash) return { ok: false, error: "Another item already uses that URL slug." };
    }
    await sql.begin(async (tx) => {
      let sort = 0;
      if (originalId) {
        const [old] = await tx<{ sort: number }[]>`select sort from obc_content where kind = ${kind} and id = ${originalId}`;
        sort = old?.sort ?? 0;
        if (originalId !== id) await tx`delete from obc_content where kind = ${kind} and id = ${originalId}`;
      } else {
        const [m] = await tx<{ m: number | null }[]>`select min(sort) as m from obc_content where kind = ${kind}`;
        sort = (m?.m ?? 1) - 1; // new items go to the top
      }
      sortOut = sort;
      await tx`
        insert into obc_content (kind, id, data, sort, published, updated_at)
        values (${kind}, ${id}, ${tx.json(data as never)}, ${sort}, ${published}, now())
        on conflict (kind, id) do update
          set data = excluded.data, published = excluded.published, updated_at = now()`;
      // an episode slug change keeps its linked articles linked
      if (kind === "episode" && originalId && originalId !== id) {
        await tx`
          update obc_content set data = jsonb_set(data, '{episodeSlug}', to_jsonb(${id}::text)), updated_at = now()
          where kind = 'post' and data->>'episodeSlug' = ${originalId}`;
      }
    });
  } catch (e) {
    console.error("[admin] save failed", e);
    return { ok: false, error: "Could not save. Please try again." };
  }
  refresh(kind);
  if (kind === "episode") refresh("post");
  return { ok: true, id, row: { id, data, sort: sortOut, published } };
}

export async function deleteEntity(kind: string, id: string): Promise<Result> {
  await requireAdmin();
  if (!isKind(kind)) return { ok: false, error: "Unknown type." };
  await requireDb()`delete from obc_content where kind = ${kind} and id = ${id}`;
  refresh(kind);
  return { ok: true };
}

export async function setPublished(kind: string, id: string, published: boolean): Promise<Result> {
  await requireAdmin();
  if (!isKind(kind)) return { ok: false, error: "Unknown type." };
  await requireDb()`update obc_content set published = ${published}, updated_at = now() where kind = ${kind} and id = ${id}`;
  refresh(kind);
  return { ok: true };
}

/** Persist a full list order (the admin reorders locally, then sends the ids). */
export async function reorderEntities(kind: string, ids: string[]): Promise<Result> {
  await requireAdmin();
  if (!isKind(kind)) return { ok: false, error: "Unknown type." };
  const sql = requireDb();
  await sql`
    update obc_content c set sort = o.n
    from unnest(${ids}::text[]) with ordinality as o(id, n)
    where c.kind = ${kind} and c.id = o.id`;
  refresh(kind);
  return { ok: true };
}

/** Fresh numbers + leads for the overview (the "Refresh" button). */
export async function loadDashboard(): Promise<{ analytics: Analytics | null; leads: Awaited<ReturnType<typeof listLeads>> }> {
  await requireAdmin();
  const [analytics, leads] = await Promise.all([getAnalytics(), listLeads()]);
  return { analytics, leads };
}

// ── media ────────────────────────────────────────────────────────────────────

const MIME_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/avif": "avif",
};

export async function uploadMedia(form: FormData): Promise<Result> {
  await requireAdmin();
  const file = form.get("file");
  if (!(file instanceof File)) return { ok: false, error: "No file." };
  const ext = MIME_EXT[file.type];
  if (!ext) return { ok: false, error: "Use a PNG, JPG, WebP, AVIF or SVG image." };
  if (file.size > 2 * 1024 * 1024) return { ok: false, error: "Image must be under 2 MB." };
  const id = `${randomBytes(8).toString("hex")}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await requireDb()`insert into obc_media (id, mime, bytes) values (${id}, ${file.type}, ${bytes})`;
  return { ok: true, url: `/api/media/${id}` };
}

// ── leads ────────────────────────────────────────────────────────────────────

export async function updateLead(id: string, patch: { status?: string; notes?: string }): Promise<Result> {
  await requireAdmin();
  const status = patch.status && ["new", "contacted", "done"].includes(patch.status) ? patch.status : null;
  const notes = typeof patch.notes === "string" ? patch.notes.slice(0, 5000) : null;
  await requireDb()`
    update obc_leads set
      status = coalesce(${status}, status),
      notes  = coalesce(${notes}, notes)
    where id = ${id}::bigint`;
  return { ok: true };
}

export async function deleteLead(id: string): Promise<Result> {
  await requireAdmin();
  await requireDb()`delete from obc_leads where id = ${id}::bigint`;
  return { ok: true };
}
