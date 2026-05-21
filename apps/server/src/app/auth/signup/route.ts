import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import * as bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma.js";
import { signAccessToken, signRefreshToken } from "../../../lib/jwt.js";
import { parseJsonBody, signupSchema } from "../../../utils/validators.js";

export const signupRoute = new Hono();

signupRoute.post("/", async (c) => {
  const input = await parseJsonBody(c.req.raw, signupSchema);
  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      name: input.name,
      passwordHash,
      settings: { create: {} },
    },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  const accessToken = await signAccessToken(user.id);
  const refreshToken = await signRefreshToken(user.id);

  setCookie(c, "accessToken", accessToken, { httpOnly: true, sameSite: "Lax", path: "/" });
  setCookie(c, "refreshToken", refreshToken, { httpOnly: true, sameSite: "Lax", path: "/" });

  return c.json({ user, accessToken, refreshToken }, 201);
});
