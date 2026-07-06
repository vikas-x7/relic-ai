import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { env } from './config/env';
import { authRoutes } from './modules/auth/routes';

const app = new Hono();

app.get('/', (c) => c.text('Relic AI API'));

app.route('/auth', authRoutes);

const vercelHandle = (req: Request) => app.fetch(req);

export const GET = vercelHandle;
export const POST = vercelHandle;
export const PUT = vercelHandle;
export const PATCH = vercelHandle;
export const DELETE = vercelHandle;
export const OPTIONS = vercelHandle;

export default vercelHandle;

// Standalone server (node dist/index.js / tsx src/index.ts). On Vercel the
// function runtime imports this module instead of running it directly.
if (!process.env.VERCEL) {
  serve({ fetch: app.fetch, port: env.port, hostname: '0.0.0.0' }, (info) => {
    console.log(`[server] running on http://localhost:${info.port}`);
  });
}
