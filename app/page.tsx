import type { Metadata } from "next";
import Hero from "../components/sections/Hero";
import WhatIsOBC from "../components/sections/WhatIsOBC";
import Features from "../components/sections/Features";
import Credibility from "../components/sections/Credibility";
import UseCases from "../components/sections/UseCases";
import Benefits from "../components/sections/Benefits";
import Pricing from "../components/sections/Pricing";
import Integrations from "../components/sections/Integrations";
import FAQ from "../components/sections/FAQ";
import CTA from "../components/sections/CTA";
import { getEpisodes, getFaqs, getPartners, getQuotes, getStats } from "../lib/content";
import { OG_IMAGE } from "../lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/", images: [OG_IMAGE] },
};

export default async function Home() {
  const [faqs, partners, quotes, stats, episodes] = await Promise.all([
    getFaqs(),
    getPartners(),
    getQuotes(),
    getStats(),
    getEpisodes(),
  ]);
  const ep = episodes[0];
  const teaser = ep
    ? { slug: ep.slug, title: ep.title, excerpt: ep.excerpt, guest: ep.guest, videoId: ep.videoId, lessonCount: ep.lessons.length }
    : undefined;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Hero partners={partners} />
      <WhatIsOBC />
      <Features />
      <Credibility stats={stats} quotes={quotes} />
      <UseCases partnerNames={partners.map((p) => p.name)} />
      <Benefits members={stats.members} />
      <Pricing latest={teaser} />
      <Integrations partners={partners} />
      <FAQ faqs={faqs} />
      <CTA />
    </main>
  );
}
