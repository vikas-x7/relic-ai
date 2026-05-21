import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { signAccessToken, verifyRefreshToken } from "../../../lib/jwt.js";

export const refreshRoute = new Hono();

refreshRoute.post("/", async (c) => {
  const body = await c.req.json().catch(() => ({} as { refreshToken?: string }));
  const token = body.refreshToken ?? getCookie(c, "refreshToken");
  const userId = token ? await verifyRefreshToken(token).catch(() => undefined) : undefined;

  if (!userId) {
    return c.json({ error: "Invalid or expired refresh token" }, 401);
  }

  const accessToken = await signAccessToken(userId);
  setCookie(c, "accessToken", accessToken, { httpOnly: true, sameSite: "Lax", path: "/" });

  return c.json({ accessToken });
});
