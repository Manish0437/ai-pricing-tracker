import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { ProviderPricingModel } from "@/models/Pricing";

import { buildPrompt } from "@/lib/prompt";
import { getRecommendation } from "@/lib/recommend";

type Tool = {
  tool: string;
  monthly: number;
  seats: number;
};

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const userData = await request.json();

    const {
      teamSize = 1,
      usecase = "general",
      tools = [],
    } = userData;

    // ==============================
    // Step 1: Select providers
    // ==============================

    let providers: string[] = [];

    switch (usecase.toLowerCase()) {
      case "coding":
        providers = [
          "OpenAI",
          "Anthropic",
          "Google",
          "Cursor",
        ];
        break;

      case "writing":
        providers = [
          "OpenAI",
          "Anthropic",
          "Google",
        ];
        break;

      case "research":
        providers = [
          "OpenAI",
          "Anthropic",
          "Google",
        ];
        break;

      default:
        providers = [
          "OpenAI",
          "Anthropic",
          "Google",
          "Cursor",
        ];
    }

    // ==============================
    // Step 2: Fetch providers
    // ==============================

    let pricing = await ProviderPricingModel.find({
      provider: { $in: providers },
    }).lean();

    // ==============================
    // Step 3: Filter plans by team size
    // (Only if your schema contains a "plan" field)
    // ==============================

    pricing = pricing.filter((item: any) => {
      if (!item.plan) return true;

      const plan = item.plan.toLowerCase();

      if (teamSize <= 5) {
        return (
          plan.includes("individual") ||
          plan.includes("pro") ||
          plan.includes("plus")
        );
      }

      if (teamSize <= 20) {
        return plan.includes("team");
      }

      return (
        plan.includes("enterprise") ||
        plan.includes("business")
      );
    });

    // ==============================
    // Step 4: Calculate user's
    // current monthly spending
    // ==============================

    const currentMonthlyCost = tools.reduce(
      (total: number, tool: Tool) => {
        return total + tool.monthly * tool.seats;
      },
      0
    );

    // ==============================
    // Step 5: Build optimized payload
    // ==============================

    const payload = {
      user: {
        teamSize,
        usecase,
      },

      currentTools: tools,

      currentMonthlyCost,

      availableModels: pricing,
    };

    console.log("Payload sent to AI:");
    // console.dir(payload, { depth: null });

    // ==============================
    // Step 6: Build prompt
    // ==============================

    const prompt = buildPrompt(payload);

    // ==============================
    // Step 7: Get AI recommendation
    // ==============================

    const recommendation =
      await getRecommendation(prompt);

    console.log("AI Recommendation:",recommendation);
    return NextResponse.json({
      success: true,
      recommendation,
    });
  } catch (error) {
    console.error("Recommendation Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate recommendation.",
      },
      {
        status: 500,
      }
    );
  }
}