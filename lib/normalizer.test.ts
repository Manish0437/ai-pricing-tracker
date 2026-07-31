import { scrapeAllProviders } from "./scraper"
import { normalizeAllProviders } from "./normalizer"

async function test() {
  // Scrape just the first 2 providers for a quick test
  const { providers } = await import("./providers")
  const testProviders = providers.slice(0, 2)

  const { scrapeAllProviders: scrape } = await import("./scraper")

  // Temporarily override providers list for test
  const results = await scrapeAllProviders()
  const subset = results.slice(0, 2)

  console.log("\n--- Raw scrape output ---")
  subset.forEach((r) => console.log(`${r.provider}: ${r.rawText.slice(0, 200)}\n`))

  console.log("\n--- Normalized output ---")
  const normalized = await normalizeAllProviders(subset)
  console.log(JSON.stringify(normalized, null, 2))
}

test()