import { chromium } from "playwright"

async function testScraper() {
  console.log("Launching browser...")
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    viewport: { width: 1366, height: 768 },
  })

  const page = await context.newPage()

  console.log("Navigating to Groq pricing (easiest site)...")
  await page.goto("https://groq.com/pricing/", {
    waitUntil: "networkidle",
    timeout: 30000,
  })

  const text = await page.evaluate(() => {
    const remove = document.querySelectorAll("script, style, nav, footer")
    remove.forEach((el) => el.remove())
    return document.body.innerText.trim().slice(0, 500)
  })

  await browser.close()

  if (text.length > 100) {
    console.log("✅ Scraper working! Sample text:")
    console.log(text)
  } else {
    console.log("❌ Scraper returned too little text — something is wrong")
    console.log("Got:", text)
  }
}

testScraper()