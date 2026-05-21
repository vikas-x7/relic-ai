import { Hono } from "hono";
import type { Prisma } from "@prisma/client";
import type { AppVariables } from "../../../types/index.js";
import { prisma } from "../../../lib/prisma.js";
import { parseJsonBody, settingsSchema } from "../../../utils/validators.js";

export const settingsRoute = new Hono<{ Variables: AppVariables }>();

settingsRoute.patch("/", async (c) => {
  const input = await parseJsonBody(c.req.raw, settingsSchema);
  const settings = await prisma.userSettings.upsert({
    where: { userId: c.get("userId") },
    create: {
      userId: c.get("userId"),
      preferences: input.preferences as Prisma.InputJsonObject,
    },
    update: {
      preferences: input.preferences as Prisma.InputJsonObject,
    },
  });

  return c.json({ settings });
});
