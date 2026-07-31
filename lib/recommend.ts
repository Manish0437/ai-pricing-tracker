import { groq, cerebras, gemini } from "./ai";

const providers = [
  {
    name: "Groq",
    client: groq,
    model: "llama-3.3-70b-versatile",
  },
  {
    name: "Cerebras",
    client: cerebras,
    model: "llama-3.3-70b",
  },
  {
    name: "Gemini",
    client: gemini,
    model: "gemini-2.5-flash",
  },
];

export async function getRecommendation(prompt: string) {
  let lastError: unknown;

  for (const provider of providers) {
    try {
      console.log(`Trying ${provider.name}`);

      const response =
        await provider.client.chat.completions.create({
          model: provider.model,
          temperature: 0.3,
          response_format: {
            type: "json_object",
          },
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        });

      const content = response.choices[0].message.content;

      if (!content) {
        throw new Error("Empty AI response");
      }

      return JSON.parse(content);
    } catch (err) {
      console.log(`${provider.name} failed`);
      lastError = err;
    }
  }

  throw lastError;
}