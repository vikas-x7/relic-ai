import { ChatOpenAI } from '@langchain/openai';
import { env } from '../../config/env';
import { modelConfig } from './model.config';

let cachedModel: ChatOpenAI | null = null;

export function getChatModel(): ChatOpenAI {
  if (!cachedModel) {
    cachedModel = new ChatOpenAI({
      model: modelConfig.model,
      apiKey: env.llm.apiKey,
      temperature: modelConfig.temperature,
      topP: modelConfig.topP,
      maxTokens: modelConfig.maxTokens,
      configuration: {
        baseURL: env.llm.baseUrl,
      },
    });
  }
  return cachedModel;
}

type MessageContent = string | Array<{ type: string; text?: string }>;

function extractText(content: MessageContent): string {
  if (typeof content === 'string') return content;
  return content
    .map((part) => (part.type === 'text' && part.text ? part.text : ''))
    .join('')
    .trim();
}

export async function generateReply(prompt: string): Promise<string> {
  const response = await getChatModel().invoke(prompt);
  const text = extractText(response.content as MessageContent);
  if (!text) {
    throw new Error('LLM returned an empty response');
  }
  return text;
}
