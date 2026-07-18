import { env } from '../../config/env';
import { getSearchProvider } from './search.provider';
import type { SearchResult } from './search.types';

export async function searchWeb(
  query: string,
  maxResults = env.search.maxResults,
): Promise<SearchResult[]> {
  if (!query.trim()) {
    throw new Error('Search query must not be empty');
  }
  if (!env.search.tavilyApiKey) {
    throw new Error('Web search is not configured: missing TAVILY_API_KEY');
  }
  return getSearchProvider().search(query, maxResults);
}
