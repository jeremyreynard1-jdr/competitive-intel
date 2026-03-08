import { searchMultiple } from "@/lib/tavily";
import { analyzeWithClaude } from "@/lib/anthropic";
import { OVERVIEW_SYSTEM_PROMPT } from "./prompts";
import type { CompanyOverview } from "@/lib/types";

export async function researchOverview(
  companyName: string
): Promise<CompanyOverview> {
  const queries = [
    { query: `${companyName} company overview what they do product service`, options: { includeAnswer: true, searchDepth: "advanced" as const } },
    `${companyName} founding story history origin`,
    { query: `${companyName} latest funding round valuation 2025 2026`, options: { topic: "news" as const, days: 180 } },
    `${companyName} all funding rounds series investors crunchbase pitchbook`,
    { query: `${companyName} news announcements 2025 2026`, options: { topic: "news" as const, days: 120, maxResults: 7 } },
    `${companyName} technology stack platform architecture engineering blog`,
    `${companyName} key milestones achievements partnerships launches`,
    `${companyName} employee count LinkedIn headquarters location remote hybrid`,
  ];

  const { results, answers } = await searchMultiple(queries, 5);

  let context = results
    .map((r) => `[${r.title}](${r.url})\n${r.content}`)
    .join("\n\n---\n\n");

  if (answers.length > 0) {
    context = `AI-SYNTHESIZED OVERVIEW:\n${answers.join("\n\n")}\n\n---\n\nDETAILED SOURCES:\n\n${context}`;
  }

  return analyzeWithClaude<CompanyOverview>(
    OVERVIEW_SYSTEM_PROMPT,
    `Research the company "${companyName}" and produce a comprehensive overview.\n\nWeb research results:\n\n${context}`
  );
}
