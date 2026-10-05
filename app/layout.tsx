import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SiteChrome from "../components/SiteChrome";
import Footer from "../components/sections/Footer";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  OG_LOCALE,
  OG_IMAGE,
  abs,
} from "../lib/site";

// OBC brand faces, self-hosted (nexobcUI design system)
const remark = localFont({
  src: "../public/fonts/LTRemark-Bold.woff2",
  variable: "--font-serif",
  weight: "700",
  display: "swap",
});

const signage = localFont({
  src: [
    { path: "../public/fonts/1797-SIGNAGE_v2.woff2", weight: "400 500", style: "normal" },
    { path: "../public/fonts/1797-BOLD_V2.woff2", weight: "600 800", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}: ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "business",
  keywords: [
    "OB Club",
    "entrepreneur network",
    "founder community",
    "networking events",
    "private business community",
    "online entrepreneurs",
    "business podcast",
    "Behind the Business podcast",
    "Riga entrepreneurs",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: OG_LOCALE,
    url: SITE_URL,
    title: `${SITE_NAME}: ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME}: ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

// Site-wide structured data (GEO / rich results): who the organization is and
// the website it publishes. Page-level schema (PodcastEpisode, Article, FAQPage)
// lives on the individual routes.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: "OBC",
  url: SITE_URL,
  logo: abs("/icon.png"),
  image: abs("/og"),
  description: SITE_DESCRIPTION,
  foundingDate: "2026",
  areaServed: "Worldwide",
  slogan: SITE_TAGLINE,
  sameAs: [
    "https://www.youtube.com/@OBCLUBCO",
    "https://www.instagram.com/obclub.co",
    "https://www.facebook.com/obclub.co",
    "https://www.tiktok.com/@obclub.co",
    "https://open.spotify.com/show/033yWokMpeBTTzHrv4ujmS",
  ],
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "en",
  publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${remark.variable} ${signage.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <SiteChrome footer={<Footer />}>{children}</SiteChrome>
      </body>
    </html>
  );
}
