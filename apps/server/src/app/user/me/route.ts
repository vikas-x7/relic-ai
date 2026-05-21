import { Hono } from "hono";
import type { AppVariables } from "../../../types/index.js";
import { prisma } from "../../../lib/prisma.js";

export const meRoute = new Hono<{ Variables: AppVariables }>();

meRoute.get("/", async (c) => {
  const user = await prisma.user.findUnique({
    where: { id: c.get("userId") },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      settings: true,
    },
  });

  return c.json({ user });
});
