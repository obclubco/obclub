"use client";

import { useState } from "react";
import { Reveal } from "../ui/motion";
import { Arrow } from "../ui/primitives";
import { Check } from "../ui/icons";
import Select from "../ui/Select";
import Consent from "../ui/Consent";
import { CONSENT_TEXT_CONTACT } from "../../lib/legal";

const INTENTS = [
  "Join the community",
  "Partner with OB Club",
  "Come on the podcast",
  "Something else",
];

const EMAIL = "hello@obclub.co";

type Status = "idle" | "submitting" | "success" | "error";

const inputCls =
  "w-full rounded-[10px] border border-[var(--border-2)] bg-transparent px-4 py-3 text-[15px] text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none transition-colors duration-300 focus:border-white/60";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    intent: "Join the community",
    message: "",
    company: "", // honeypot: stays empty for real people
  });
  const [consent, setConsent] = useState(false);

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const [tried, setTried] = useState(false);
  const missing = [
    form.name.trim().length > 1 ? null : "your name",
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email) ? null : "a valid email",
    form.message.trim().length > 4 ? null : "a short message",
  ].filter(Boolean) as string[];
  if (!consent) missing.push("your consent (tick the box)");
  const valid = missing.length === 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    if (!valid) {
      setTried(true);
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, consent, page: window.location.pathname }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <Reveal>
        <div role="status" className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-[var(--border-2)] p-10 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-[var(--bg)]">
            <Check className="h-6 w-6" strokeWidth={2.4} />
          </span>
          <h3 className="serif mt-5 text-[24px] font-bold">Message on its way.</h3>
          <p className="mt-2 max-w-[36ch] text-[15px] text-[var(--text-muted)]">
            We reply to everything, usually within a day. Prefer real-time? Join the
            community and say hello there.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-6 text-[13px] text-[var(--text-faint)] underline-offset-4 hover:text-[var(--text)] hover:underline"
          >
            Send another
          </button>
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={form.company}
          onChange={set("company")}
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[12px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
              Name
            </span>
            <input
              className={inputCls}
              value={form.name}
              onChange={set("name")}
              placeholder="Your name"
              autoComplete="name"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[12px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
              Email
            </span>
            <input
              className={inputCls}
              value={form.email}
              onChange={set("email")}
              placeholder="you@company.com"
              type="email"
              autoComplete="email"
            />
          </label>
        </div>

        <div className="block">
          <span className="mb-1.5 block text-[12px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
            I'm reaching out to
          </span>
          <Select
            options={INTENTS}
            value={form.intent}
            onChange={(v) => setForm((f) => ({ ...f, intent: v }))}
          />
        </div>

        <label className="block">
          <span className="mb-1.5 block text-[12px] uppercase tracking-[0.14em] text-[var(--text-faint)]">
            Message
          </span>
          <textarea
            className={`${inputCls} min-h-[130px] resize-y`}
            value={form.message}
            onChange={set("message")}
            placeholder="Tell us a little about you and what you're building."
          />
        </label>

        <Consent text={CONSENT_TEXT_CONTACT} checked={consent} onChange={setConsent} invalid={tried && !consent} />

        {tried && !valid && (
          <p role="alert" className="text-[13px] text-[var(--color-danger,#e5657a)]">
            Please add {missing.length > 1 ? `${missing.slice(0, -1).join(", ")} and ${missing.at(-1)}` : missing[0]}.
          </p>
        )}

        {status === "error" && (
          <p role="alert" className="text-[13px] text-[var(--color-danger,#e5657a)]">
            Something went wrong. Email us directly at{" "}
            <a href={`mailto:${EMAIL}`} className="underline underline-offset-2">
              {EMAIL}
            </a>
            .
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-[10px] bg-[var(--accent-btn)] px-6 py-3 text-[15px] font-medium text-[var(--accent-btn-fg)] shadow-[0_16px_40px_-24px_rgba(0,0,0,0.9)] transition-all duration-500 ease-[var(--ease-entrance)] disabled:cursor-not-allowed disabled:opacity-45"
        >
          <span
            aria-hidden
            className="absolute inset-0 z-0 translate-y-full bg-[var(--ink)] transition-transform duration-500 ease-[var(--ease-entrance)] group-hover:translate-y-0 group-disabled:translate-y-full"
          />
          <span className="relative z-10 transition-colors duration-500 group-hover:text-white group-disabled:text-[var(--accent-btn-fg)]">
            {status === "submitting" ? "Sending…" : "Send message"}
          </span>
          <Arrow className="relative z-10 transition-transform duration-500 ease-[var(--ease-entrance)] group-hover:translate-x-0.5" />
        </button>
      </form>
    </Reveal>
  );
}
