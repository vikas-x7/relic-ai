import type { AnswerCitation } from './citation.types';
import type { SourceEvidence } from '../search/search.types';

const MARKER_REGEX = /\[(\d+)\]/g;

export function extractValidCitations(
  answer: string,
  sources: SourceEvidence[],
): { cleanedAnswer: string; citations: AnswerCitation[] } {
  const total = sources.length;
  const seen = new Set<number>();
  const order: number[] = [];

  let cleaned = answer.replace(MARKER_REGEX, (match, numStr: string) => {
    const n = Number(numStr);
    if (!Number.isInteger(n) || n < 1 || n > total) {
      return '';
    }
    if (!seen.has(n)) {
      seen.add(n);
      order.push(n);
    }
    return match;
  });

  cleaned = cleaned
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/ \n/g, '\n')
    .trim();

  const citations: AnswerCitation[] = order.map((sourceNumber, i) => ({
    citationIndex: i + 1,
    url: sources[sourceNumber - 1].url,
    title: sources[sourceNumber - 1].title,
  }));

  return { cleanedAnswer: cleaned, citations };
}
