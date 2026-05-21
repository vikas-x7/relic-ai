import type { SearchResult } from "../types/index.js";
import { tavilySearch } from "../lib/tavily.js";

export async function searchWeb(query: string): Promise<SearchResult[]> {
  const response = await tavilySearch(query);

  return (response.results ?? []).map((result) => ({
    title: result.title,
    url: result.url,
    content: result.content,
  }));
}
