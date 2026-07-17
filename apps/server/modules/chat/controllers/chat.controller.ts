import type { Context } from 'hono';
import type { AppVariables } from '../../auth/types/auth.types';
import {
  createConversationSchema,
  renameConversationSchema,
  sendMessageSchema,
} from '../schemas/chat.schema';
import {
  ConversationAccessDeniedError,
  ConversationNotFoundError,
  createConversation,
  createMessage,
  deleteConversation,
  getConversation,
  getConversations,
  getMessages,
  renameConversation,
} from '../services/chat.service';

type ChatContext = Context<{ Variables: AppVariables }>;

function parseId(value: string | undefined): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function getUserId(c: ChatContext): number {
  return Number(c.get('authUser').sub);
}

function handleServiceError(c: ChatContext, err: unknown) {
  if (err instanceof ConversationNotFoundError) {
    return c.json({ error: err.message }, 404);
  }
  if (err instanceof ConversationAccessDeniedError) {
    return c.json({ error: err.message }, 403);
  }
  console.error('[chat] unexpected error:', err);
  return c.json({ error: 'Internal server error' }, 500);
}

export async function createConversationHandler(c: ChatContext) {
  const body = (await c.req.json().catch(() => ({}))) ?? {};
  const parsed = createConversationSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: 'Invalid request body' }, 400);
  }

  try {
    const conversation = await createConversation(getUserId(c), parsed.data.title);
    return c.json(conversation, 201);
  } catch (err) {
    return handleServiceError(c, err);
  }
}

export async function listConversations(c: ChatContext) {
  try {
    const conversations = await getConversations(getUserId(c));
    return c.json(conversations);
  } catch (err) {
    return handleServiceError(c, err);
  }
}

export async function getConversationHandler(c: ChatContext) {
  const id = parseId(c.req.param('id'));
  if (id === null) {
    return c.json({ error: 'Invalid conversation id' }, 400);
  }

  try {
    const conversation = await getConversation(id, getUserId(c));
    return c.json(conversation);
  } catch (err) {
    return handleServiceError(c, err);
  }
}

export async function renameConversationHandler(c: ChatContext) {
  const id = parseId(c.req.param('id'));
  if (id === null) {
    return c.json({ error: 'Invalid conversation id' }, 400);
  }

  const body = await c.req.json().catch(() => null);
  const parsed = renameConversationSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: 'Invalid request body' }, 400);
  }

  try {
    const conversation = await renameConversation(id, getUserId(c), parsed.data.title);
    return c.json(conversation);
  } catch (err) {
    return handleServiceError(c, err);
  }
}

export async function deleteConversationHandler(c: ChatContext) {
  const id = parseId(c.req.param('id'));
  if (id === null) {
    return c.json({ error: 'Invalid conversation id' }, 400);
  }

  try {
    await deleteConversation(id, getUserId(c));
    return c.json({ ok: true });
  } catch (err) {
    return handleServiceError(c, err);
  }
}

export async function sendMessageHandler(c: ChatContext) {
  const id = parseId(c.req.param('id'));
  if (id === null) {
    return c.json({ error: 'Invalid conversation id' }, 400);
  }

  const body = await c.req.json().catch(() => null);
  const parsed = sendMessageSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: 'Invalid request body' }, 400);
  }

  try {
    const message = await createMessage(id, getUserId(c), 'USER', parsed.data.content);
    return c.json(message, 201);
  } catch (err) {
    return handleServiceError(c, err);
  }
}

export async function getMessagesHandler(c: ChatContext) {
  const id = parseId(c.req.param('id'));
  if (id === null) {
    return c.json({ error: 'Invalid conversation id' }, 400);
  }

  try {
    const messages = await getMessages(id, getUserId(c));
    return c.json(messages);
  } catch (err) {
    return handleServiceError(c, err);
  }
}
