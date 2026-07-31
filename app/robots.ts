import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/scrape", // don't expose your scrape endpoint
      },
    ],
    sitemap: "https://ai-pricing-tracker-production.up.railway.app/sitemap.xml",
  }
}