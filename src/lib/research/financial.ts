import { searchMultiple } from "@/lib/tavily";
import { analyzeWithClaude } from "@/lib/anthropic";
import { FINANCIAL_SYSTEM_PROMPT } from "./prompts";
import type { FinancialOutlook } from "@/lib/types";

export async function researchFinancial(
  companyName: string
): Promise<FinancialOutlook> {
  const queries = [
    { query: `${companyName} revenue ARR annual recurring revenue 2024 2025`, options: { includeAnswer: true, searchDepth: "advanced" as const } },
    { query: `${companyName} latest valuation funding round 2025 2026`, options: { topic: "news" as const, days: 180 } },
    `${companyName} IPO plans acquisition exit strategy public offering`,
    `${companyName} burn rate runway profitability financial health`,
    `${companyName} comparable company acquisitions exits valuations in industry`,
    `${companyName} growth rate customers users metrics traction`,
    { query: `${companyName} financial news revenue growth 2025`, options: { topic: "news" as const, days: 120 } },
    `${companyName} secondary share sale tender offer employee stock`,
  ];

  const { results, answers } = await searchMultiple(queries, 5);

  let context = results
    .map((r) => `[${r.title}](${r.url})\n${r.content}`)
    .join("\n\n---\n\n");

  if (answers.length > 0) {
    context = `AI-SYNTHESIZED FINANCIAL OVERVIEW:\n${answers.join("\n\n")}\n\n---\n\nDETAILED SOURCES:\n\n${context}`;
  }

  return analyzeWithClaude<FinancialOutlook>(
    FINANCIAL_SYSTEM_PROMPT,
    `Analyze the financial outlook and exit trajectory for "${companyName}".\n\nWeb research results:\n\n${context}`
  );
}
