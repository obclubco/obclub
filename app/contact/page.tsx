import type { Metadata } from "next";
import PageHero from "../../components/sections/PageHero";
import ContactBlock from "../../components/sections/ContactBlock";
import { OG_IMAGE } from "../../lib/site";

const WHATSAPP = "https://chat.whatsapp.com/KJfMcHDByFaCrceZFesOp9?mode=gi_t";

export const metadata: Metadata = {
  title: "Contact: Join or Partner",
  description:
    "Get in touch with OB Club, join the free community, explore a partnership, or send us a question. The next introduction could change everything.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact OB Club",
    description: "Join the community, partner with the club, or reach out.",
    url: "/contact",
    type: "website",
    images: [OG_IMAGE],
  },
};

export default function ContactPage() {
  return (
    <main>
      <PageHero
        kicker="Contact"
        title="Ready when you are."
        subtitle="Join the free community, reach out about partnering, or just say hello."
        primary={{ label: "Join Free Community", href: WHATSAPP }}
      />
      <ContactBlock />
    </main>
  );
}
