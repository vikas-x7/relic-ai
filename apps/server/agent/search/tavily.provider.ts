import { env } from '../../config/env';
import type { SearchProvider, SearchResult } from './search.types';

const TAVILY_SEARCH_URL = 'https://api.tavily.com/search';

interface TavilyResult {
  title?: string;
  url?: string;
  content?: string;
  published_date?: string;
}

function toDomain(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

export class TavilyProvider implements SearchProvider {
  readonly name = 'tavily';

  async search(query: string, maxResults = 5): Promise<SearchResult[]> {
    const response = await fetch(TAVILY_SEARCH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.search.tavilyApiKey}`,
      },
      body: JSON.stringify({ query, max_results: maxResults, search_depth: 'basic' }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`Tavily search failed (${response.status}): ${body.slice(0, 300)}`);
    }

    const data = (await response.json()) as { results?: TavilyResult[] };
    return (data.results ?? [])
      .filter((r) => typeof r.url === 'string')
      .map((r) => ({
        title: r.title ?? '',
        url: r.url as string,
        content: r.content ?? '',
        domain: toDomain(r.url as string),
        publishedAt: r.published_date ?? null,
      }));
  }
}
