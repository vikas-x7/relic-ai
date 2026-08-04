import { HumanMessage } from '@langchain/core/messages';
import { getChatModel } from '../models/model.provider';
import { logger, redactError } from '../../lib/logger';
import { ANALYZE_SOURCES_PROMPT } from '../prompts/analyze-sources.prompt';
import type { SourceEvidence } from '../search/search.types';
import type { ChatState } from '../state/chat.state';

const MAX_SOURCES = 5;

function renderResults(results: SourceEvidence[]): string {
  return results
    .map((r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\nContent: ${r.content.slice(0, 600)}`)
    .join('\n\n');
}

function parseRelevantIndexes(text: string, total: number): number[] | null {
  const match = text.match(/\[[\d\s,]+\]/s);
  if (!match) return null;
  const indexes = (match[0].match(/\d+/g) ?? []).map(Number).filter((n) => n >= 1 && n <= total);
  return indexes.length ? Array.from(new Set(indexes)) : null;
}

export async function analyzeSourcesNode(state: ChatState): Promise<Partial<ChatState>> {
  let results = state.searchResults;

  if (!results.length) {
    return { sources: [], webUsed: false };
  }

  try {
    const prompt = ANALYZE_SOURCES_PROMPT.replace('{{query}}', state.currentQuery).replace(
      '{{results}}',
      renderResults(results),
    );
    const response = await getChatModel().invoke([new HumanMessage(prompt)]);
    const indexes = parseRelevantIndexes(String(response.content), results.length);
    if (indexes) {
      results = indexes.map((i) => results[i - 1]);
    }
  } catch (err) {
    logger.error({ err: redactError(err) }, 'Analyze-sources failed, keeping all results');
  }

  const sources: SourceEvidence[] = results.slice(0, MAX_SOURCES);
  return { sources };
}
