import { extractValidCitations } from '../citations/citation.validator';
import type { ChatState } from '../state/chat.state';

export async function validateCitationsNode(state: ChatState): Promise<Partial<ChatState>> {
  if (!state.webUsed || !state.sources.length) {
    return { citations: [] };
  }

  const { cleanedAnswer, citations } = extractValidCitations(state.answer, state.sources);
  return { answer: cleanedAnswer, citations };
}
