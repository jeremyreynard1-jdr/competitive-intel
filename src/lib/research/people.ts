import { searchMultiple } from "@/lib/tavily";
import { analyzeWithClaude } from "@/lib/anthropic";
import { PEOPLE_SYSTEM_PROMPT } from "./prompts";
import type { PeopleOrg } from "@/lib/types";

export async function researchPeople(
  companyName: string
): Promise<PeopleOrg> {
  const queries = [
    { query: `${companyName} leadership team CEO CTO executives`, options: { includeAnswer: true, searchDepth: "advanced" as const } },
    `${companyName} CEO founder LinkedIn profile background`,
    `${companyName} board of directors advisors investors`,
    { query: `${companyName} careers open positions jobs hiring 2025 2026`, options: { maxResults: 7 } },
    `${companyName} jobs site:linkedin.com OR site:greenhouse.io OR site:lever.co OR site:ashbyhq.com`,
    `${companyName} company culture values glassdoor reviews employee experience`,
    `${companyName} team size number of employees LinkedIn headcount growth`,
    { query: `${companyName} new hires executive appointments 2025`, options: { topic: "news" as const, days: 180 } },
  ];

  const { results, answers } = await searchMultiple(queries, 5);

  let context = results
    .map((r) => `[${r.title}](${r.url})\n${r.content}`)
    .join("\n\n---\n\n");

  if (answers.length > 0) {
    context = `AI-SYNTHESIZED PEOPLE OVERVIEW:\n${answers.join("\n\n")}\n\n---\n\nDETAILED SOURCES:\n\n${context}`;
  }

  return analyzeWithClaude<PeopleOrg>(
    PEOPLE_SYSTEM_PROMPT,
    `Research the people and organizational structure of "${companyName}".\n\nWeb research results:\n\n${context}`
  );
}
