import type { Metadata } from "next";
import PageHero from "../../components/sections/PageHero";
import LegalBody, { LegalTable } from "../../components/sections/LegalBody";
import { OG_IMAGE } from "../../lib/site";
import { COMPANY } from "../../lib/legal";

export const metadata: Metadata = {
  title: "Imprint",
  description:
    "Legal notice for obclub.co: company name, registration number, registered address and contact details of OBCLUB, SIA.",
  alternates: { canonical: "/imprint" },
  openGraph: {
    title: "Imprint | OB Club",
    description: "Company details and contact for the operator of obclub.co.",
    url: "/imprint",
    type: "website",
    images: [OG_IMAGE],
  },
};

const mail = `mailto:${COMPANY.email}`;

export default function ImprintPage() {
  return (
    <main>
      <PageHero
        kicker="Legal"
        title="Imprint."
        subtitle="Who runs this website and how to reach us."
      />
      <LegalBody>
        <h2>Operator of this website</h2>
        <LegalTable
          head={["Detail", "Information"]}
          rows={[
            ["Company", COMPANY.name],
            ["Registration no.", COMPANY.regNo],
            ["Legal address", COMPANY.address],
            ["Email", <a href={mail}>{COMPANY.email}</a>],
            ["Website", <a href={COMPANY.website}>{COMPANY.website}</a>],
          ]}
        />

        <h2>Responsible for content</h2>
        <p>
          {COMPANY.name}, {COMPANY.address}. Contact:{" "}
          <a href={mail}>{COMPANY.email}</a>.
        </p>

        <h2>Liability for links</h2>
        <p>
          This website links to external sites such as WhatsApp, YouTube and
          Calendly. We have no control over their content and are not
          responsible for it. If we learn that a linked page is unlawful, we
          will remove the link.
        </p>

        <h2>More legal information</h2>
        <p>
          See our <a href="/privacy">privacy policy</a> and{" "}
          <a href="/terms">terms of use</a>.
        </p>
      </LegalBody>
    </main>
  );
}
