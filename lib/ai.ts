import OpenAI from "openai";

export const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

export const cerebras = new OpenAI({
  apiKey: process.env.CEREBRAS_API_KEY!,
  baseURL: "https://api.cerebras.ai/v1",
});

export const gemini = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  baseURL:
    "https://generativelanguage.googleapis.com/v1beta/openai/",
});