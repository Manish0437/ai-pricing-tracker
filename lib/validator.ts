import { z } from "zod"

export const ModelPricingSchema = z.object({
  model: z.string(),                        // "gpt-4o", "claude-3-5-sonnet" etc.
  inputCostPer1M: z.number().nonnegative(), // cost per 1M input tokens in USD
  outputCostPer1M: z.number().nonnegative(),// cost per 1M output tokens in USD
  contextWindow: z.number().nonnegative().nullable().optional(), // ← allow null too
  tier: z.string().nullable().optional(),                         // ← any string, not a fixed enum
  notes: z.string().nullable().optional(),              // e.g. "batch pricing", "cached input"
})

export const ProviderPricingSchema = z.object({
  provider: z.string(),
  models: z.array(ModelPricingSchema).min(1),
  currency: z.string().default("USD"),
  scrapedAt: z.string(),
  normalizedAt: z.string(),
})

export function sanityCheckPricing(pricing: ProviderPricing): string[] {
  const warnings: string[] = []

  for (const model of pricing.models) {
    if (model.outputCostPer1M < model.inputCostPer1M) {
      warnings.push(
        `${model.model}: output cost ($${model.outputCostPer1M}) is lower than input cost ($${model.inputCostPer1M}) — unusual, verify manually`
      )
    }

    if (model.inputCostPer1M > 1000 || model.outputCostPer1M > 1000) {
      warnings.push(
        `${model.model}: price looks too high (input $${model.inputCostPer1M}, output $${model.outputCostPer1M}) — possible unit conversion error`
      )
    }

    if (model.inputCostPer1M === 0 && model.outputCostPer1M === 0) {
      warnings.push(`${model.model}: both costs are $0 — verify this is actually a free model`)
    }

    const isInputOnly = model.model.toLowerCase().includes("image") ||
                    model.model.toLowerCase().includes("audio") ||
                    model.model.toLowerCase().includes("whisper")

    if (!isInputOnly && model.outputCostPer1M < model.inputCostPer1M) {
      warnings.push(`${model.model}: output cost ($${model.outputCostPer1M}) is lower than input ($${model.inputCostPer1M}) — verify manually`)
    }
  }

  return warnings
}

// TypeScript types inferred directly from Zod schemas
export type ModelPricing = z.infer<typeof ModelPricingSchema>
export type ProviderPricing = z.infer<typeof ProviderPricingSchema>