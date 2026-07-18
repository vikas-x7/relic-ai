import { env } from '../../config/env';

export const modelConfig = {
  provider: 'nvidia-nim',
  baseUrl: env.llm.baseUrl,
  model: env.llm.model,
  temperature: env.llm.temperature,
  topP: env.llm.topP,
  maxTokens: env.llm.maxTokens,
} as const;
