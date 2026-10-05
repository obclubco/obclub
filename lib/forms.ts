// Form submissions for the static (GitHub Pages) site. There is no server, so
// forms post to a hosted form backend set at build time:
//   NEXT_PUBLIC_FORM_ENDPOINT=https://formspree.io/f/<id>
// Without it, the visitor's email app opens with the message prefilled instead.

export const CONTACT_EMAIL = "hello@obclub.co";

const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || "";

export type Submission = {
  subject: string;
  email: string;
  fields: Record<string, string | boolean | undefined>;
  /** Hidden honeypot field: real people leave it empty. */
  honeypot?: string;
};

/** Returns true when the submission was handed off successfully. */
export async function submitForm(s: Submission): Promise<boolean> {
  // A filled honeypot means a bot: pretend it worked, send nothing.
  if (s.honeypot) return true;

  const data = { ...s.fields, email: s.email, page: window.location.pathname, at: new Date().toISOString() };

  if (!ENDPOINT) {
    const body = Object.entries(data)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(s.subject)}&body=${encodeURIComponent(body)}`;
    return true;
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...data, _subject: s.subject, _replyto: s.email }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
