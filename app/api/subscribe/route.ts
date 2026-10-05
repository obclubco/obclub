import { NextResponse } from "next/server";
import { sendNotification } from "../../../lib/notify";
import { saveLead } from "../../../lib/leads";
import { CONSENT_TEXT_SUBSCRIBE } from "../../../lib/legal";
import { rateLimit, clientIp, clamp } from "../../../lib/ratelimit";

// Email sign-ups. Stored in obc_leads (visible in /admin/leads) with the consent
// wording the visitor agreed to, and emailed to the team when Resend is set up.
export async function POST(req: Request) {
  try {
    const rl = rateLimit(`subscribe:${clientIp(req)}`, { limit: 5, windowMs: 60_000 });
    if (!rl.ok) {
      return NextResponse.json(
        { ok: false, error: "rate_limited" },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
      );
    }

    const body = await req.json();

    // Honeypot: a filled hidden field means a bot. Silently accept, capture nothing.
    if (clamp(body.company, 1)) return NextResponse.json({ ok: true });

    const email = clamp(body.email, 200).toLowerCase();
    const topic = clamp(body.topic || "general", 120);
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }
    if (body.consent !== true) {
      return NextResponse.json({ ok: false, error: "consent_required" }, { status: 400 });
    }

    const record = {
      email,
      topic,
      at: new Date().toISOString(),
    };

    const saved = await saveLead({
      kind: "subscribe",
      email,
      topic,
      consent: true,
      consentText: CONSENT_TEXT_SUBSCRIBE,
      page: clamp(body.page, 200) || undefined,
    });

    // Notify the team (no-op until RESEND_API_KEY is set).
    const { sent, error } = await sendNotification({
      subject: `New OB Club subscriber (${record.topic})`,
      text: `${record.email} wants updates about: ${record.topic}\n\nSubmitted ${record.at}`,
      replyTo: record.email,
    });

    // Only report success if the submission landed somewhere a human will see it.
    if (!saved && !sent) {
      console.error("[%s] not delivered: %s", "subscribe", error);
      return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 503 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
