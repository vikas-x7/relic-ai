import type { HistoryMessage } from '../state/chat.state';
import type { MemoryItem } from './memory.types';

export function renderHistoryTranscript(history: HistoryMessage[]): string {
  if (!history.length) return '(no previous messages)';
  return history.map((message) => `${message.role}: ${message.content}`).join('\n');
}

export function renderMemoriesBlock(memories: MemoryItem[]): string {
  if (!memories.length) return '(nothing stored about this user yet)';
  return memories.map((memory) => `- [${memory.type}] ${memory.content}`).join('\n');
}
