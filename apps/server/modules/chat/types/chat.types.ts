import type { AppVariables } from '../../auth/types/auth.types';

export type ChatVariables = AppVariables;

export type MessageRoleValue = 'USER' | 'ASSISTANT';

export interface ConversationDto {
  id: number;
  userId: number;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageDto {
  id: number;
  conversationId: number;
  role: MessageRoleValue;
  content: string;
  webUsed: boolean;
  model: string | null;
  inputTokens: number | null;
  outputTokens: number | null;
  createdAt: Date;
}
