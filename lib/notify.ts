import { Resend } from "resend";

// Where notifications land, and who they come from. Set these in the environment
// once the Resend domain is verified. Until RESEND_API_KEY is present, sendNotification
// returns sent:false; the routes then fail the request unless the submission was
// persisted locally, so a lead is never silently dropped.
const FROM = process.env.RESEND_FROM || "OB Club <onboarding@resend.dev>";
const TO = process.env.LEADS_TO || "hello@obclub.co";

export type Notify = {
  subject: string;
  text: string;
  replyTo?: string;
};

export async function sendNotification(
  n: Notify,
): Promise<{ sent: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: false, error: "no_api_key" };

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      subject: n.subject,
      text: n.text,
      ...(n.replyTo ? { replyTo: n.replyTo } : {}),
    });
    if (error) return { sent: false, error: String(error.message || error) };
    return { sent: true };
  } catch (e) {
    return { sent: false, error: e instanceof Error ? e.message : "send_failed" };
  }
}
