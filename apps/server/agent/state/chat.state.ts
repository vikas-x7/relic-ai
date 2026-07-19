import { Annotation } from '@langchain/langgraph';
import type { AnswerCitation } from '../citations/citation.types';
import type { MemoryItem } from '../memory/memory.types';
import type { SourceEvidence } from '../search/search.types';

export interface HistoryMessage {
  role: 'USER' | 'ASSISTANT';
  content: string;
}

export const ChatState = Annotation.Root({
  conversationId: Annotation<number>,
  userId: Annotation<number>,
  history: Annotation<HistoryMessage[]>,
  currentQuery: Annotation<string>,
  memories: Annotation<MemoryItem[]>,

  needsWebSearch: Annotation<boolean>,
  webUsed: Annotation<boolean>,

  searchResults: Annotation<SourceEvidence[]>,
  sources: Annotation<SourceEvidence[]>,

  answer: Annotation<string>,
  citations: Annotation<AnswerCitation[]>,
});

export type ChatState = typeof ChatState.State;
