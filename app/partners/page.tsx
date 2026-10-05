import type { Metadata } from "next";
import PageHero from "../../components/sections/PageHero";
import Integrations from "../../components/sections/Integrations";
import CTA from "../../components/sections/CTA";
import { Section } from "../../components/ui/primitives";
import { Reveal } from "../../components/ui/motion";
import YouTube from "../../components/ui/YouTube";
import { OG_IMAGE } from "../../lib/site";
import { getPartners } from "../../lib/content";

const WHATSAPP = "https://chat.whatsapp.com/KJfMcHDByFaCrceZFesOp9?mode=gi_t";
const CALENDLY = "https://calendly.com/obclubco/30min";

export const metadata: Metadata = {
  title: "Partners: Brands That Build",
  description:
    "OB Club partners with companies that share our standard, opening doors, perks, and introductions members couldn't reach alone. Become a partner.",
  alternates: { canonical: "/partners" },
  openGraph: {
    title: "Partner With OB Club",
    description:
      "Reach a room of ambitious founders and operators. Partnership perks, venues, and growth, see our partners.",
    url: "/partners",
    type: "website",
    images: [OG_IMAGE],
  },
};

export default async function PartnersPage() {
  const partners = await getPartners();
  return (
    <main>
      <PageHero
        kicker="Our Partners"
        title="Backed by brands that build."
        subtitle="We partner with companies that share our standard. Together we open doors, venues, perks, and introductions, members couldn't open alone."
        primary={{ label: "Become a Partner", href: CALENDLY }}
        secondary={{ label: "Join the club", href: WHATSAPP }}
      />
      <Section className="pb-8">
        <Reveal y={30}>
          <div className="mx-auto max-w-[960px]">
            <YouTube id="39WGvgkhWB8" title="Partner with OB Club" />
          </div>
        </Reveal>
      </Section>
      <Integrations partners={partners} />
      <CTA />
    </main>
  );
}
