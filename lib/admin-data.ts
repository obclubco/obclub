import "server-only";
import { db } from "./db";
import type { AdminKind } from "./admin-schema";

// Uncached reads for the admin (includes drafts). Public pages use lib/content.ts.

export type EntityRow = {
  id: string;
  data: Record<string, unknown>;
  sort: number;
  published: boolean;
  updated_at: Date;
};

export async function listEntities(kind: AdminKind): Promise<EntityRow[]> {
  const sql = db();
  if (!sql) return [];
  return sql<EntityRow[]>`
    select id, data, sort, published, updated_at from obc_content
    where kind = ${kind} order by sort asc, updated_at desc`;
}

/** Every content row, grouped by kind, in one query (the admin loads it all up front). */
export async function listAllContent(): Promise<Record<string, EntityRow[]>> {
  const sql = db();
  if (!sql) return {};
  const rows = await sql<(EntityRow & { kind: string })[]>`
    select kind, id, data, sort, published, updated_at from obc_content order by sort asc, updated_at desc`;
  const out: Record<string, EntityRow[]> = {};
  for (const { kind, ...r } of rows) (out[kind] ||= []).push(r);
  return out;
}

export async function getEntity(kind: AdminKind, id: string): Promise<EntityRow | null> {
  const sql = db();
  if (!sql) return null;
  const [row] = await sql<EntityRow[]>`
    select id, data, sort, published, updated_at from obc_content where kind = ${kind} and id = ${id}`;
  return row ?? null;
}

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
  created_at: Date;
};

export async function listLeads(opts: { kind?: string; status?: string } = {}): Promise<Lead[]> {
  const sql = db();
  if (!sql) return [];
  return sql<Lead[]>`
    select id::text, kind, name, email, intent, topic, message, consent, page, status, notes, created_at
    from obc_leads
    where (${opts.kind ?? null}::text is null or kind = ${opts.kind ?? null})
      and (${opts.status ?? null}::text is null or status = ${opts.status ?? null})
    order by created_at desc limit 1000`;
}

export type Analytics = {
  views7: number;
  unique7: number;
  views30: number;
  unique30: number;
  leads7: number;
  leadsTotal: number;
  newLeads: number;
  daily: { day: string; views: number; unique: number }[];
  topPages: { path: string; views: number }[];
  referrers: { ref: string; views: number }[];
  devices: { device: string; views: number }[];
};

export async function getAnalytics(): Promise<Analytics | null> {
  const sql = db();
  if (!sql) return null;
  const [[totals], daily, topPages, referrers, devices] = await Promise.all([
    sql<Omit<Analytics, "daily" | "topPages" | "referrers" | "devices">[]>`
    select
      (select count(*)::int from obc_pageviews where created_at > now() - interval '7 days') as views7,
      (select count(distinct visitor)::int from obc_pageviews where created_at > now() - interval '7 days') as unique7,
      (select count(*)::int from obc_pageviews where created_at > now() - interval '30 days') as views30,
      (select count(distinct visitor)::int from obc_pageviews where created_at > now() - interval '30 days') as unique30,
      (select count(*)::int from obc_leads where created_at > now() - interval '7 days') as leads7,
      (select count(*)::int from obc_leads) as "leadsTotal",
      (select count(*)::int from obc_leads where status = 'new') as "newLeads"`,
    sql<{ day: string; views: number; unique: number }[]>`
    select to_char(d, 'YYYY-MM-DD') as day,
           count(p.id)::int as views,
           count(distinct p.visitor)::int as unique
    from generate_series(current_date - 29, current_date, interval '1 day') d
    left join obc_pageviews p on p.created_at::date = d::date
    group by d order by d`,
    sql<{ path: string; views: number }[]>`
    select path, count(*)::int as views from obc_pageviews
    where created_at > now() - interval '30 days' group by path order by views desc limit 10`,
    sql<{ ref: string; views: number }[]>`
    select coalesce(nullif(referrer, ''), 'Direct') as ref, count(*)::int as views from obc_pageviews
    where created_at > now() - interval '30 days' group by 1 order by views desc limit 8`,
    sql<{ device: string; views: number }[]>`
    select coalesce(device, 'unknown') as device, count(*)::int as views from obc_pageviews
    where created_at > now() - interval '30 days' group by 1 order by views desc`,
  ]);
  return { ...totals, daily: [...daily], topPages: [...topPages], referrers: [...referrers], devices: [...devices] };
}
