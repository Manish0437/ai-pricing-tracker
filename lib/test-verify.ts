import { config } from "dotenv"
config({ path: ".env.local" })

import { chromium } from "playwright"
import { normalizeProviderPricing } from "./normalizer"
import { providers } from "./providers"

async function verifyProvider(providerIndex: number) {
  const provider = providers[providerIndex]
  console.log(`\n=== Verifying: ${provider.name} ===\n`)

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    viewport: { width: 1366, height: 768 },
  })
  const page = await context.newPage()

  await page.goto(provider.url, { waitUntil: "domcontentloaded", timeout: 30000 })

  await page.waitForTimeout(3000)
  await page.waitForSelector("table, [class*='pric']", { timeout: 10000 }).catch(() => {
    console.log("  ⚠️ Pricing selector not found within 10s, continuing anyway...")
  })

  const rawText = await page.evaluate(() => {
    const remove = document.querySelectorAll("script, style, nav, footer, header")
    remove.forEach((el) => el.remove())
    return document.body.innerText.trim().slice(0, 8000)
  })

  await browser.close()

  // Print the RAW scraped text so you can read it with your own eyes
  console.log("--- RAW SCRAPED TEXT (read this yourself) ---")
  console.log(rawText.slice(0, 1500))
  console.log("...\n")

  // Now normalize it
  const result = await normalizeProviderPricing({
    provider: provider.name,
    url: provider.url,
    rawText,
    scrapedAt: new Date().toISOString(),
    success: true,
  })

  console.log("\n--- NORMALIZED OUTPUT (compare against raw text above) ---")
  console.log(JSON.stringify(result, null, 2))

  console.log("\n👉 Manually check: does each price in the JSON match what you see on the actual website?")
  console.log(`👉 Visit ${provider.url} yourself and compare`)
}

// Change this index to test different providers (0 = OpenAI, 1 = Anthropic, etc.)
const PROVIDER_INDEX = 1 // Groq — easiest to verify
verifyProvider(PROVIDER_INDEX)