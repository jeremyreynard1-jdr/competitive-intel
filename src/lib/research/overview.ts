import { searchMultiple } from "@/lib/tavily";
import { analyzeWithClaude } from "@/lib/anthropic";
import { OVERVIEW_SYSTEM_PROMPT } from "./prompts";
import type { CompanyOverview } from "@/lib/types";

export async function researchOverview(
  companyName: string
): Promise<CompanyOverview> {
  const queries = [
    `${companyName} company overview history founding story what they do`,
    `${companyName} funding rounds investors valuation crunchbase`,
    `${companyName} technology stack platform infrastructure`,
    `${companyName} latest news announcements 2025 2026`,
    `${companyName} milestones achievements key events timeline`,
  ];

  const results = await searchMultiple(queries, 5);

  const context = results
    .map((r) => `[${r.title}](${r.url})\n${r.content}`)
    .join("\n\n---\n\n");

  return analyzeWithClaude<CompanyOverview>(
    OVERVIEW_SYSTEM_PROMPT,
    `Research the company "${companyName}" and produce a comprehensive overview.\n\nWeb research results:\n\n${context}`
  );
}
