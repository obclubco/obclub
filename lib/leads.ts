import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { db } from "./db";

export type LeadInput = {
  kind: "contact" | "subscribe";
  name?: string;
  email: string;
  intent?: string;
  topic?: string;
  message?: string;
  consent: boolean;
  consentText: string;
  page?: string;
};

/**
 * Persist a lead. Database first (shows up in /admin/leads); with no database
 * configured, fall back to a local JSONL file for dev. Returns false only when
 * the lead could not be stored anywhere, so the route can fail loudly.
 */
export async function saveLead(l: LeadInput): Promise<boolean> {
  const sql = db();
  if (sql) {
    try {
      await sql`
        insert into obc_leads (kind, name, email, intent, topic, message, consent, consent_text, page)
        values (${l.kind}, ${l.name ?? null}, ${l.email}, ${l.intent ?? null}, ${l.topic ?? null},
                ${l.message ?? null}, ${l.consent}, ${l.consentText}, ${l.page ?? null})`;
      return true;
    } catch (e) {
      console.error("[leads] db insert failed", e);
    }
  }
  try {
    const dir = path.join(process.cwd(), "data");
    await fs.mkdir(dir, { recursive: true });
    await fs.appendFile(
      path.join(dir, l.kind === "contact" ? "messages.jsonl" : "leads.jsonl"),
      JSON.stringify({ ...l, at: new Date().toISOString() }) + "\n",
      "utf8",
    );
    return true;
  } catch {
    return false; // read-only filesystem and no database
  }
}
