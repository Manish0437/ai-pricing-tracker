// import mongoose from "mongoose";

// const PricingPlanSchema = new mongoose.Schema({
//     planName: {
//         type: String,
//         required: true,
//     },
//     pricePerUser: {
//         type: Number,
//         default: null,
//     },
//     pricePerMonth: {
//         type: Number,
//         default: null,
//     },
//     currency: {
//         type: String,
//         default: "USD",
//     },
// });

// const PricingSchema = new mongoose.Schema({
//     provider: {
//         type: String,
//         required: true,
//     },
//     price: {
//         type: Number,
//         required: true,
//     },
//     plans: {
//         type: [PricingPlanSchema],
//     },
//     pricingUrl: {
//         type: String,
//         required: true,
//     },
// });


// export const Pricing = mongoose.models.Pricing || mongoose.model("Pricing", PricingSchema);










import mongoose, { Schema, Document } from "mongoose"

export interface IModelPricing {
  model: string
  inputCostPer1M: number
  outputCostPer1M: number
  contextWindow?: number | null
  tier?: string | null
  notes?: string | null
}

export interface IProviderPricing extends Document {
  provider: string
  models: IModelPricing[]
  currency: string
  scrapedAt: string
  normalizedAt: string
  createdAt: Date
}

const ModelPricingSchema = new Schema<IModelPricing>(
  {
    model: { type: String, required: true },
    inputCostPer1M: { type: Number, required: true },
    outputCostPer1M: { type: Number, required: true },
    contextWindow: { type: Number, default: null },
    tier: { type: String, default: null },
    notes: { type: String, default: null },
  },
  { _id: false }
)

const ProviderPricingSchema = new Schema<IProviderPricing>({
  provider: { type: String, required: true, index: true },
  models: { type: [ModelPricingSchema], required: true },
  currency: { type: String, default: "USD" },
  scrapedAt: { type: String, required: true },
  normalizedAt: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: true },
})

// Append-only: every scrape run creates a NEW document, giving full price history
export const ProviderPricingModel =
  mongoose.models.ProviderPricing ||
  mongoose.model<IProviderPricing>("ProviderPricing", ProviderPricingSchema)