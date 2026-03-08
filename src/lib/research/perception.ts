import { searchMultiple } from "@/lib/tavily";
import { analyzeWithClaude } from "@/lib/anthropic";
import { PERCEPTION_SYSTEM_PROMPT } from "./prompts";
import type { PublicPerception } from "@/lib/types";

export async function researchPerception(
  companyName: string
): Promise<PublicPerception> {
  const queries = [
    `site:reddit.com ${companyName} review opinion experience 2024 2025`,
    `${companyName} reviews ratings G2 Trustpilot Capterra app store`,
    { query: `${companyName} press coverage media profile 2025 2026`, options: { topic: "news" as const, days: 180, maxResults: 7 } },
    `${companyName} CEO founder interview podcast speaking 2024 2025`,
    `${companyName} conference talk keynote presentation youtube`,
    `${companyName} customer experience feedback complaints praise`,
    { query: `${companyName} controversy criticism concerns 2024 2025`, options: { topic: "news" as const, days: 365 } },
  ];

  const { results } = await searchMultiple(queries, 5);

  const context = results
    .map((r) => `[${r.title}](${r.url})\n${r.content}`)
    .join("\n\n---\n\n");

  return analyzeWithClaude<PublicPerception>(
    PERCEPTION_SYSTEM_PROMPT,
    `Analyze the public perception and sentiment around "${companyName}".\n\nWeb research results:\n\n${context}`
  );
}
