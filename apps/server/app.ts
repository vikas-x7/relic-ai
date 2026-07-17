import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createAuthRoutes } from './modules/auth/routes/auth.routes';
import { createChatRoutes } from './modules/chat/routes/chat.routes';
import { env } from './config/env';

export function createApp(): Hono {
  const app = new Hono().basePath('/api');

  app.use(
    '*',
    cors({
      origin: env.corsOrigins,
      credentials: true,
      allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  app.route('/auth', createAuthRoutes());
  app.route('/conversations', createChatRoutes());

  app.get('/health', (c) => c.json({ status: 'ok' }));

  return app;
}
