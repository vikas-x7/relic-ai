import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { chatRoute } from "./app/chat/[conversationId]/route.js";
import { loginRoute } from "./app/auth/login/route.js";
import { logoutRoute } from "./app/auth/logout/route.js";
import { refreshRoute } from "./app/auth/refresh/route.js";
import { signupRoute } from "./app/auth/signup/route.js";
import { conversationRoute } from "./app/conversations/[conversationId]/route.js";
import { conversationMessagesRoute } from "./app/conversations/[conversationId]/messages/route.js";
import { conversationsRoute } from "./app/conversations/route.js";
import { memoryItemRoute } from "./app/memory/[memoryId]/route.js";
import { memoryRoute } from "./app/memory/route.js";
import { searchRoute } from "./app/search/route.js";
import { meRoute } from "./app/user/me/route.js";
import { settingsRoute } from "./app/user/settings/route.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import { rateLimitMiddleware } from "./middleware/rateLimit.middleware.js";
import type { AppVariables } from "./types/index.js";

const app = new Hono<{ Variables: AppVariables }>();

app.onError(errorHandler);
app.use("*", logger());
app.use("*", cors({ origin: process.env.WEB_ORIGIN ?? "http://localhost:3000", credentials: true }));
app.use("*", rateLimitMiddleware());

app.get("/", (c) => c.json({ ok: true, service: "relic-ai-server" }));
app.route("/auth/signup", signupRoute);
app.route("/auth/login", loginRoute);
app.route("/auth/logout", logoutRoute);
app.route("/auth/refresh", refreshRoute);

app.use("/conversations/*", authMiddleware);
app.use("/chat/*", authMiddleware);
app.use("/memory/*", authMiddleware);
app.use("/search/*", authMiddleware);
app.use("/user/*", authMiddleware);

app.route("/conversations", conversationsRoute);
app.route("/conversations/:conversationId", conversationRoute);
app.route("/conversations/:conversationId/messages", conversationMessagesRoute);
app.route("/chat/:conversationId", chatRoute);
app.route("/memory", memoryRoute);
app.route("/memory/:memoryId", memoryItemRoute);
app.route("/search", searchRoute);
app.route("/user/me", meRoute);
app.route("/user/settings", settingsRoute);

const port = Number(process.env.PORT ?? 8787);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});

export default app;
