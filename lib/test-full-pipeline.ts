import { config } from "dotenv"
config({ path: ".env.local" })

import { chromium } from "playwright"
import { normalizeProviderPricing } from "./normalizer"
import { savePricingToDB } from "./storage"
import { disconnectDB } from "./db"
import { providers } from "./providers"

async function runPipelineForProvider(providerIndex: number) {
  const provider = providers[providerIndex]
  console.log(`\n=== Running full pipeline: ${provider.name} ===`)

  // 1. Scrape
  console.log("Step 1: Scraping...")
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    viewport: { width: 1366, height: 768 },
  })
  const page = await context.newPage()
  await page.goto(provider.url, { waitUntil: "domcontentloaded", timeout: 45000 })
  await page.waitForTimeout(3000) // let JS render the pricing content

  if (provider.waitForSelector) {
    await page.waitForSelector(provider.waitForSelector, { timeout: 10000 }).catch(() => {
      console.log(`  ⚠️ Selector '${provider.waitForSelector}' not found, continuing anyway...`)
    })
  }

  const rawText = await page.evaluate(() => {
    const remove = document.querySelectorAll("script, style, nav, footer, header")
    remove.forEach((el) => el.remove())
    return document.body.innerText.trim().slice(0, 8000)
  })
  await browser.close()
  console.log(`  ✓ Scraped ${rawText.length} chars`)

  // 2. Normalize
  console.log("Step 2: Normalizing...")
  const normalized = await normalizeProviderPricing({
    provider: provider.name,
    url: provider.url,
    rawText,
    scrapedAt: new Date().toISOString(),
    success: true,
  })

  if (!normalized) {
    console.log("  ✗ Normalization failed — stopping")
    return
  }
  console.log(`  ✓ Extracted ${normalized.models.length} models`)

  // 3. Save to MongoDB
  console.log("Step 3: Saving to MongoDB...")
  const { saved, warnings } = await savePricingToDB(normalized)

  if (saved) {
    console.log("  ✓ Saved successfully!")
  } else {
    console.log("  ✗ Save failed")
  }

  if (warnings.length > 0) {
    console.log("  ⚠️  Warnings:")
    warnings.forEach((w) => console.log(`     ${w}`))
  }

  await disconnectDB()
}

// Change this index to test different providers
const PROVIDER_INDEX = 1 // Groq — simplest site, good first test
runPipelineForProvider(PROVIDER_INDEX)