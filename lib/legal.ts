// Legal facts shared by /privacy, /terms, /imprint and the form consent labels.
//
// NOTE: this text was drafted without a lawyer. It is a starting point, not legal
// advice. Have the privacy policy, terms and consent wording reviewed by a
// qualified lawyer (Latvian / EU GDPR) before relying on it.

export const LAST_UPDATED = "2026-09-25";

export const COMPANY = {
  name: "OBCLUB, SIA",
  brand: "OB Club",
  regNo: "40203708734",
  address: "Mārupes nov., Mārupe, Lapiņu dambis 6, LV-2167, Latvia",
  email: "hello@obclub.co",
  website: "https://www.obclub.co",
} as const;

export type Processor = {
  name: string;
  purpose: string;
  location: string;
  safeguards: string;
  privacyUrl?: string;
};

// Edit this list when a provider is added, removed or replaced.
export const PROCESSORS: Processor[] = [
  {
    name: "Vercel Inc.",
    purpose: "Website hosting and server logs",
    location: "EU region (company based in the US)",
    safeguards: "Standard Contractual Clauses",
    privacyUrl: "https://vercel.com/legal/privacy-policy",
  },
  {
    name: "Neon (Databricks)",
    purpose: "Database for contact form and email sign-up submissions",
    location: "EU region, Frankfurt (company based in the US)",
    safeguards: "Standard Contractual Clauses",
    privacyUrl: "https://www.databricks.com/legal/privacynotice",
  },
  {
    name: "Resend",
    purpose: "Email notifications about new submissions (optional)",
    location: "US",
    safeguards: "Standard Contractual Clauses",
    privacyUrl: "https://resend.com/legal/privacy-policy",
  },
];

// Checkbox labels. The calling code swaps {privacy} for a link to /privacy.
export const CONSENT_TEXT_SUBSCRIBE =
  "I agree to OB Club emailing me about events, the podcast and the community, and I've read the {privacy}. Unsubscribe anytime.";

export const CONSENT_TEXT_CONTACT =
  "I agree to OB Club using these details to reply to my message, as described in the {privacy}.";

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
