import { config } from "dotenv"
config({ path: ".env.local" })

import { connectDB } from "./db"
import { ProviderPricingModel } from "../models/Pricing"
import { ProviderPricing, sanityCheckPricing } from "./validator"

export async function savePricingToDB(
  pricing: ProviderPricing
): Promise<{ saved: boolean; warnings: string[] }> {
  const warnings = sanityCheckPricing(pricing)

  try {
    await connectDB()

    // Delete existing data for this provider, then insert fresh
    await ProviderPricingModel.deleteMany({ provider: pricing.provider })

    const doc = new ProviderPricingModel(pricing)
    await doc.save()

    console.log(`✓ Replaced ${pricing.provider} in MongoDB (${pricing.models.length} models)`)
    return { saved: true, warnings }
  } catch (error) {
    console.error(`✗ Failed to save ${pricing.provider}:`, error)
    return { saved: false, warnings }
  }
}

export async function saveAllPricingToDB(
  pricingList: ProviderPricing[]
): Promise<void> {
  // Clear ALL provider data first before saving new batch
  await connectDB()
  await ProviderPricingModel.deleteMany({})
  console.log("🗑️  Cleared all existing pricing data")

  for (const pricing of pricingList) {
    const { warnings } = await savePricingToDB(pricing)
    if (warnings.length > 0) {
      console.log(`⚠️  ${pricing.provider} warnings:`)
      warnings.forEach((w) => console.log(`   ${w}`))
    }
  }
}