import { NextResponse } from "next/server";
import { sendNotification } from "../../../lib/notify";
import { saveLead } from "../../../lib/leads";
import { CONSENT_TEXT_CONTACT } from "../../../lib/legal";
import { rateLimit, clientIp, clamp } from "../../../lib/ratelimit";

// Contact-form messages. Stored in obc_leads (visible in /admin/leads) and emailed
// to the team via Resend once RESEND_API_KEY is set.
export async function POST(req: Request) {
  try {
    // Throttle abuse: at most 5 messages per IP per minute.
    const rl = rateLimit(`contact:${clientIp(req)}`, { limit: 5, windowMs: 60_000 });
    if (!rl.ok) {
      return NextResponse.json(
        { ok: false, error: "rate_limited" },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
      );
    }

    const body = await req.json();

    // Honeypot: real users never fill a hidden field. Bots do. Silently accept.
    if (clamp(body.company, 1)) return NextResponse.json({ ok: true });

    const name = clamp(body.name, 100);
    const email = clamp(body.email, 200);
    const intent = clamp(body.intent || "General", 60);
    const message = clamp(body.message, 5000);

    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    if (name.length < 2 || !emailOk || message.length < 5) {
      return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
    }
    if (body.consent !== true) {
      return NextResponse.json({ ok: false, error: "consent_required" }, { status: 400 });
    }

    const record = { name, email, intent, message, at: new Date().toISOString() };

    const saved = await saveLead({
      kind: "contact",
      name,
      email,
      intent,
      message,
      consent: true,
      consentText: CONSENT_TEXT_CONTACT,
      page: clamp(body.page, 200) || undefined,
    });

    const { sent, error } = await sendNotification({
      subject: `OB Club contact: ${intent} (${name})`,
      text: `Name: ${name}\nEmail: ${email}\nIntent: ${intent}\n\n${message}\n\nSubmitted ${record.at}`,
      replyTo: email,
    });

    // Only report success if the submission landed somewhere a human will see it.
    if (!saved && !sent) {
      console.error("[%s] not delivered: %s", "contact", error);
      return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 503 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}
