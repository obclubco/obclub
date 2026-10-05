"use client";

import { useState } from "react";
import { Arrow } from "../ui/primitives";
import { Check } from "../ui/icons";
import Consent from "../ui/Consent";
import { CONSENT_TEXT_SUBSCRIBE } from "../../lib/legal";
import { submitForm } from "../../lib/forms";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Inline email capture. Sends the address, topic and the consent wording through
 * lib/forms (Formspree). Consent is required before submitting.
 */
export default function EmailCapture({
  topic,
  cta = "Notify me",
  placeholder = "you@company.com",
  successTitle = "You're on the list.",
  successNote,
  className = "",
}: {
  topic: string;
  cta?: string;
  placeholder?: string;
  successTitle?: string;
  successNote?: string;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState(""); // honeypot: bots fill it, humans never see it
  const [status, setStatus] = useState<Status>("idle");
  const [consent, setConsent] = useState(false);
  const [tried, setTried] = useState(false);
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    if (!valid || !consent) {
      setTried(true);
      return;
    }
    setStatus("submitting");
    const ok = await submitForm({
      subject: `New OB Club subscriber (${topic})`,
      email: email.trim().toLowerCase(),
      fields: { type: "subscribe", topic, consent, consentText: CONSENT_TEXT_SUBSCRIBE },
      honeypot: hp,
    });
    setStatus(ok ? "success" : "error");
  }

  if (status === "success") {
    return (
      <div role="status" className={`flex items-center gap-3 ${className}`}>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-[var(--bg)]">
          <Check className="h-5 w-5" strokeWidth={2.4} />
        </span>
        <div className="text-left">
          <p className="text-[15px] font-medium">{successTitle}</p>
          {successNote && (
            <p className="text-[13.5px] text-[var(--text-muted)]">{successNote}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={`w-full max-w-[440px] ${className}`}>
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          autoComplete="email"
          aria-label="Email address"
          className="min-w-0 flex-1 rounded-full border border-[var(--border-2)] bg-transparent px-5 py-3 text-[15px] text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none transition-colors duration-300 focus:border-white/60"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="group relative inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--accent-btn)] px-6 py-3 text-[15px] font-medium text-[var(--accent-btn-fg)] shadow-[0_16px_40px_-24px_rgba(0,0,0,0.9)] transition-all duration-500 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <span className="relative z-10">{status === "submitting" ? "Adding…" : cta}</span>
          <Arrow className="relative z-10 transition-transform duration-500 group-hover:translate-x-0.5" />
        </button>
      </div>
      <Consent
        text={CONSENT_TEXT_SUBSCRIBE}
        checked={consent}
        onChange={setConsent}
        invalid={tried && !consent}
        className="mt-3"
      />
      {tried && (!valid || !consent) && (
        <p role="alert" className="mt-2 text-[13px] text-[#e5657a]">
          {!valid ? "Please enter a valid email." : "Please tick the box so we can email you."}
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="mt-2 text-[13px] text-[var(--text-faint)]">
          Something went wrong. Email us at{" "}
          <a href="mailto:hello@obclub.co" className="underline underline-offset-2">
            hello@obclub.co
          </a>{" "}
          and we&rsquo;ll add you.
        </p>
      )}
    </form>
  );
}
