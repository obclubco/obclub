// Lightweight per-IP rate limiter + request helpers for the public form endpoints.
//
// This is an in-memory sliding window. On a single long-lived server it is exact;
// on serverless it is per-instance (so the effective limit is per-instance), which
// still blunts the common abuse case: one client hammering the endpoint. For a
// hard, global guarantee, back this with Upstash/KV or Cloudflare Turnstile later.

type Hit = { count: number; resetAt: number };
const buckets = new Map<string, Hit>();

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const hit = buckets.get(key);
  if (!hit || now > hit.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  hit.count += 1;
  if (hit.count > limit) {
    return { ok: false, retryAfter: Math.ceil((hit.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

// Opportunistic cleanup so the map can't grow unbounded on a long-lived instance.
export function sweep(now = Date.now()): void {
  if (buckets.size < 5000) return;
  for (const [k, v] of buckets) if (now > v.resetAt) buckets.delete(k);
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/** Trim + hard-cap a field so nothing unbounded reaches disk, logs, or email. */
export function clamp(value: unknown, max: number): string {
  return String(value ?? "").trim().slice(0, max);
}
