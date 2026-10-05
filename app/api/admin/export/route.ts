import { cookies } from "next/headers";
import { verifySessionToken } from "../../../../lib/auth";
import { listLeads } from "../../../../lib/admin-data";

const cell = (v: unknown) => {
  const s = v == null ? "" : String(v);
  // quote everything; neutralise spreadsheet formulas
  return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
};

export async function GET(req: Request) {
  if (!verifySessionToken((await cookies()).get("obc_admin")?.value)) return new Response("Unauthorized", { status: 401 });
  const kind = new URL(req.url).searchParams.get("kind") || undefined;
  const leads = await listLeads({ kind });
  const head = ["date", "type", "name", "email", "intent", "topic", "message", "consent", "page", "status", "notes"];
  const rows = leads.map((l) =>
    [new Date(l.created_at).toISOString(), l.kind, l.name, l.email, l.intent, l.topic, l.message, l.consent ? "yes" : "no", l.page, l.status, l.notes]
      .map(cell)
      .join(","),
  );
  return new Response([head.join(","), ...rows].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="obclub-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
