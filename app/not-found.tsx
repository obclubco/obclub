import type { Metadata } from "next";
import Link from "next/link";
import { Section, Button } from "../components/ui/primitives";
import { ArrowUpRight } from "../components/ui/icons";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page has moved or never existed. Head back to the OB Club homepage.",
  robots: { index: false, follow: true },
};

const links = [
  { label: "Events", href: "/events" },
  { label: "Podcast", href: "/podcast" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <main className="bg-halo relative overflow-hidden">
      <div className="grid-lines" />
      <Section className="flex min-h-[72vh] flex-col items-center justify-center py-32 text-center sm:py-40">
        <p className="kicker text-[var(--text-faint)]">Error 404</p>
        <h1 className="display display-tight mt-6 text-[clamp(72px,16vw,180px)] leading-[0.9]">
          404
        </h1>
        <p className="serif mt-4 text-[clamp(22px,3.4vw,34px)] font-bold">
          This page took a wrong turn.
        </p>
        <p className="mx-auto mt-4 max-w-[46ch] text-[16px] leading-relaxed text-[var(--text-muted)]">
          The link is broken or the page has moved. The homepage is a good place
          to start again.
        </p>

        <div className="mt-9">
          <Button href="/">Back to homepage</Button>
        </div>

        <nav className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group inline-flex items-center gap-1.5 text-[14px] text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
            >
              {l.label}
              <ArrowUpRight className="h-3.5 w-3.5 -translate-x-0.5 transition-transform duration-500 group-hover:translate-x-0" />
            </Link>
          ))}
        </nav>
      </Section>
    </main>
  );
}
