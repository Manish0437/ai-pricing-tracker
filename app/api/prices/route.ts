import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { ProviderPricingModel } from "@/models/Pricing"

export async function GET() {
  try {
    await connectDB()

    const prices = await ProviderPricingModel
      .find({})
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      count: prices.length,
      data: prices,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}