import { serve } from '@hono/node-server';
import { handle } from '@hono/node-server/vercel';
import { app } from './app';
import { env } from './config/env';

export default handle(app);

if (!process.env.VERCEL) {
  serve({ fetch: app.fetch, port: env.port, hostname: '0.0.0.0' }, (info) => {
    console.log(`[server] running on http://localhost:${info.port}`);
  });
}

