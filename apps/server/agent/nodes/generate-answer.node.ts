import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { getChatModel } from '../models/model.provider';
import { renderHistoryTranscript, renderMemoriesBlock } from '../memory/context.builder';
import {
  ANSWER_WITH_SOURCES_PROMPT,
  ANSWER_WITHOUT_SOURCES_PROMPT,
} from '../prompts/answer-generation.prompt';
import type { ChatState } from '../state/chat.state';

function renderSources(state: ChatState): string {
  return state.sources
    .map((s, i) => `[${i + 1}] ${s.title} (${s.url})\n${s.content.slice(0, 800)}`)
    .join('\n\n');
}

function buildSystemPrompt(basePrompt: string, state: ChatState): string {
  return `${basePrompt}\n\nWhat you know about this user (long-term memory):\n${renderMemoriesBlock(
    state.memories ?? [],
  )}`;
}

export async function generateAnswerNode(state: ChatState): Promise<Partial<ChatState>> {
  const history = renderHistoryTranscript(state.history);

  const messages =
    state.webUsed && state.sources.length
      ? [
          new SystemMessage(
            buildSystemPrompt(
              ANSWER_WITH_SOURCES_PROMPT.replace('{{sources}}', renderSources(state)),
              state,
            ),
          ),
          new HumanMessage(`Conversation so far:\n${history}\n\nQuestion: ${state.currentQuery}`),
        ]
      : [
          new SystemMessage(buildSystemPrompt(ANSWER_WITHOUT_SOURCES_PROMPT, state)),
          new HumanMessage(`Conversation so far:\n${history}\n\nQuestion: ${state.currentQuery}`),
        ];

  const response = await getChatModel().invoke(messages);
  return { answer: String(response.content).trim() };
}
