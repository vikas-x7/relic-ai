import type { SearchProvider } from './search.types';
import { TavilyProvider } from './tavily.provider';

let cachedProvider: SearchProvider | null = null;

export function getSearchProvider(): SearchProvider {
  if (!cachedProvider) {
    cachedProvider = new TavilyProvider();
  }
  return cachedProvider;
}
