import { serve } from '@hono/node-server';

export default async function handler(req: any, res: any) {
  try {
    const { handle } = await import('@hono/node-server/vercel');
    const { app } = await import('./app');
    const h = handle(app);
    return await h(req, res);
  } catch (err: any) {
    console.error('[vercel-handler-error]', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify(
        {
          error: 'Vercel Serverless Function Startup Error',
          message: err?.message || String(err),
          stack: err?.stack,
          envCheck: {
            HAS_DATABASE_URL: !!process.env.DATABASE_URL,
            HAS_JWT_SECRET: !!process.env.JWT_SECRET,
            HAS_REFRESH_TOKEN_SECRET: !!process.env.REFRESH_TOKEN_SECRET,
            NODE_ENV: process.env.NODE_ENV,
            VERCEL: process.env.VERCEL,
          },
        },
        null,
        2,
      ),
    );
  }
}

if (!process.env.VERCEL) {
  import('./app').then(({ app }) => {
    import('./config/env').then(({ env }) => {
      serve({ fetch: app.fetch, port: env.port, hostname: '0.0.0.0' }, (info) => {
        console.log(`[server] running on http://localhost:${info.port}`);
      });
    });
  });
}


