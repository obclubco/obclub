import type { Metadata } from "next";
import PageHero from "../../components/sections/PageHero";
import PodcastIndex from "../../components/sections/PodcastIndex";
import { getEpisodes } from "../../lib/content";
import CTA from "../../components/sections/CTA";
import { Mic } from "../../components/ui/icons";
import { SITE_NAME, OG_IMAGE, abs } from "../../lib/site";

export const metadata: Metadata = {
  title: "Behind the Business Podcast",
  description:
    "Behind the Business: real stories, real numbers, and the exact lessons from founders building in the open. Every episode broken down into takeaways you can use.",
  alternates: { canonical: "/podcast" },
  openGraph: {
    title: "Behind the Business: The OB Club Podcast",
    description:
      "Founder stories broken down into the lessons that actually move a business.",
    url: "/podcast",
    type: "website",
    images: [OG_IMAGE],
  },
};

const podcastJsonLd = {
  "@context": "https://schema.org",
  "@type": "PodcastSeries",
  name: "Behind the Business",
  url: abs("/podcast"),
  description:
    "Real founder stories, real numbers, and the lessons that move a business, from OB Club.",
  publisher: { "@type": "Organization", name: SITE_NAME, url: abs("/") },
};

export default async function PodcastPage() {
  const episodes = await getEpisodes();
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(podcastJsonLd) }}
      />
      <PageHero
        kicker="The Podcast"
        title="Behind the Business."
        subtitle="Real stories, real numbers, real lessons, every episode distilled into the takeaways that actually move a business."
        icon={<Mic className="h-3.5 w-3.5" />}
        primary={{ label: "Join Free Community", href: "https://chat.whatsapp.com/KJfMcHDByFaCrceZFesOp9?mode=gi_t" }}
      />
      <PodcastIndex episodes={episodes} />
      <CTA />
    </main>
  );
}
