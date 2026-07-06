import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { env } from './config/env';
import { authRoutes } from './modules/auth/routes';

export const app = new Hono();

app.use(
  '*',
  cors({
    // Browser requests must originate from the deployed web application.
    origin: env.webUrl,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);

app.get('/', (c) => c.text('Relic AI API'));
app.get('/health', (c) => c.json({ ok: true }));

app.route('/auth', authRoutes);

app.notFound((c) => c.json({ error: 'Not found' }, 404));

app.onError((error, c) => {
  console.error('[server] request failed', error);
  return c.json(
    { error: env.isProd ? 'Internal server error' : error.message },
    500,
  );
});
