import { searchMultiple } from "@/lib/tavily";
import { analyzeWithClaude } from "@/lib/anthropic";
import { MARKET_SYSTEM_PROMPT } from "./prompts";
import type { MarketLandscape } from "@/lib/types";

export async function researchMarket(
  companyName: string
): Promise<MarketLandscape> {
  const queries = [
    { query: `${companyName} competitors alternatives comparison 2025`, options: { includeAnswer: true, searchDepth: "advanced" as const } },
    `${companyName} vs competitors comparison review`,
    `${companyName} market size TAM SAM total addressable market industry report`,
    `${companyName} competitive advantages differentiation moat unique value`,
    { query: `${companyName} industry trends outlook 2025 2026`, options: { topic: "news" as const, days: 180 } },
    `${companyName} competitive landscape market position risks threats`,
    `${companyName} product positioning messaging strategy`,
  ];

  const { results, answers } = await searchMultiple(queries, 5);

  let context = results
    .map((r) => `[${r.title}](${r.url})\n${r.content}`)
    .join("\n\n---\n\n");

  if (answers.length > 0) {
    context = `AI-SYNTHESIZED COMPETITIVE ANALYSIS:\n${answers.join("\n\n")}\n\n---\n\nDETAILED SOURCES:\n\n${context}`;
  }

  return analyzeWithClaude<MarketLandscape>(
    MARKET_SYSTEM_PROMPT,
    `Analyze the competitive landscape for "${companyName}".\n\nWeb research results:\n\n${context}`
  );
}
