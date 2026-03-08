import { searchMultiple } from "@/lib/tavily";
import { analyzeWithClaude } from "@/lib/anthropic";
import { FINANCIAL_SYSTEM_PROMPT } from "./prompts";
import type { FinancialOutlook } from "@/lib/types";

export async function researchFinancial(
  companyName: string
): Promise<FinancialOutlook> {
  const queries = [
    `${companyName} revenue ARR annual recurring revenue financial performance`,
    `${companyName} IPO acquisition exit strategy plans`,
    `${companyName} burn rate runway profitability funding`,
    `${companyName} industry comparable acquisitions exits`,
    `${companyName} growth trajectory valuation investors`,
  ];

  const results = await searchMultiple(queries, 5);

  const context = results
    .map((r) => `[${r.title}](${r.url})\n${r.content}`)
    .join("\n\n---\n\n");

  return analyzeWithClaude<FinancialOutlook>(
    FINANCIAL_SYSTEM_PROMPT,
    `Analyze the financial outlook and exit trajectory for "${companyName}".\n\nWeb research results:\n\n${context}`
  );
}
