import { NextResponse } from "next/server";
import { searchWeb } from "@/lib/tavily";
import Anthropic from "@anthropic-ai/sdk";

export interface CompanyCandidate {
  name: string;
  industry: string;
  description: string;
  location?: string;
}

interface DisambiguateResponse {
  candidates: CompanyCandidate[];
  autoSelected?: boolean;
}

const DISAMBIGUATE_PROMPT = `You are analyzing web search results to identify distinct companies that match a search query.

Your job:
1. Look at the search results and identify the DISTINCT companies with this name or a very similar name
2. For each distinct company, provide: full company name, industry, a one-line description (max 15 words), and headquarters location
3. If the search results clearly point to only ONE company (the name is unambiguous), return just that one
4. Return at most 5 candidates, ordered by relevance/prominence
5. Do NOT include results that are clearly not companies (e.g. books, songs, generic terms)

Return valid JSON only, no markdown:
{
  "candidates": [
    { "name": "Full Company Name", "industry": "Industry", "description": "One-line description", "location": "City, Country" }
  ]
}`;

export async function POST(req: Request) {
  try {
    const { companyName } = (await req.json()) as { companyName: string };

    if (!companyName?.trim()) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    // Quick web search to find matching companies
    const { results, answer } = await searchWeb(
      `"${companyName}" company`,
      {
        maxResults: 10,
        includeAnswer: true,
        searchDepth: "basic",
      }
    );

    // Build context from search results
    const context = results
      .map((r) => `[${r.title}] ${r.content}`)
      .join("\n\n");

    const userContent = `Search query: "${companyName}"

${answer ? `Search summary: ${answer}\n\n` : ""}Search results:
${context}

Identify the distinct companies matching "${companyName}".`;

    // Use Haiku for speed and cost
    const client = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY,
    });

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: DISAMBIGUATE_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from Claude");
    }

    let jsonStr = textBlock.text.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr) as { candidates: CompanyCandidate[] };

    const response: DisambiguateResponse = {
      candidates: parsed.candidates.slice(0, 5),
      autoSelected: parsed.candidates.length === 1,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Disambiguation failed:", error);
    return NextResponse.json(
      { error: "Failed to disambiguate company" },
      { status: 500 }
    );
  }
}
