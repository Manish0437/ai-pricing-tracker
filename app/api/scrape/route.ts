import { NextRequest, NextResponse } from "next/server"
import { scrapeAllProviders } from "@/lib/scraper"
import { normalizeAllProviders } from "@/lib/normalizer"
import { saveAllPricingToDB } from "@/lib/storage"
import { disconnectDB } from "@/lib/db"

// Remove maxDuration — we return immediately now
export async function POST(request: NextRequest) {
  // 1. Verify secret
  const secret = request.headers.get("x-scraper-secret")
  if (secret !== process.env.SCRAPER_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 2. Start pipeline in background — don't await it
  runPipelineInBackground()

  // 3. Return immediately — caller doesn't wait 20 minutes
  return NextResponse.json({
    success: true,
    message: "Pipeline started in background. Check server logs for progress.",
    startedAt: new Date().toISOString(),
  })
}

// Runs after the response is already sent
async function runPipelineInBackground() {
  const startTime = Date.now()
  console.log("=== Background pipeline started ===")

  try {
    console.log("Step 1: Scraping...")
    const scrapeResults = await scrapeAllProviders()
    const scrapedOk = scrapeResults.filter((r) => r.success).length
    console.log(`Scraping complete: ${scrapedOk}/${scrapeResults.length}`)

    console.log("Step 2: Normalizing...")
    const normalized = await normalizeAllProviders(scrapeResults)
    console.log(`Normalization complete: ${normalized.length}/${scrapeResults.length}`)

    console.log("Step 3: Saving...")
    await saveAllPricingToDB(normalized)
    await disconnectDB()

    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)
    console.log(`=== Pipeline complete in ${duration} minutes ===`)
    console.log(`Saved: ${normalized.length} providers`)

  } catch (error) {
    console.error("Pipeline failed:", error instanceof Error ? error.message : error)
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  )
}