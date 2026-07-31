import { config } from "dotenv"
config({ path: ".env.local" })

import { scrapeAllProviders } from "./scraper"
import { normalizeAllProviders } from "./normalizer"
import { saveAllPricingToDB } from "./storage"
import { disconnectDB } from "./db"

async function runFullPipeline() {
  const startTime = Date.now()
  console.log("=".repeat(50))
  console.log("STARTING FULL PRICING PIPELINE")
  console.log("=".repeat(50))

  // Step 1: Scrape all 15 providers
  console.log("\n📥 STEP 1: SCRAPING ALL PROVIDERS\n")
  const scrapeResults = await scrapeAllProviders()

  const scrapedOk = scrapeResults.filter((r) => r.success).length
  const scrapedFailed = scrapeResults.filter((r) => !r.success).length
  console.log(`\nScraping summary: ${scrapedOk} succeeded, ${scrapedFailed} failed`)

  if (scrapedFailed > 0) {
    console.log("Failed providers:")
    scrapeResults
      .filter((r) => !r.success)
      .forEach((r) => console.log(`  - ${r.provider}: ${r.error}`))
  }

  // Step 2: Normalize all successful scrapes
  console.log("\n🧠 STEP 2: NORMALIZING ALL PROVIDERS\n")
  // Add this temporarily to see what each provider's raw text looks like
  scrapeResults.forEach((r) => {
    console.log(`\n--- ${r.provider} (${r.rawText.length} chars) ---`)
    console.log(r.rawText.slice(0, 300))
    console.log("...")
  })

  const normalized = await normalizeAllProviders(scrapeResults)

  // Step 3: Save all normalized results to MongoDB
  console.log("\n💾 STEP 3: SAVING ALL TO MONGODB\n")
  await saveAllPricingToDB(normalized)

  await disconnectDB()

  // Final summary
  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log("\n" + "=".repeat(50))
  console.log("PIPELINE COMPLETE")
  console.log("=".repeat(50))
  console.log(`Total time: ${durationSec}s`)
  console.log(`Scraped: ${scrapedOk}/${scrapeResults.length}`)
  console.log(`Normalized: ${normalized.length}/${scrapeResults.length}`)
  console.log(`Saved to DB: ${normalized.length}/${scrapeResults.length}`)
}

runFullPipeline().catch((error) => {
  console.error("\n❌ PIPELINE CRASHED:", error)
  process.exit(1)
})