import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { getChatModel } from '../models/model.provider';
import {
  ANSWER_WITH_SOURCES_PROMPT,
  ANSWER_WITHOUT_SOURCES_PROMPT,
} from '../prompts/answer-generation.prompt';
import type { ChatState } from '../state/chat.state';

function renderHistory(history: ChatState['history']): string {
  if (!history.length) return '(no previous messages)';
  return history.map((m) => `${m.role}: ${m.content}`).join('\n');
}

function renderSources(state: ChatState): string {
  return state.sources
    .map((s, i) => `[${i + 1}] ${s.title} (${s.url})\n${s.content.slice(0, 800)}`)
    .join('\n\n');
}

export async function generateAnswerNode(state: ChatState): Promise<Partial<ChatState>> {
  const history = renderHistory(state.history);

  const messages =
    state.webUsed && state.sources.length
      ? [
          new SystemMessage(
            ANSWER_WITH_SOURCES_PROMPT.replace('{{sources}}', renderSources(state)),
          ),
          new HumanMessage(`Conversation so far:\n${history}\n\nQuestion: ${state.currentQuery}`),
        ]
      : [
          new SystemMessage(ANSWER_WITHOUT_SOURCES_PROMPT),
          new HumanMessage(`Conversation so far:\n${history}\n\nQuestion: ${state.currentQuery}`),
        ];

  const response = await getChatModel().invoke(messages);
  return { answer: String(response.content).trim() };
}
