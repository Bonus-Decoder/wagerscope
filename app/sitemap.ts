import type { MetadataRoute } from "next";
import { getCasinoSlugs } from "@/lib/casinos";

const BASE_URL = "https://wagerscope.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/casino`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/guides/best-crypto-casino-nigeria`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/guides/best-crypto-casino-kenya`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/guides/wagering-requirements-explained`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  const casinoPages: MetadataRoute.Sitemap = getCasinoSlugs().map((slug) => ({
    url: `${BASE_URL}/casino/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...casinoPages];
}
