import Anthropic from "@anthropic-ai/sdk";

let anthropic: Anthropic | undefined;

export function getAnthropicClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  anthropic ??= new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  return anthropic;
}
