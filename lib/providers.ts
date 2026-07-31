export interface Provider {
  name: string
  url: string
  waitForSelector?: string  
}

export const providers: Provider[] = [
  {
    name: "OpenAI",
    url: "https://platform.openai.com/docs/pricing",
    waitForSelector: "[class*='pric'], h1, h2, h3, main",
  },
  {
    name: "Anthropic",
    url: "https://www.anthropic.com/pricing#api",
    waitForSelector: "table, [class*='pric'], [class*='price'], h1, h2, h3, main",
  },
  {
    name: "Google Gemini",
    url: "https://ai.google.dev/pricing",
    waitForSelector: "table",
  },
  {
    name: "Groq",
    url: "https://groq.com/pricing/",
    waitForSelector: "table",
  },
  {
    name: "Perplexity-(Sonar)",
    url: "https://docs.perplexity.ai/docs/sonar/models/sonar",
    waitForSelector: "table, h1, h2, h3, main",
  },
  {
    name: "Perplexity-(Sonar-Pro)",
    url: "https://docs.perplexity.ai/docs/sonar/models/sonar-pro",
    waitForSelector: "table, h1, h2, h3, main",
  },
  {
    name: "Perplexity-(Sonar-Reasoning-Pro)",
    url: "https://docs.perplexity.ai/docs/sonar/models/sonar-reasoning-pro",
    waitForSelector: "table, h1, h2, h3, main",
  },
  {
    name: "Perplexity-(Sonar-Deep-Research)",
    url: "https://docs.perplexity.ai/docs/sonar/models/sonar-deep-research",
    waitForSelector: "table, h1, h2, h3, main",
  },
  {
    name: "DeepSeek",
    url: "https://api-docs.deepseek.com/quick_start/pricing",
    waitForSelector: "table",
  }
]