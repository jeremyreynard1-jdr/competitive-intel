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

export async function searchWeb(
  query: string,
  options?: { maxResults?: number; includeAnswer?: boolean }
): Promise<{ results: TavilyResult[]; answer?: string }> {
  const response = await getClient().search(query, {
    maxResults: options?.maxResults ?? 5,
    includeAnswer: options?.includeAnswer ?? false,
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

export async function searchMultiple(
  queries: string[],
  maxResultsPerQuery = 5
): Promise<TavilyResult[]> {
  const results = await Promise.allSettled(
    queries.map((q) => searchWeb(q, { maxResults: maxResultsPerQuery }))
  );

  const allResults: TavilyResult[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      allResults.push(...result.value.results);
    }
  }

  // Deduplicate by URL
  const seen = new Set<string>();
  return allResults.filter((r) => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });
}
