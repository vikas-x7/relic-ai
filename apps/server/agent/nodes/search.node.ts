import type { SourceEvidence } from '../search/search.types';
import { webSearchTool } from '../tools/web-search.tool';
import type { ChatState } from '../state/chat.state';

function withoutEvidence(): Partial<ChatState> {
  return { searchResults: [], sources: [], webUsed: false };
}

export async function searchNode(state: ChatState): Promise<Partial<ChatState>> {
  try {
    const raw = await webSearchTool.invoke({ query: state.currentQuery });
    const results = JSON.parse(raw) as SourceEvidence[];

    if (!results.length) {
      console.warn('[ai-engine] web search returned no results, continuing without evidence');
      return withoutEvidence();
    }

    return { searchResults: results, webUsed: true };
  } catch (err) {
    console.error('[ai-engine] web search failed, continuing without evidence:', err);
    return withoutEvidence();
  }
}
