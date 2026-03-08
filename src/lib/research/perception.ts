import { searchMultiple } from "@/lib/tavily";
import { analyzeWithClaude } from "@/lib/anthropic";
import { PERCEPTION_SYSTEM_PROMPT } from "./prompts";
import type { PublicPerception } from "@/lib/types";

export async function researchPerception(
  companyName: string
): Promise<PublicPerception> {
  const queries = [
    `site:reddit.com ${companyName} review opinion experience`,
    `${companyName} reviews ratings G2 Trustpilot Capterra`,
    `${companyName} press coverage news media 2024 2025`,
    `${companyName} CEO founder speaking conference presentation youtube`,
    `${companyName} customer reviews feedback complaints`,
  ];

  const results = await searchMultiple(queries, 5);

  const context = results
    .map((r) => `[${r.title}](${r.url})\n${r.content}`)
    .join("\n\n---\n\n");

  return analyzeWithClaude<PublicPerception>(
    PERCEPTION_SYSTEM_PROMPT,
    `Analyze the public perception and sentiment around "${companyName}".\n\nWeb research results:\n\n${context}`
  );
}
