import type { Metadata } from "next";
import PageHero from "../../components/sections/PageHero";
import LegalBody, { LegalTable } from "../../components/sections/LegalBody";
import { OG_IMAGE } from "../../lib/site";
import { COMPANY, PROCESSORS } from "../../lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How OB Club collects, uses and protects personal data on obclub.co: contact form, email updates, cookieless analytics, and your rights under the GDPR.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | OB Club",
    description:
      "What data OB Club collects, why, how long we keep it, and how to exercise your GDPR rights.",
    url: "/privacy",
    type: "website",
    images: [OG_IMAGE],
  },
};

const mail = `mailto:${COMPANY.email}`;

export default function PrivacyPage() {
  return (
    <main>
      <PageHero
        kicker="Legal"
        title="Privacy policy."
        subtitle="What we collect, why we collect it, and the control you have over it. No cookies for tracking, no ads, no selling data."
      />
      <LegalBody>
        <h2>Who we are</h2>
        <p>
          This website ({COMPANY.website}) is run by {COMPANY.name},
          registration no. {COMPANY.regNo}, {COMPANY.address} (&quot;OB
          Club&quot;, &quot;we&quot;, &quot;us&quot;). We are the controller of
          the personal data described in this policy.
        </p>
        <p>
          For any privacy question or request, email{" "}
          <a href={mail}>{COMPANY.email}</a>.
        </p>

        <h2>What OB Club is</h2>
        <p>
          OB Club is a private network for online entrepreneurs, founders and
          operators. We run a free WhatsApp community, curated in-person events
          (our flagship is in Riga) and the Behind the Business podcast on
          YouTube. This website tells you about all of that and lets you
          contact us or sign up for updates.
        </p>

        <h2>What we do not collect</h2>
        <ul>
          <li>No user accounts or passwords for visitors.</li>
          <li>No payment details.</li>
          <li>No advertising or cross-site tracking cookies.</li>
          <li>No IP addresses in our own analytics.</li>
          <li>We do not sell or rent personal data to anyone.</li>
        </ul>

        <h2>What we collect and why</h2>

        <h3>Contact form</h3>
        <p>
          When you send us a message we collect your name, email address, the
          reason for getting in touch (chosen from a list) and your message. We
          use it to read and reply to your enquiry.
        </p>
        <p>
          <strong>Legal basis:</strong> steps you ask us to take before
          entering into an agreement (GDPR Art. 6(1)(b)), and our legitimate
          interest in answering people who contact us (Art. 6(1)(f)).
        </p>

        <h3>Email updates</h3>
        <p>
          When you ask us to keep you posted we collect your email address and
          the topic you are interested in. We use it to send OB Club updates
          about events, the podcast and the community.
        </p>
        <p>
          <strong>Legal basis:</strong> your consent (Art. 6(1)(a)). You give it
          by ticking the consent box. You can withdraw it at any time by
          replying to any of our emails or writing to{" "}
          <a href={mail}>{COMPANY.email}</a>. Withdrawing does not affect
          emails sent before you did.
        </p>

        <h3>Website analytics</h3>
        <p>
          We use our own first-party, cookieless analytics to understand which
          pages are useful. For each page view we record the page path, the
          referring page, the device type and a hash that rotates daily and is
          salted, so we can count unique visits for one day without recognising
          you across days. We set no cookies for this, store no IP address and
          do no cross-site tracking.
        </p>
        <p>
          <strong>Legal basis:</strong> our legitimate interest in running and
          improving the website (Art. 6(1)(f)).
        </p>

        <h3>Server logs</h3>
        <p>
          Like any website, our hosting provider automatically processes
          technical data such as your IP address, browser type and the time of
          the request in its server logs. This is needed to deliver the site
          and keep it secure.
        </p>
        <p>
          <strong>Legal basis:</strong> our legitimate interest in operating a
          secure website (Art. 6(1)(f)).
        </p>

        <h2>Cookies</h2>
        <p>
          The public website sets no non-essential cookies, so there is no
          cookie banner. The staff-only admin area uses one strictly necessary
          session cookie to keep staff signed in. It is never set for ordinary
          visitors.
        </p>

        <h2>YouTube videos</h2>
        <p>
          Podcast and other videos are embedded through youtube-nocookie.com,
          and the YouTube player only loads after you click play. Before that,
          the video thumbnail is loaded from Google&apos;s image server
          (i.ytimg.com) when the page opens, which means Google receives your
          IP address for that image request. Once you click play, Google&apos;s
          own privacy policy applies to the player:{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            policies.google.com/privacy
          </a>
          .
        </p>

        <h2>WhatsApp community and Calendly</h2>
        <p>
          The WhatsApp community is joined through a public invite link. When
          you join, your phone number and WhatsApp profile become visible to
          other members of the group. The group runs on WhatsApp, so
          WhatsApp&apos;s and Meta&apos;s terms and privacy policy apply to
          everything you share there.
        </p>
        <p>
          The &quot;Become a Partner&quot; button opens Calendly to book a call.
          Anything you enter there is handled under Calendly&apos;s own privacy
          terms.
        </p>

        <h2>Who processes your data for us</h2>
        <p>
          We use a small number of service providers (processors) who handle
          data only on our instructions:
        </p>
        <LegalTable
          head={["Provider", "Purpose", "Location", "Safeguards"]}
          rows={PROCESSORS.map((p) => [
            p.privacyUrl ? (
              <a href={p.privacyUrl} target="_blank" rel="noopener noreferrer">
                {p.name}
              </a>
            ) : (
              p.name
            ),
            p.purpose,
            p.location,
            p.safeguards,
          ])}
        />

        <h2>Transfers outside the EU</h2>
        <p>
          Submissions are stored in a database hosted in the EU, and the website
          is served from an EU region. Some of our providers are companies based
          in the United States. Where personal data may be accessed from or sent
          outside the EU/EEA, we rely on the European Commission&apos;s Standard
          Contractual Clauses. You can ask us for more detail on these
          safeguards.
        </p>

        <h2>How long we keep data</h2>
        <ul>
          <li>
            <strong>Enquiries:</strong> up to 24 months after our last contact
            with you.
          </li>
          <li>
            <strong>Email sign-ups:</strong> until you unsubscribe.
          </li>
          <li>
            <strong>Analytics:</strong> raw events for 13 months, after which
            only aggregated totals are kept.
          </li>
          <li>
            <strong>Server logs:</strong> for the period set by our hosting
            provider.
          </li>
        </ul>

        <h2>Your rights</h2>
        <p>Under the GDPR you have the right to:</p>
        <ul>
          <li>access the personal data we hold about you;</li>
          <li>have inaccurate data corrected;</li>
          <li>have your data erased;</li>
          <li>restrict how we use your data;</li>
          <li>receive your data in a portable format;</li>
          <li>
            object to processing based on our legitimate interests;
          </li>
          <li>withdraw your consent at any time.</li>
        </ul>
        <p>
          To use any of these rights, email <a href={mail}>{COMPANY.email}</a>.
          We will reply within one month. We may ask you to confirm your
          identity before acting on a request.
        </p>
        <p>
          You also have the right to complain to the Latvian Data State
          Inspectorate (Datu valsts inspekcija),{" "}
          <a
            href="https://www.dvi.gov.lv"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.dvi.gov.lv
          </a>
          , or to the data protection authority in the EU country where you
          live or work.
        </p>

        <h2>Automated decisions</h2>
        <p>
          We do not make decisions about you based solely on automated
          processing.
        </p>

        <h2>Children</h2>
        <p>
          This website and OB Club are not directed at anyone under 16, and we
          do not knowingly collect their data. If you believe a child has sent
          us personal data, contact us and we will delete it.
        </p>

        <h2>Security</h2>
        <p>
          The site is served over HTTPS, access to submissions is limited to
          OB Club staff, and our providers protect data with industry-standard
          measures. No system is perfectly secure, but if a breach affects your
          data we will notify you and the authorities as the law requires.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this policy when our practices change. The date at the
          top shows the latest version. If a change is significant, we will
          highlight it on the website or tell subscribers by email.
        </p>

        <h2>Contact</h2>
        <p>
          {COMPANY.name}, {COMPANY.address}.
          <br />
          Email: <a href={mail}>{COMPANY.email}</a>
        </p>
      </LegalBody>
    </main>
  );
}
