import { serve } from '@hono/node-server';
import { app } from './app';
import { env } from './config/env';

serve({ fetch: app.fetch, port: env.port, hostname: '0.0.0.0' }, (info) => {
  console.log(`[server] running on http://localhost:${info.port}`);
});



