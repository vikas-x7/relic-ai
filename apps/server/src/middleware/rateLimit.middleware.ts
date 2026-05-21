import { createMiddleware } from "hono/factory";

type Hit = {
  count: number;
  resetAt: number;
};

const hits = new Map<string, Hit>();

export function rateLimitMiddleware(limit = 60, windowMs = 60_000) {
  return createMiddleware(async (c, next) => {
    const key = c.req.header("x-forwarded-for") ?? c.req.header("cf-connecting-ip") ?? "anonymous";
    const now = Date.now();
    const hit = hits.get(key);

    if (!hit || hit.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      await next();
      return;
    }

    if (hit.count >= limit) {
      return c.json({ error: "Rate limit exceeded" }, 429);
    }

    hit.count += 1;
    await next();
  });
}
