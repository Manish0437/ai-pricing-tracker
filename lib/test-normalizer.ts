import { normalizeProviderPricing } from "./normalizer"

async function testNormalizer() {
  const fakeScrapeResult = {
    provider: "TestAI",
    url: "https://testai.com/pricing",
    scrapedAt: new Date().toISOString(),
    success: true,
    rawText: `
      TestAI Pricing

      Model: fast-1
      Input: $0.10 per 1M tokens
      Output: $0.20 per 1M tokens
      Context: 32,000 tokens

      Model: smart-2
      Input: $1.00 per 1M tokens
      Output: $3.00 per 1M tokens
      Context: 128,000 tokens
    `,
  }

  console.log("Calling GPT normalizer...")
  const result = await normalizeProviderPricing(fakeScrapeResult)

  if (!result) {
    console.log("❌ Normalization returned null — check your OPENAI_API_KEY")
    return
  }

  console.log("✅ Normalization working! Result:")
  console.log(JSON.stringify(result, null, 2))

  const checks = {
    "has provider field":   typeof result.provider === "string",
    "has models array":     Array.isArray(result.models),
    "has at least 1 model": result.models.length >= 1,
    "model has inputCost":  typeof result.models[0].inputCostPer1M === "number",
    "model has outputCost": typeof result.models[0].outputCostPer1M === "number",
    "currency is USD":      result.currency === "USD",
  }

  console.log("\n--- Field checks ---")
  let allPassed = true
  for (const [check, passed] of Object.entries(checks)) {
    console.log(`${passed ? "✅" : "❌"} ${check}`)
    if (!passed) allPassed = false
  }

  console.log(allPassed ? "\n✅ All checks passed!" : "\n❌ Some checks failed")
}

testNormalizer()