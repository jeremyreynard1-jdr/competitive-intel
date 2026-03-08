import { tavily, type TavilyClient } from "@tavily/core";

let _client: TavilyClient | null = null;

function getClient(): TavilyClient {
  if (!_client) {
    _client = tavily({ apiKey: process.env.TAVILY_API_KEY ?? "" });
  }
  return _client;
}

export interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export interface SearchOptions {
  maxResults?: number;
  includeAnswer?: boolean;
  searchDepth?: "basic" | "advanced";
  topic?: "general" | "news" | "finance";
  days?: number;
}

export async function searchWeb(
  query: string,
  options?: SearchOptions
): Promise<{ results: TavilyResult[]; answer?: string }> {
  const response = await getClient().search(query, {
    maxResults: options?.maxResults ?? 5,
    includeAnswer: options?.includeAnswer ?? false,
    searchDepth: options?.searchDepth ?? "basic",
    topic: options?.topic ?? "general",
    ...(options?.days ? { days: options.days } : {}),
  });

  return {
    results: response.results.map((r) => ({
      title: r.title,
      url: r.url,
      content: r.content,
      score: r.score,
    })),
    answer: response.answer,
  };
}

export interface MultiSearchQuery {
  query: string;
  options?: SearchOptions;
}

export async function searchMultiple(
  queries: (string | MultiSearchQuery)[],
  defaultMaxResults = 5
): Promise<{ results: TavilyResult[]; answers: string[] }> {
  const normalized = queries.map((q) =>
    typeof q === "string" ? { query: q, options: {} as SearchOptions } : q
  );

  const searchResults = await Promise.allSettled(
    normalized.map((q) =>
      searchWeb(q.query, {
        maxResults: q.options?.maxResults ?? defaultMaxResults,
        ...q.options,
      })
    )
  );

  const allResults: TavilyResult[] = [];
  const answers: string[] = [];

  for (const result of searchResults) {
    if (result.status === "fulfilled") {
      allResults.push(...result.value.results);
      if (result.value.answer) {
        answers.push(result.value.answer);
      }
    }
  }

  // Deduplicate by URL
  const seen = new Set<string>();
  const dedupedResults = allResults.filter((r) => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });

  return { results: dedupedResults, answers };
}
