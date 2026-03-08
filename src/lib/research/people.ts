import { searchMultiple } from "@/lib/tavily";
import { analyzeWithClaude } from "@/lib/anthropic";
import { PEOPLE_SYSTEM_PROMPT } from "./prompts";
import type { PeopleOrg } from "@/lib/types";

export async function researchPeople(
  companyName: string
): Promise<PeopleOrg> {
  const queries = [
    `${companyName} leadership team CEO CTO executives linkedin`,
    `${companyName} board of directors advisors investors`,
    `${companyName} hiring open positions jobs careers`,
    `${companyName} company culture values glassdoor reviews employees`,
    `${companyName} team size employees departments organizational structure`,
  ];

  const results = await searchMultiple(queries, 5);

  const context = results
    .map((r) => `[${r.title}](${r.url})\n${r.content}`)
    .join("\n\n---\n\n");

  return analyzeWithClaude<PeopleOrg>(
    PEOPLE_SYSTEM_PROMPT,
    `Research the people and organizational structure of "${companyName}".\n\nWeb research results:\n\n${context}`
  );
}
