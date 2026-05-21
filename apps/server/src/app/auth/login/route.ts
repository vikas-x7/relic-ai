import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import * as bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma.js";
import { signAccessToken, signRefreshToken } from "../../../lib/jwt.js";
import { loginSchema, parseJsonBody } from "../../../utils/validators.js";

export const loginRoute = new Hono();

loginRoute.post("/", async (c) => {
  const input = await parseJsonBody(c.req.raw, loginSchema);
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    return c.json({ error: "Invalid email or password" }, 401);
  }

  const accessToken = await signAccessToken(user.id);
  const refreshToken = await signRefreshToken(user.id);

  setCookie(c, "accessToken", accessToken, { httpOnly: true, sameSite: "Lax", path: "/" });
  setCookie(c, "refreshToken", refreshToken, { httpOnly: true, sameSite: "Lax", path: "/" });

  return c.json({
    user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt },
    accessToken,
    refreshToken,
  });
});
