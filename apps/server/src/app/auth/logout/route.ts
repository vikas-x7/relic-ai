import { Hono } from "hono";
import { deleteCookie } from "hono/cookie";

export const logoutRoute = new Hono();

logoutRoute.post("/", (c) => {
  deleteCookie(c, "accessToken", { path: "/" });
  deleteCookie(c, "refreshToken", { path: "/" });

  return c.json({ ok: true });
});
