import { Hono } from 'hono';
import { requireAuth } from '../../auth/middleware/auth.middleware';
import type { AppVariables } from '../../auth/types/auth.types';
import {
  createConversationHandler,
  deleteConversationHandler,
  getConversationDetailHandler,
  getConversationHandler,
  getMessagesHandler,
  listConversations,
  renameConversationHandler,
  saveCanvasHandler,
  searchConversationsHandler,
  sendMessageHandler,
} from '../controllers/chat.controller';

export function createChatRoutes(): Hono<{ Variables: AppVariables }> {
  const chat = new Hono<{ Variables: AppVariables }>();

  chat.use('*', requireAuth);

  chat.post('/', createConversationHandler);
  chat.get('/', listConversations);
  chat.get('/search', searchConversationsHandler);
  chat.get('/:id', getConversationHandler);
  chat.get('/:id/detail', getConversationDetailHandler);
  chat.patch('/:id', renameConversationHandler);
  chat.patch('/:id/canvas', saveCanvasHandler);
  chat.delete('/:id', deleteConversationHandler);

  chat.post('/:id/messages', sendMessageHandler);
  chat.get('/:id/messages', getMessagesHandler);

  return chat;
}
