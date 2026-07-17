import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { createApp } from '@/app';

const service = jest.requireMock('../services/chat.service') as {
  createConversation: jest.Mock;
  getConversations: jest.Mock;
  getConversation: jest.Mock;
  renameConversation: jest.Mock;
  deleteConversation: jest.Mock;
  createMessage: jest.Mock;
  getMessages: jest.Mock;
};

jest.mock('../services/chat.service', () => {
  const actual = jest.requireActual('../services/chat.service') as Record<string, unknown>;
  return {
    ...actual,
    createConversation: jest.fn(),
    getConversations: jest.fn(),
    getConversation: jest.fn(),
    renameConversation: jest.fn(),
    deleteConversation: jest.fn(),
    createMessage: jest.fn(),
    getMessages: jest.fn(),
  };
});

const jwt = jest.requireActual('../../auth/tokens/jwt') as typeof import('../../auth/tokens/jwt');

async function accessToken(userId = 1): Promise<string> {
  return jwt.createAccessToken({ id: userId, email: 'user@test.dev', name: 'Test User' });
}

async function authCookie(userId = 1): Promise<string> {
  return `${jwt.ACCESS_COOKIE_NAME}=${await accessToken(userId)}`;
}

describe('chat routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 when no access cookie is sent', async () => {
    const app = createApp();
    const res = await app.request('/api/conversations');
    expect(res.status).toBe(401);
  });

  it('POST /api/conversations creates a conversation', async () => {
    service.createConversation.mockResolvedValue({
      id: 1,
      userId: 1,
      title: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const app = createApp();
    const res = await app.request('/api/conversations', {
      method: 'POST',
      headers: { cookie: await authCookie() },
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.id).toBe(1);
    expect(body.title).toBeNull();
    expect(service.createConversation).toHaveBeenCalledWith(1, undefined);
  });

  it('GET /api/conversations lists only current user conversations', async () => {
    const rows = [
      {
        id: 2,
        userId: 1,
        title: 'Redis',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    service.getConversations.mockResolvedValue(rows as never);

    const app = createApp();
    const res = await app.request('/api/conversations', {
      headers: { cookie: await authCookie() },
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(rows);
    expect(service.getConversations).toHaveBeenCalledWith(1);
  });

  it('GET /api/conversations/:id returns the conversation', async () => {
    service.getConversation.mockResolvedValue({
      id: 1,
      userId: 1,
      title: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const app = createApp();
    const res = await app.request('/api/conversations/1', {
      headers: { cookie: await authCookie() },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(1);
  });

  it('GET /api/conversations/:id returns 404 for non-existing id', async () => {
    const { ConversationNotFoundError } = jest.requireActual<{
      ConversationNotFoundError: new () => Error;
    }>('../services/chat.service');
    service.getConversation.mockImplementation(() => {
      throw new ConversationNotFoundError();
    });

    const app = createApp();
    const res = await app.request('/api/conversations/999', {
      headers: { cookie: await authCookie() },
    });

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe('Conversation not found');
  });

  it('GET /api/conversations/:id returns 403 for another users conversation', async () => {
    const { ConversationAccessDeniedError } = jest.requireActual<{
      ConversationAccessDeniedError: new () => Error;
    }>('../services/chat.service');
    service.getConversation.mockImplementation(() => {
      throw new ConversationAccessDeniedError();
    });

    const app = createApp();
    const res = await app.request('/api/conversations/1', {
      headers: { cookie: await authCookie() },
    });

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBe('Access denied');
  });

  it('GET /api/conversations/:id returns 400 for invalid id param', async () => {
    const app = createApp();
    const res = await app.request('/api/conversations/abc', {
      headers: { cookie: await authCookie() },
    });

    expect(res.status).toBe(400);
  });

  it('PATCH /api/conversations/:id renames the conversation', async () => {
    service.renameConversation.mockResolvedValue({
      id: 1,
      userId: 1,
      title: 'Node.js Architecture',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const app = createApp();
    const res = await app.request('/api/conversations/1', {
      method: 'PATCH',
      headers: { cookie: await authCookie(), 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'Node.js Architecture' }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.title).toBe('Node.js Architecture');
    expect(service.renameConversation).toHaveBeenCalledWith(1, 1, 'Node.js Architecture');
  });

  it('PATCH /api/conversations/:id returns 400 for invalid body', async () => {
    const app = createApp();
    const res = await app.request('/api/conversations/1', {
      method: 'PATCH',
      headers: { cookie: await authCookie(), 'content-type': 'application/json' },
      body: JSON.stringify({ title: '' }),
    });

    expect(res.status).toBe(400);
  });

  it('DELETE /api/conversations/:id deletes the conversation', async () => {
    service.deleteConversation.mockResolvedValue(undefined as never);

    const app = createApp();
    const res = await app.request('/api/conversations/1', {
      method: 'DELETE',
      headers: { cookie: await authCookie() },
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(service.deleteConversation).toHaveBeenCalledWith(1, 1);
  });

  it('POST /api/conversations/:id/messages creates a USER message', async () => {
    const now = new Date();
    service.createMessage.mockResolvedValue({
      id: 10,
      conversationId: 1,
      role: 'USER',
      content: 'What is Redis?',
      webUsed: false,
      model: null,
      inputTokens: null,
      outputTokens: null,
      createdAt: now,
    } as never);

    const app = createApp();
    const res = await app.request('/api/conversations/1/messages', {
      method: 'POST',
      headers: { cookie: await authCookie(), 'content-type': 'application/json' },
      body: JSON.stringify({ content: 'What is Redis?' }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.role).toBe('USER');
    expect(body.content).toBe('What is Redis?');
    expect(service.createMessage).toHaveBeenCalledWith(1, 1, 'USER', 'What is Redis?');
  });

  it('POST /api/conversations/:id/messages returns 400 for empty content', async () => {
    const app = createApp();
    const res = await app.request('/api/conversations/1/messages', {
      method: 'POST',
      headers: { cookie: await authCookie(), 'content-type': 'application/json' },
      body: JSON.stringify({ content: '   ' }),
    });

    expect(res.status).toBe(400);
    expect(service.createMessage).not.toHaveBeenCalled();
  });

  it('GET /api/conversations/:id/messages returns history ordered by createdAt asc', async () => {
    const base = new Date('2026-01-01T00:00:00Z');
    const rows = [
      {
        id: 10,
        conversationId: 1,
        role: 'USER',
        content: 'What is Redis?',
        webUsed: false,
        model: null,
        inputTokens: null,
        outputTokens: null,
        createdAt: base,
      },
      {
        id: 11,
        conversationId: 1,
        role: 'ASSISTANT',
        content: 'Redis is an in-memory data store.',
        webUsed: false,
        model: null,
        inputTokens: null,
        outputTokens: null,
        createdAt: new Date(base.getTime() + 1000),
      },
    ];
    service.getMessages.mockResolvedValue(rows as never);

    const app = createApp();
    const res = await app.request('/api/conversations/1/messages', {
      headers: { cookie: await authCookie() },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(2);
    expect(body[0].createdAt <= body[1].createdAt).toBe(true);
  });

  it('ownership errors apply to message endpoints too', async () => {
    const { ConversationAccessDeniedError } = jest.requireActual<{
      ConversationAccessDeniedError: new () => Error;
    }>('../services/chat.service');
    service.createMessage.mockImplementation(() => {
      throw new ConversationAccessDeniedError();
    });

    const app = createApp();
    const res = await app.request('/api/conversations/7/messages', {
      method: 'POST',
      headers: { cookie: await authCookie(), 'content-type': 'application/json' },
      body: JSON.stringify({ content: 'hello' }),
    });

    expect(res.status).toBe(403);
    expect((await res.json()).error).toBe('Access denied');
  });
});
