import { Hono } from 'hono';
import { requireAuth } from '../../auth/middleware/auth.middleware';
import type { AppVariables } from '../../auth/types/auth.types';
import {
  createConversationHandler,
  deleteConversationHandler,
  getConversationHandler,
  getMessagesHandler,
  listConversations,
  renameConversationHandler,
  sendMessageHandler,
} from '../controllers/chat.controller';

export function createChatRoutes(): Hono<{ Variables: AppVariables }> {
  const chat = new Hono<{ Variables: AppVariables }>();

  chat.use('*', requireAuth);

  chat.post('/', createConversationHandler);
  chat.get('/', listConversations);
  chat.get('/:id', getConversationHandler);
  chat.patch('/:id', renameConversationHandler);
  chat.delete('/:id', deleteConversationHandler);

  chat.post('/:id/messages', sendMessageHandler);
  chat.get('/:id/messages', getMessagesHandler);

  return chat;
}
