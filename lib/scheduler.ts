import { config } from "dotenv"
config({ path: ".env.local" })

import cron from "node-cron"
import { scrapeAllProviders } from "./scraper"
import { normalizeAllProviders } from "./normalizer"
import { saveAllPricingToDB } from "./storage"
import fs from "fs"
import path from "path"

function writeLog(message: string): void {
  const logsDir = path.join(process.cwd(), "logs")
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir)
  const today = new Date().toISOString().split("T")[0]
  const logFile = path.join(logsDir, `${today}.log`)
  const line = `[${new Date().toISOString()}] ${message}\n`
  fs.appendFileSync(logFile, line)
  console.log(message)
}

async function runDailyPipeline() {
  writeLog("=".repeat(50))
  writeLog(`DAILY PIPELINE STARTED — ${new Date().toLocaleString()}`)
  writeLog("=".repeat(50))

  const startTime = Date.now()

  try {
    // Step 1: Scrape
    writeLog("\n📥 STEP 1: SCRAPING ALL PROVIDERS\n")
    const scrapeResults = await scrapeAllProviders()
    const scrapedOk = scrapeResults.filter((r) => r.success).length
    const scrapedFailed = scrapeResults.filter((r) => !r.success).length
    writeLog(`Scraping complete: ${scrapedOk} succeeded, ${scrapedFailed} failed`)

    if (scrapedFailed > 0) {
      scrapeResults
        .filter((r) => !r.success)
        .forEach((r) => writeLog(`  ✗ ${r.provider}: ${r.error}`))
    }

    // Step 2: Normalize
    writeLog("\n🧠 STEP 2: NORMALIZING\n")
    const normalized = await normalizeAllProviders(scrapeResults)
    writeLog(`Normalization complete: ${normalized.length}/${scrapeResults.length} succeeded`)

    // Step 3: Save (replaces all existing data)
    writeLog("\n💾 STEP 3: SAVING TO MONGODB\n")
    await saveAllPricingToDB(normalized)

    const duration = ((Date.now() - startTime) / 1000).toFixed(1)
    writeLog(`\n✅ PIPELINE COMPLETE in ${duration}s`)
    writeLog(`Scraped: ${scrapedOk}/${scrapeResults.length}`)
    writeLog(`Normalized: ${normalized.length}/${scrapeResults.length}`)
    writeLog(`Saved: ${normalized.length} providers`)

  } catch (error) {
    writeLog(`\n❌ PIPELINE CRASHED: ${error instanceof Error ? error.message : error}`)
  }
}

// Run immediately on startup so you don't wait 24h for first run
writeLog("Scheduler starting — running pipeline now...")
runDailyPipeline()

// Then schedule to run every 24 hours at 2:00 AM
// Cron format: minute hour day month weekday
cron.schedule("0 2 * * *", () => {
  writeLog("⏰ Scheduled trigger fired")
  runDailyPipeline()
}, {
  timezone: "Asia/Kolkata" // IST — change to your timezone if needed
})

writeLog("✓ Scheduler running — next run at 2:00 AM IST daily")
writeLog("  Keep this process alive to maintain the schedule")
writeLog("  Press Ctrl+C to stop")