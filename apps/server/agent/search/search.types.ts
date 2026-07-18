export interface SearchResult {
  title: string;
  url: string;
  content: string;
  domain: string | null;
  publishedAt: string | null;
}

export interface SourceEvidence {
  title: string;
  url: string;
  content: string;
  domain: string | null;
}

export interface SearchProvider {
  readonly name: string;
  search(query: string, maxResults?: number): Promise<SearchResult[]>;
}
