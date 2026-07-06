import { handle } from 'hono/vercel';
import { app } from '../src/app';

const handler = (req: Request) => {
  const url = new URL(req.url);
  if (url.pathname.startsWith('/api')) {
    const path = url.pathname.slice(4) || '/';
    return app.fetch(new Request(`${url.origin}${path}${url.search}`, req));
  }
  return app.fetch(req);
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;

export default handler;