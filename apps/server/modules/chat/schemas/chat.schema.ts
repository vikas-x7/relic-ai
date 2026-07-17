import { z } from 'zod';

export const createConversationSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
});

export const renameConversationSchema = z.object({
  title: z.string().trim().min(1).max(200),
});

export const sendMessageSchema = z.object({
  content: z.string().trim().min(1).max(8000),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type RenameConversationInput = z.infer<typeof renameConversationSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
