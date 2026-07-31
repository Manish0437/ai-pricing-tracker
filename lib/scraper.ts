import { chromium, Browser, Page } from "playwright"
import { Provider, providers } from "./providers"
import fs from "fs"
import path from "path"

export interface ScrapeResult {
  provider: string
  url: string
  rawText: string
  scrapedAt: string
  success: boolean
  error?: string
}

// Stealth headers that make requests look like a real browser
const STEALTH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept":
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
  "Pragma": "no-cache",
}

// Wait between requests (ms) — looks human, avoids rate limits
const DELAY_MIN = 4000
const DELAY_MAX = 8000

function randomDelay(min: number, max: number): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function writeLog(message: string): void {
  const logsDir = path.join(process.cwd(), "logs")
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir)

  const today = new Date().toISOString().split("T")[0]
  const logFile = path.join(logsDir, `${today}.log`)
  const line = `[${new Date().toISOString()}] ${message}\n`

  fs.appendFileSync(logFile, line)
  console.log(message)
}

async function scrapePage(
  page: Page,
  provider: Provider
): Promise<ScrapeResult> {
  const scrapedAt = new Date().toISOString()

  try {
    writeLog(`Scraping ${provider.name}...`)

    // Set stealth headers on every request
    await page.setExtraHTTPHeaders(STEALTH_HEADERS)

    // Set realistic viewport
    await page.setViewportSize({ width: 1366, height: 768 })

    // Navigate and wait for network to settle
    await page.goto(provider.url, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    })

    await page.waitForTimeout(5000)
    // Wait for the pricing content to appear if selector provided
    if (provider.waitForSelector) {
      await page.waitForSelector(provider.waitForSelector, {
        timeout: 10000,
      }).catch(() => {
        // Selector not found — page may have loaded differently, continue anyway
        writeLog(`  Warning: selector '${provider.waitForSelector}' not found on ${provider.name}, continuing...`)
      })
    }

    // Scroll to load any lazy content
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
    await page.waitForTimeout(1000)

    // Extract only visible text from the page body
    // We strip scripts, styles, nav, footer to keep it clean for the LLM
    const rawText = await page.evaluate(() => {
    const remove = document.querySelectorAll(
      "script, style, nav, footer, header, noscript, svg, img"
    )
    remove.forEach((el) => el.remove())
    return document.body.innerText
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .slice(0, 8000)
  })

  // Sanity check — if pricing keywords are missing, the page probably didn't render correctly
  const hasPricingContent = /\$|per token|per million|MTok|1M tokens/i.test(rawText)
  if (!hasPricingContent) {
    writeLog(`  ⚠️  ${provider.name} — no pricing content detected in extracted text, may have loaded incorrectly`)
  }

  writeLog(`  ✓ ${provider.name} — ${rawText.length} chars extracted`)
    return {
      provider: provider.name,
      url: provider.url,
      rawText,
      scrapedAt,
      success: true,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    writeLog(`  ✗ ${provider.name} failed: ${message}`)

    return {
      provider: provider.name,
      url: provider.url,
      rawText: "",
      scrapedAt,
      success: false,
      error: message,
    }
  }
}

// export async function scrapeAllProviders(): Promise<ScrapeResult[]> {
//   writeLog("=== Scrape run started ===")

//   const browser: Browser = await chromium.launch({
//     headless: true,
//     args: [
//       "--no-sandbox",
//       "--disable-setuid-sandbox",
//       "--disable-blink-features=AutomationControlled", // hides automation flag
//     ],
//   })

//   const results: ScrapeResult[] = []

//   try {
//     for (const provider of providers) {
//       // Each provider gets a fresh page context — isolates cookies/state
//       const context = await browser.newContext({
//         userAgent: STEALTH_HEADERS["User-Agent"],
//         viewport: { width: 1366, height: 768 },
//         locale: "en-US",
//         timezoneId: "America/New_York",
//         geolocation: { longitude: -73.935242, latitude: 40.730610 },
//         permissions: ["geolocation"],
//       })

//       const page = await context.newPage()
//       const result = await scrapePage(page, provider)
//       results.push(result)

//       await context.close()

//       // Delay between providers
//       await randomDelay(DELAY_MIN, DELAY_MAX)
//     }
//   } finally {
//     await browser.close()
//   }

//   const succeeded = results.filter((r) => r.success).length
//   const failed = results.filter((r) => !r.success).length
//   writeLog(`=== Scrape run complete: ${succeeded} succeeded, ${failed} failed ===`)

//   return results
// }



export async function scrapeAllProviders(): Promise<ScrapeResult[]> {
  writeLog("=== Scrape run started ===")
  const results: ScrapeResult[] = []

  for (let i = 0; i < providers.length; i++) {
    // Restart browser every 5 providers to free socket resources
    if (i % 5 === 0) {
      if (i > 0) writeLog("  ↻ Restarting browser to free resources...")
    }

    const browser: Browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
        "--max-connections-per-host=5", // ← limit concurrent connections
      ],
    })

    try {
      const context = await browser.newContext({
        userAgent: STEALTH_HEADERS["User-Agent"],
        viewport: { width: 1366, height: 768 },
        locale: "en-US",
        timezoneId: "America/New_York",
        geolocation: { longitude: -73.935242, latitude: 40.730610 },
        permissions: ["geolocation"],
      })

      const page = await context.newPage()
      const result = await scrapePage(page, providers[i])
      results.push(result)
      await context.close()
    } finally {
      await browser.close() // close after every provider, not at the end
    }

    await randomDelay(DELAY_MIN, DELAY_MAX)
  }

  const succeeded = results.filter((r) => r.success).length
  const failed = results.filter((r) => !r.success).length
  writeLog(`=== Scrape run complete: ${succeeded} succeeded, ${failed} failed ===`)
  return results
}