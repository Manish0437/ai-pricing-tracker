import { config } from "dotenv"
config({ path: ".env.local" })

import cron from "node-cron"
import { scrapeAllProviders } from "./scraper"
import { normalizeAllProviders } from "./normalizer"
import { saveAllPricingToDB } from "./storage"
import { disconnectDB } from "./db"
import fs from "fs"
import path from "path"

function writeLog(message: string): void {
  console.log(`[${new Date().toISOString()}] ${message}`)

  // Only write to file locally — Railway captures stdout automatically
  if (process.env.NODE_ENV !== "production") {
    const logsDir = path.join(process.cwd(), "logs")
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir)
    const today = new Date().toISOString().split("T")[0]
    const logFile = path.join(logsDir, `${today}.log`)
    fs.appendFileSync(logFile, message + "\n")
  }
}

async function runDailyPipeline() {
  writeLog("=".repeat(50))
  writeLog(`DAILY PIPELINE STARTED — ${new Date().toLocaleString()}`)
  writeLog("=".repeat(50))

  const startTime = Date.now()

  try {
    writeLog("📥 STEP 1: SCRAPING")
    const scrapeResults = await scrapeAllProviders()
    const scrapedOk = scrapeResults.filter((r) => r.success).length
    writeLog(`Scraping complete: ${scrapedOk}/${scrapeResults.length}`)

    writeLog("🧠 STEP 2: NORMALIZING")
    const normalized = await normalizeAllProviders(scrapeResults)
    writeLog(`Normalization complete: ${normalized.length}/${scrapeResults.length}`)

    writeLog("💾 STEP 3: SAVING TO MONGODB")
    await saveAllPricingToDB(normalized)
    await disconnectDB()

    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)
    writeLog(`✅ PIPELINE COMPLETE in ${duration} minutes`)
    writeLog(`Saved: ${normalized.length} providers`)

  } catch (error) {
    writeLog(`❌ PIPELINE FAILED: ${error instanceof Error ? error.message : error}`)
  }
}

// Run once immediately on startup
writeLog("🚀 Scheduler service starting...")
runDailyPipeline()

// Then run every day at 10:30 AM IST
cron.schedule("30 10 * * *", () => {
  writeLog("⏰ Daily trigger fired")
  runDailyPipeline()
}, {
  timezone: "Asia/Kolkata"
})

writeLog("✓ Scheduler running — next run at 10:30 AM IST")