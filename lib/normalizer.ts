import { config } from "dotenv"
config({ path: ".env.local" })

import { GoogleGenAI } from "@google/genai"
import { ScrapeResult } from "./scraper"
import { ProviderPricingSchema, ProviderPricing } from "./validator"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const SYSTEM_PROMPT = `You are a precise data extraction assistant.
Your job is to extract AI model pricing from raw webpage text and return structured JSON.

Rules:
- Extract EVERY model mentioned with a price
- All costs must be in USD per 1 million tokens
- If a price is shown per 1K tokens, multiply by 1000
- If a price is shown per 1 token, multiply by 1,000,000
- If input/output costs are the same, use the same value for both
- If context window is mentioned, include it as a number (e.g. 128000)
- If a model has multiple pricing tracks for different modalities (e.g. audio, text, image), create a SEPARATE entry for each modality, naming it like "ModelName (modality)"
- If a modality has no output price listed, use 0 and mention this in notes
- Put any extra pricing details (like cached input cost) in the notes field as a short string
- If you cannot find a price for a model, skip that model entirely
- Return ONLY valid JSON, no explanation, no markdown, no code fences`

function buildUserPrompt(scrapeResult: ScrapeResult): string {
  return `Extract all model pricing from this ${scrapeResult.provider} pricing page.

Return a JSON object with exactly this structure:
{
  "provider": "${scrapeResult.provider}",
  "models": [
    {
      "model": "model-name",
      "inputCostPer1M": 0.00,
      "outputCostPer1M": 0.00,
      "contextWindow": 128000,
      "tier": "standard",
      "notes": "optional notes"
    }
  ],
  "currency": "USD",
  "scrapedAt": "${scrapeResult.scrapedAt}",
  "normalizedAt": "${new Date().toISOString()}"
}

Raw pricing page text:
---
${scrapeResult.rawText}
---`
}

// async function callGemini(prompt: string): Promise<string> {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",   // current stable free-tier model
//     contents: SYSTEM_PROMPT + "\n\n" + prompt,
//     config: { temperature: 0 },
//   })
//   return response.text ?? ""
// }

async function callGemini(prompt: string, retries = 5): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: SYSTEM_PROMPT + "\n\n" + prompt,
        config: { temperature: 0 },
      })
      return response.text ?? ""
    } catch (error: any) {
      const isOverloaded =
        error?.status === "UNAVAILABLE" ||
        error?.message?.includes("503") ||
        error?.message?.includes("overloaded") ||
        error?.message?.includes("high demand")

      const isRateLimited =
        error?.status === "RESOURCE_EXHAUSTED" ||
        error?.message?.includes("429") ||
        error?.message?.includes("quota")

      const isLastAttempt = attempt === retries

      if ((isOverloaded || isRateLimited) && !isLastAttempt) {
        // Use the retry delay from the error response if available, otherwise backoff
        const retryDelay = error?.message?.match(/retry in (\d+)/)?.[1]
        const waitMs = retryDelay ? (parseInt(retryDelay) + 2) * 1000 : attempt * 10000
        console.log(`  ⏳ Gemini rate limited, retrying in ${waitMs / 1000}s (attempt ${attempt}/${retries})...`)
        await new Promise((r) => setTimeout(r, waitMs))
        continue
      }

      throw error // not a 503, or out of retries — let it fail normally
    }
  }

  throw new Error("Gemini call failed after all retries")
}

function parseResponse(raw: string): unknown {
  let cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim()

  // If there's still leading/trailing prose, extract just the {...} block
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    cleaned = jsonMatch[0]
  }

  return JSON.parse(cleaned)
}

export async function normalizeProviderPricing(
  scrapeResult: ScrapeResult
): Promise<ProviderPricing | null> {
  if (!scrapeResult.success || !scrapeResult.rawText) {
    console.log(`Skipping normalization for ${scrapeResult.provider} — scrape failed`)
    return null
  }

  try {
    console.log(`Normalizing ${scrapeResult.provider}...`)
    const prompt = buildUserPrompt(scrapeResult)
    const rawResponse = await callGemini(prompt)
    const parsed = parseResponse(rawResponse)
    const validated = ProviderPricingSchema.parse(parsed)
    console.log(`  ✓ ${scrapeResult.provider} — ${validated.models.length} models extracted`)
    return validated
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(`  ✗ ${scrapeResult.provider} — Gemini returned invalid JSON`)
    } else {
      console.error(
        `  ✗ ${scrapeResult.provider} — Validation failed:`,
        error instanceof Error ? error.message : error
      )
    }
    return null
  }
}

export async function normalizeAllProviders(
  scrapeResults: ScrapeResult[]
): Promise<ProviderPricing[]> {
  const normalized: ProviderPricing[] = []

  for (const result of scrapeResults) {
    const pricing = await normalizeProviderPricing(result)
    if (pricing) normalized.push(pricing)
    console.log("  ⏳ Waiting 65s before next normalization call (free tier rate limit)...")
    await new Promise((r) => setTimeout(r, 65000))
  }

  console.log(`Normalization complete: ${normalized.length}/${scrapeResults.length} providers succeeded`)
  return normalized
}