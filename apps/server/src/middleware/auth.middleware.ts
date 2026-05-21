import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import type { AppVariables } from "../types/index.js";
import { verifyAccessToken } from "../lib/jwt.js";

export const authMiddleware = createMiddleware<{ Variables: AppVariables }>(async (c, next) => {
  const header = c.req.header("authorization");
  const bearerToken = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  const cookieToken = getCookie(c, "accessToken");
  const token = bearerToken ?? cookieToken;

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userId = await verifyAccessToken(token).catch(() => undefined);

  if (!userId) {
    return c.json({ error: "Invalid or expired token" }, 401);
  }

  c.set("userId", userId);
  await next();
});
