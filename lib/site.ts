// Single source of truth for site-level SEO constants. Override the domain per
// environment with NEXT_PUBLIC_SITE_URL (e.g. a preview URL); defaults to prod.

// Primary domain: obclub.co (GitHub Pages redirects www to it).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://obclub.co"
).replace(/\/$/, "");

export const SITE_NAME = "OB Club";

export const SITE_TAGLINE =
  "Where entrepreneurs meet, network, and build real business";

export const SITE_DESCRIPTION =
  "A private, global network for online founders, builders, and operators. Curated in-person events, an active community, and the Behind the Business podcast.";

export const OG_LOCALE = "en_US";

// Default social banner. Next does NOT inherit a parent's openGraph.images once a
// child route defines its own openGraph, so pages spread this into their images.
export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME}: ${SITE_TAGLINE}`,
};

// Absolute URL helper for canonicals, sitemap, and JSON-LD.
export function abs(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
