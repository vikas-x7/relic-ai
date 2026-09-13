<div align="center">
<p align="center">
  <img src="apps/web/public/images/logo.png" alt="Relic AI" width="50" />
</p>

# Relic AI

**Your thoughts don't flow in a straight line your AI shouldn't either.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-087ea4?logo=react&logoColor=white)](https://react.dev)
[![Hono](https://img.shields.io/badge/Hono-4-E36002?logo=hono&logoColor=white)](https://hono.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![LangGraph](https://img.shields.io/badge/LangGraph-1.x-1f3c88?logo=langchain)](https://langchain-ai.github.io/langgraph/)
[![Tavily](https://img.shields.io/badge/Tavily-Web%20Search-00BA78?logo=tavily&logoColor=white)](https://tavily.com)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Turborepo](https://img.shields.io/badge/Turborepo-2-EF4444?logo=turborepo&logoColor=white)](https://turborepo.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#license)

</div>

---

## About

**Relic AI** is a spatial canvas for AI conversations. Instead of one linear chat thread, every idea lives as its own self-contained node on an infinite canvas — branch mid-thought, drag a thought somewhere else, and carry the full context forward without ever losing the thread.

Answers can be web-grounded: the agent decides on its own whether a question needs fresh information, searches the web, and attaches validated inline citations to the response. And because it remembers, long-running projects keep their context across sessions.

> Relic AI is live see [relicai.in](https://relicai.in)

## Demo

<p align="center">
  <a href="https://res.cloudinary.com/dyv9kenuj/video/upload/v1778740598/relicdemov1_1_aurpo2.mp4">
    <img
      src="https://res.cloudinary.com/dyv9kenuj/image/upload/v1788495473/screenshot-studio-1788495300168_wqjwwp.webp"
      alt="Relic AI demo — branch conversations on an infinite canvas, with web-grounded, cited answers"
      width="100%"
    />
  </a>
</p>

Click the image above to watch the demo.

## Features

- **Infinite node canvas** — every message is a draggable node; connect, rearrange, and re-enter any thought.
- **Mid-thread branching** — select text or fork a node to explore a tangent without polluting the original thread.
- **Persistent memory** — the agent extracts facts, preferences, and context from your conversations and recalls them later.
- **Web-grounded answers** — an LLM decides when a query needs live data, searches via Tavily, and cites sources inline.
- **Citation validation** — a dedicated graph node verifies that generated claims are actually supported by the retrieved sources.
- **Canvas persistence** — node and edge layout is saved per conversation and restored across sessions.
- **OAuth authentication** — Google and GitHub sign-in with short-lived JWT access tokens and rotating refresh tokens in httpOnly cookies.
- **Typed API contracts** — Zod validation on every request; all database access through Prisma.
- **Structured logging** — Pino with automatic redaction of tokens, secrets, and PII.

## Tech Stack

### Monorepo

| Layer           | Technology                                                |
| --------------- | --------------------------------------------------------- |
| Monorepo Tool   | [Turborepo](https://turborepo.dev)                        |
| Package Manager | [pnpm](https://pnpm.io) (workspaces)                      |
| Language        | [TypeScript](https://www.typescriptlang.org) (throughout) |
| Testing         | [Jest](https://jestjs.io) + ts-jest (server)              |

### Frontend (`apps/web`)

| Layer        | Technology                                                                |
| ------------ | ------------------------------------------------------------------------- |
| Framework    | [Next.js 16](https://nextjs.org) (App Router)                             |
| UI           | [React 19](https://react.dev) · [Tailwind CSS 4](https://tailwindcss.com) |
| Canvas       | [React Flow](https://reactflow.dev) (`@xyflow/react`)                     |
| Server State | [TanStack Query](https://tanstack.com/query)                              |
| HTTP Client  | [Axios](https://axios-http.com) (401 → single-flight refresh + replay)    |
| Icons        | [react-icons](https://react-icons.github.io/react-icons)                  |

### Backend (`apps/server`)

| Layer               | Technology                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Framework           | [Hono 4](https://hono.dev) on the Vercel adapter, mounted in a single catch-all Next.js route at `/api`                                                |
| Agent Orchestration | [LangGraph](https://langchain-ai.github.io/langgraph/) `StateGraph` · [@langchain/openai](https://js.langchain.com) for any OpenAI-compatible endpoint |
| Web Search          | [Tavily](https://tavily.com), wrapped as a LangChain tool                                                                                              |
| Auth                | `hono/jwt` (HS256) · hand-rolled Google/GitHub OAuth 2.0 with PKCE (S256) · httpOnly cookies                                                           |
| Validation          | [Zod](https://zod.dev)                                                                                                                                 |
| Logging             | [Pino](https://getpino.io) with redaction paths                                                                                                        |

### Database (`packages/db`)

| Layer | Technology                                                                                   |
| ----- | -------------------------------------------------------------------------------------------- |
| DB    | [PostgreSQL](https://www.postgresql.org) (Neon / any hosted Postgres)                        |
| ORM   | [Prisma 7](https://www.prisma.io) via [@prisma/adapter-pg](https://github.com/prisma/prisma) |

### Agent Graph

The chat pipeline is a compiled, memoized LangGraph state machine:

```
START
  └─> understand-query
        ├─ needsWebSearch ──> search ──> analyze-sources ──┐
        └─ no search ──────────────────────────────────────┴─> generate-answer
                                                               ├─ webUsed && sources ──> validate-citations ──> END
                                                               └────────────────────────────────────────────────> END
```

Each node lives in `apps/server/agent/nodes/`, its prompt in `apps/server/agent/prompts/`, and shared state in `apps/server/agent/state/chat.state.ts`.

## Repository Structure

```
relic-ai/
├── apps/
│   ├── web/                  # Next.js 16 frontend (App Router), React 19, Tailwind 4
│   │   ├── app/              # Routes: /, /auth, /chat, /chat/[conversationId], /pricing
│   │   └── src/
│   │       ├── lib/          # axios client, TanStack Query providers
│   │       └── modules/      # auth/ · chat/ · landing/ (feature modules)
│   └── server/               # Hono 4 API + LangGraph agent
│       ├── agent/            # Graph nodes, prompts, state, memory, citations, search
│       ├── app/              # createApp() wiring
│       ├── app/api/          # hono/vercel catch-all route handler
│       ├── config/           # Zod-backed env config (config/env.ts)
│       ├── errors/           # AppError + global error handler
│       ├── lib/              # Pino logger with redaction
│       └── modules/          # auth/ · chat/ (routes, controllers, services, middleware)
├── packages/
│   ├── db/                   # Prisma 7 schema, migrations, pg pool
│   ├── eslint-config/        # @repo/eslint-config
│   └── typescript-config/    # @repo/typescript-config
├── .agents/skills/           # Agent-facing project + style context
├── .github/                  # Contribution, security, and issue templates
├── AGENTS.md                 # Guide for AI coding agents
└── turbo.json
```

## Getting Started

### Prerequisites

- **Node.js 20.9+** (required by Next.js 16)
- **PostgreSQL** 14+ (or a hosted Postgres URL such as Neon)
- **pnpm 10.12+**
- API keys for an OpenAI-compatible LLM endpoint (NVIDIA NIM by default) and optionally [Tavily](https://app.tavily.com) for web search

### Installation

```bash
git clone https://github.com/vikas-x7/relic-ai.git
cd relic-ai

pnpm install

cp apps/server/example.env  apps/server/.env
cp packages/db/.env.example packages/db/.env
cp apps/web/.env.example    apps/web/.env.local
# Edit the .env files with your configuration

pnpm --filter db db:generate
pnpm --filter db db:migrate

pnpm dev
```

- Web: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:3001/api](http://localhost:3001/api)

### Environment Variables

`apps/server/.env` (see [`apps/server/example.env`](apps/server/example.env) for a fully commented template):

| Variable                                           | Required | Description                                                         |
| -------------------------------------------------- | -------- | ------------------------------------------------------------------- |
| `JWT_SECRET`                                       | yes      | HS256 signing secret for access tokens                              |
| `REFRESH_TOKEN_SECRET`                             | yes      | HS256 signing secret for refresh tokens                             |
| `NVIDIA_API_KEY`                                   | yes      | API key for the OpenAI-compatible endpoint                          |
| `DATABASE_URL`                                     | yes      | PostgreSQL connection string                                        |
| `NODE_ENV`                                         | no       | `development` \| `test` \| `production` (default `development`)     |
| `LOG_LEVEL`                                        | no       | `fatal`\|`error`\|`warn`\|`info`\|`debug`\|`trace` (default `info`) |
| `SERVER_URL` / `WEB_URL`                           | no       | Public base URLs of the API and web app                             |
| `CORS_ORIGINS`                                     | no       | Comma-separated allowlist of browser origins                        |
| `COOKIE_DOMAIN`                                    | no       | Shared cookie domain (e.g. `.relicai.in`); empty for split domains  |
| `JWT_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN`        | no       | Token lifetimes (default `15m` / `15d`)                             |
| `OAUTH_STATE_EXPIRES_IN`                           | no       | OAuth `state` cookie lifetime (default `10m`)                       |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`        | no       | Google OAuth credentials (PKCE enabled)                             |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`        | no       | GitHub OAuth credentials                                            |
| `LLM_BASE_URL` / `LLM_MODEL`                       | no       | LLM endpoint and model id                                           |
| `LLM_TEMPERATURE` / `LLM_TOP_P` / `LLM_MAX_TOKENS` | no       | Sampling parameters                                                 |
| `TAVILY_API_KEY` / `TAVILY_MAX_RESULTS`            | no       | Web search credentials and result cap (default `5`)                 |

`packages/db/.env`: `DATABASE_URL` (required), `DATABASE_POOL_MAX`, `DATABASE_POOL_IDLE_TIMEOUT_MS`, `DATABASE_POOL_CONNECTION_TIMEOUT_MS`, `DATABASE_LOGGING`, `DATABASE_DEBUG`.

`apps/web/.env.local`: `NEXT_PUBLIC_API_URL` — the API base URL, including the `/api` prefix (e.g. `http://localhost:3001/api`).

## Scripts

Run from the repository root:

| Script                         | Description                                    |
| ------------------------------ | ---------------------------------------------- |
| `pnpm dev`                     | Start all apps in development mode (Turborepo) |
| `pnpm build`                   | Build all apps and packages                    |
| `pnpm lint`                    | Lint all apps and packages                     |
| `pnpm check-types`             | Type-check all apps and packages               |
| `pnpm format`                  | Format code with Prettier                      |
| `pnpm --filter server test`    | Run the server test suite (Jest)               |
| `pnpm --filter db db:generate` | Regenerate the Prisma client                   |
| `pnpm --filter db db:migrate`  | Create and apply a Prisma migration            |

Filter to a single app with `--filter` (for example `pnpm dev --filter web` or `pnpm build --filter server`).

## API

All routes are mounted under `/api`. Errors use a consistent envelope:

```json
{
  "success": false,
  "error": {
    "code": "CONVERSATION_NOT_FOUND",
    "message": "Conversation not found",
    "requestId": "..."
  }
}
```

### Public

| Method | Path                  | Description                               |
| ------ | --------------------- | ----------------------------------------- |
| `GET`  | `/api/health`         | Health check                              |
| `GET`  | `/api/auth/providers` | Which OAuth providers are configured      |
| `GET`  | `/api/auth/:provider` | Redirect to the provider's consent screen |

### Authenticated

| Method   | Path                              | Description                                |
| -------- | --------------------------------- | ------------------------------------------ |
| `GET`    | `/api/auth/me`                    | Current user                               |
| `POST`   | `/api/auth/refresh`               | Rotate the access/refresh token pair       |
| `POST`   | `/api/auth/logout`                | Revoke the refresh token and clear cookies |
| `GET`    | `/api/conversations`              | List the user's conversations              |
| `POST`   | `/api/conversations`              | Create a conversation                      |
| `GET`    | `/api/conversations/search?q=`    | Search conversations                       |
| `GET`    | `/api/conversations/:id`          | Fetch one conversation                     |
| `GET`    | `/api/conversations/:id/detail`   | Conversation with messages + citations     |
| `PATCH`  | `/api/conversations/:id`          | Rename a conversation                      |
| `PATCH`  | `/api/conversations/:id/canvas`   | Persist canvas nodes and edges             |
| `DELETE` | `/api/conversations/:id`          | Delete a conversation                      |
| `GET`    | `/api/conversations/:id/messages` | List messages                              |
| `POST`   | `/api/conversations/:id/messages` | Send a message and run the agent graph     |

Every conversation route enforces ownership server-side; conversations belonging to another user return `404` or `403`.

## Deployment

Relic AI targets **Vercel** (the server uses the `hono/vercel` adapter and both apps are Next.js projects).

1. Provision **PostgreSQL** (Neon, Supabase, Railway, etc.) and run `pnpm --filter db db:migrate`.
2. Deploy `apps/web` and `apps/server` as **separate** Vercel projects.
3. Set `NEXT_PUBLIC_API_URL` on the web project to the server's public URL + `/api`.
4. Configure all variables from the table above on the server project.
5. Register the OAuth redirect URIs:
   - `https://<api-domain>/api/auth/google/callback`
   - `https://<api-domain>/api/auth/github/callback`
6. If web and API sit on different apex domains, set `COOKIE_DOMAIN` to the shared parent (e.g. `.relicai.in`) and `CORS_ORIGINS` to the web origin. The app sets `SameSite=None; Secure` cookies in production for this reason.

## Contributing

Contributions are welcome. Please read [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md) first — it covers the local setup, the code conventions for each app, the Conventional Commit format used in this repository, and the pull request process. Issues and feature ideas go through the [issue templates](.github/ISSUE_TEMPLATE/).

If you are an AI coding agent working in this repository, read [`AGENTS.md`](AGENTS.md) and the skills in [`.agents/skills/`](.agents/skills/) first.

## Security

Please do not report vulnerabilities through public GitHub issues. See [`.github/SECURITY.md`](.github/SECURITY.md) for the private reporting channel and response policy.

## License

Distributed under the **MIT** license. See [`LICENSE`](LICENSE) for more information.

---
