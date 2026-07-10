import Anthropic from "@anthropic-ai/sdk";

/**
 * Model selection (per approved plan):
 *  - interviews: claude-sonnet-5 (quality, conversational)
 *  - explain/hint: claude-haiku-4-5 (fast, cheap, high volume)
 */
export const MODELS = {
  interview: "claude-sonnet-5",
  assist: "claude-haiku-4-5",
} as const;

let client: Anthropic | null = null;

export function isAiConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

/** Returns the Anthropic client, or null if no API key is configured. */
export function getAnthropic(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic();
  return client;
}

/** Concatenate the text blocks of a non-streaming message response. */
export function textFromMessage(message: Anthropic.Message): string {
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}
