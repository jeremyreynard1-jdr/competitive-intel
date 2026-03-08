import { searchMultiple } from "@/lib/tavily";
import { analyzeWithClaude } from "@/lib/anthropic";
import { MARKET_SYSTEM_PROMPT } from "./prompts";
import type { MarketLandscape } from "@/lib/types";

export async function researchMarket(
  companyName: string
): Promise<MarketLandscape> {
  const queries = [
    `${companyName} competitors alternatives comparison`,
    `${companyName} market size TAM total addressable market industry`,
    `${companyName} competitive advantages differentiation moat`,
    `${companyName} industry trends future outlook`,
    `${companyName} competitive landscape market position risks`,
  ];

  const results = await searchMultiple(queries, 5);

  const context = results
    .map((r) => `[${r.title}](${r.url})\n${r.content}`)
    .join("\n\n---\n\n");

  return analyzeWithClaude<MarketLandscape>(
    MARKET_SYSTEM_PROMPT,
    `Analyze the competitive landscape for "${companyName}".\n\nWeb research results:\n\n${context}`
  );
}
