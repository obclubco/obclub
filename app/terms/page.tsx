import type { Metadata } from "next";
import PageHero from "../../components/sections/PageHero";
import LegalBody from "../../components/sections/LegalBody";
import { OG_IMAGE } from "../../lib/site";
import { COMPANY } from "../../lib/legal";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms for using obclub.co and taking part in the OB Club community, events and podcast. Governed by Latvian law.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Use | OB Club",
    description:
      "The rules for using the OB Club website, community, events and podcast.",
    url: "/terms",
    type: "website",
    images: [OG_IMAGE],
  },
};

const mail = `mailto:${COMPANY.email}`;

export default function TermsPage() {
  return (
    <main>
      <PageHero
        kicker="Legal"
        title="Terms of use."
        subtitle="The ground rules for using this website and taking part in OB Club. Short and in plain English."
      />
      <LegalBody>
        <h2>Who these terms are with</h2>
        <p>
          These terms are an agreement between you and {COMPANY.name},
          registration no. {COMPANY.regNo}, {COMPANY.address} (&quot;OB
          Club&quot;, &quot;we&quot;, &quot;us&quot;). By using{" "}
          {COMPANY.website} you agree to them. If you do not agree, please do
          not use the site. Our <a href="/privacy">privacy policy</a> explains
          how we handle personal data.
        </p>

        <h2>What the site is for</h2>
        <p>
          The website introduces OB Club: a private network for online
          entrepreneurs, founders and operators, with a free WhatsApp
          community, curated in-person events and the Behind the Business
          podcast. The content on the site is for general information only.
        </p>

        <h2>No professional advice</h2>
        <p>
          Nothing on this website, in the podcast, at our events or in the
          community is business, financial, legal, tax or investment advice.
          Do your own research and get advice from a qualified professional
          before making decisions. You act on anything you read or hear at your
          own risk.
        </p>

        <h2>Podcast and guest opinions</h2>
        <p>
          Guests on Behind the Business share their own views and experiences.
          Their opinions are theirs and do not necessarily reflect the views of
          OB Club.
        </p>

        <h2>The community</h2>
        <p>
          Membership of the OB Club WhatsApp community is free. Admission and
          continued membership are at our discretion. We may remove anyone
          whose conduct we consider harmful to the group, for example spam,
          unsolicited selling, harassment or sharing other members&apos;
          information without permission.
        </p>
        <p>
          The community runs on WhatsApp, so WhatsApp&apos;s and Meta&apos;s
          terms also apply. When you join, your phone number and profile are
          visible to other members. Be thoughtful about what you share, as we
          cannot control what other members do with it.
        </p>

        <h2>Events</h2>
        <p>
          Taking part in an OB Club event may be subject to separate terms
          (for example on tickets, cancellations or conduct). Where an event
          has its own terms, they apply in addition to these.
        </p>

        <h2>Third-party services and links</h2>
        <p>
          The site links to and embeds services run by others, such as
          WhatsApp, YouTube and Calendly. We are not responsible for their
          content, availability or practices, and their own terms apply when
          you use them.
        </p>

        <h2>Using the site properly</h2>
        <p>Please do not:</p>
        <ul>
          <li>use the site for anything unlawful;</li>
          <li>send spam, false information or harmful code through our forms;</li>
          <li>
            try to break, overload or gain unauthorised access to the site or
            its systems;
          </li>
          <li>
            scrape or copy the site&apos;s content in bulk without our
            permission.
          </li>
        </ul>

        <h2>Intellectual property</h2>
        <p>
          The OB Club name, logo, website design, text, graphics, videos and
          podcast content belong to OB Club or are used with permission. You
          may view and share links to them for personal, non-commercial use.
          Any other use needs our written permission.
        </p>
        <p>
          Partner names and logos shown on the site belong to their respective
          owners and are shown to identify our partners.
        </p>

        <h2>Availability</h2>
        <p>
          We work to keep the site accurate and online, but we do not promise
          that it will always be available, error free or up to date. We may
          change or remove content, features or pages at any time.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the extent permitted by Latvian law, OB Club is not liable for any
          indirect or consequential loss, or for loss of profit, business or
          data, arising from your use of the website, the community, the
          podcast or the information in them.
        </p>
        <p>
          Nothing in these terms limits liability that cannot be limited by
          law, including liability for intent or gross negligence, or your
          mandatory rights as a consumer.
        </p>

        <h2>Governing law and disputes</h2>
        <p>
          These terms are governed by the laws of the Republic of Latvia.
          Disputes will be settled by the courts of Latvia. If you are a
          consumer living in another EU country, you keep the protection of
          the mandatory consumer laws of that country and may also be able to
          bring a claim there.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          We may update these terms from time to time. The date at the top
          shows the latest version. If you keep using the site after a change
          is published, the updated terms apply.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms? Email{" "}
          <a href={mail}>{COMPANY.email}</a>.
        </p>
      </LegalBody>
    </main>
  );
}
