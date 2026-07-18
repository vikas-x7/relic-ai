import { HumanMessage } from '@langchain/core/messages';
import { env } from '../../config/env';
import { getChatModel } from '../models/model.provider';
import { QUERY_UNDERSTANDING_PROMPT } from '../prompts/query-understanding.prompt';
import type { ChatState } from '../state/chat.state';

function renderHistory(history: ChatState['history']): string {
  if (!history.length) return '(no previous messages)';
  return history.map((m) => `${m.role}: ${m.content}`).join('\n');
}

export async function understandQueryNode(state: ChatState): Promise<Partial<ChatState>> {
  if (!env.search.tavilyApiKey) {
    return { needsWebSearch: false };
  }

  const prompt = QUERY_UNDERSTANDING_PROMPT.replace(
    '{{history}}',
    renderHistory(state.history),
  ).replace('{{query}}', state.currentQuery);

  const response = await getChatModel().invoke([new HumanMessage(prompt)]);
  const text = String(response.content).toLowerCase();
  const decision = text.match(/\b(true|false)\b/)?.[1];
  const needsWebSearch = decision === 'true';

  return { needsWebSearch };
}
