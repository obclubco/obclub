import "server-only";
import { createHmac, scryptSync, timingSafeEqual, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Single-account admin. Credentials live in env only:
//   ADMIN_USER           login name (default "ob")
//   ADMIN_PASSWORD_HASH  "scrypt:<saltHex>:<hashHex>"  (make with scripts/hash-password.ts)
//   ADMIN_SECRET         random string that signs the session cookie
const COOKIE = "obc_admin";
const MAX_AGE = 60 * 60 * 24 * 14; // 14 days

function secret(): string {
  const s = process.env.ADMIN_SECRET;
  if (!s || s.length < 32) throw new Error("ADMIN_SECRET must be set (32+ chars)");
  return s;
}

export function hashPassword(pw: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(pw, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt:${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function checkCredentials(user: string, pw: string): boolean {
  const expectedUser = process.env.ADMIN_USER || "ob";
  const stored = process.env.ADMIN_PASSWORD_HASH || "";
  const [algo, saltHex, hashHex] = stored.split(":");
  if (algo !== "scrypt" || !saltHex || !hashHex) return false;
  const actual = scryptSync(pw, Buffer.from(saltHex, "hex"), 64, { N: 16384, r: 8, p: 1 });
  const expected = Buffer.from(hashHex, "hex");
  const userOk = user.trim().toLowerCase() === expectedUser.toLowerCase();
  return userOk && expected.length === actual.length && timingSafeEqual(expected, actual);
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function makeSessionToken(user: string): string {
  const payload = Buffer.from(JSON.stringify({ u: user, exp: Date.now() + MAX_AGE * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return null;
  const good = Buffer.from(sign(payload));
  const given = Buffer.from(mac);
  if (good.length !== given.length || !timingSafeEqual(good, given)) return null;
  try {
    const { u, exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && exp > Date.now() ? String(u) : null;
  } catch {
    return null;
  }
}

export async function startSession(user: string) {
  (await cookies()).set(COOKIE, makeSessionToken(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function currentAdmin(): Promise<string | null> {
  return verifySessionToken((await cookies()).get(COOKIE)?.value);
}

/** Gate for admin pages and every admin server action. */
export async function requireAdmin(): Promise<string> {
  const u = await currentAdmin();
  if (!u) redirect("/admin");
  return u;
}
