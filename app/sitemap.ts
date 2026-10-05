import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/site";
import { getEpisodes, getPosts } from "../lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [episodes, blogPosts] = await Promise.all([getEpisodes(), getPosts()]);
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "", priority: 1.0, freq: "weekly" as const },
    { path: "/events", priority: 0.8, freq: "weekly" as const },
    { path: "/podcast", priority: 0.8, freq: "weekly" as const },
    { path: "/partners", priority: 0.7, freq: "monthly" as const },
    { path: "/contact", priority: 0.6, freq: "monthly" as const },
    { path: "/privacy", priority: 0.2, freq: "yearly" as const },
    { path: "/terms", priority: 0.2, freq: "yearly" as const },
    { path: "/imprint", priority: 0.2, freq: "yearly" as const },
  ].map(({ path, priority, freq }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  }));

  const episodeRoutes: MetadataRoute.Sitemap = episodes.map((e) => ({
    url: `${SITE_URL}/podcast/${e.slug}`,
    lastModified: new Date(e.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const postRoutes: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${SITE_URL}/podcast/${p.episodeSlug}/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...episodeRoutes, ...postRoutes];
}
