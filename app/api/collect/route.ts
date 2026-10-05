import { createHash } from "crypto";
import { db } from "../../../lib/db";
import { clientIp, rateLimit } from "../../../lib/ratelimit";

// Cookieless first-party page views. No cookie, no stored IP: a visitor is a
// hash of IP + user agent + a salt that changes every day, so the same person
// can be counted once per day but never tracked across days or sites.
const BOT = /bot|crawl|spider|slurp|preview|lighthouse|headless|monitor|curl|wget/i;

function device(ua: string): string {
  if (/ipad|tablet/i.test(ua)) return "tablet";
  if (/mobi|iphone|android/i.test(ua)) return "mobile";
  return "desktop";
}

function refHost(ref: string, self: string): string | null {
  try {
    const h = new URL(ref).hostname.replace(/^www\./, "");
    return h && h !== self ? h : null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const ua = req.headers.get("user-agent") || "";
  if (BOT.test(ua)) return new Response(null, { status: 204 });
  const ip = clientIp(req);
  if (!rateLimit(`collect:${ip}`, { limit: 60, windowMs: 60_000 }).ok) return new Response(null, { status: 204 });

  const sql = db();
  if (!sql) return new Response(null, { status: 204 });
  try {
    const body = await req.json();
    const path = String(body.path || "").slice(0, 200);
    if (!path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) return new Response(null, { status: 204 });
    const self = new URL(req.url).hostname.replace(/^www\./, "");
    const day = new Date().toISOString().slice(0, 10);
    const salt = process.env.ANALYTICS_SALT || process.env.ADMIN_SECRET || "obc";
    const visitor = createHash("sha256").update(`${salt}|${day}|${ip}|${ua}`).digest("hex").slice(0, 20);
    await sql`insert into obc_pageviews (path, referrer, device, visitor)
              values (${path}, ${refHost(String(body.ref || ""), self)}, ${device(ua)}, ${visitor})`;
  } catch {
    // analytics must never break anything
  }
  return new Response(null, { status: 204 });
}
