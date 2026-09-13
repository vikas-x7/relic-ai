# Contributing to Relic AI

Thank you for your interest in contributing to Relic AI! This document explains how to set the project up locally, the conventions we follow, and what we look for in a pull request.

## Getting Started

1. Fork the repository ([vikas-x7/relic-ai](https://github.com/vikas-x7/relic-ai))
2. Clone your fork (`git clone https://github.com/your-username/relic-ai.git`)
3. Create a branch (`git checkout -b feat/amazing-feature`)
4. Install dependencies (`pnpm install`)
5. Make your changes
6. Commit your work (`git commit -m 'feat: add amazing feature'`)
7. Push (`git push origin feat/amazing-feature`)
8. Open a pull request

## Development Setup

### Prerequisites

- **Node.js 20.9+** (Next.js 16 requirement)
- **PostgreSQL** 14+ (a hosted database such as Neon works fine)
- **pnpm 10.12+** (`corepack enable` if you don't have it)
- An API key for an OpenAI-compatible LLM endpoint ([NVIDIA NIM](https://build.nvidia.com) by default)
- An optional [Tavily](https://app.tavily.com) API key for web-grounded answers

### Environment Variables

Copy the example files and fill in real values:

```bash
cp apps/server/example.env  apps/server/.env
cp packages/db/.env.example packages/db/.env
cp apps/web/.env.example    apps/web/.env.local
```

`JWT_SECRET`, `REFRESH_TOKEN_SECRET`, `NVIDIA_API_KEY`, and `DATABASE_URL` are required — the server refuses to boot without them. See the environment table in the [README](../README.md#environment-variables).

> Never commit a real `.env` file. If a secret is ever pushed by accident, rotate it immediately — a removed commit does not un-leak a credential.

### Running Locally

```bash
pnpm install
pnpm --filter db db:generate
pnpm --filter db db:migrate
pnpm dev
```

- Web app: http://localhost:3000
- API: http://localhost:3001/api

To work on a single app:

```bash
pnpm --filter web dev
pnpm --filter server dev
```

### Running Tests

```bash
pnpm --filter server test
```

The server suite is Jest with ts-jest. It mocks the `db` package, so no database is required. If you add a `test` task to `turbo.json`, you can also run `pnpm test` from the root.

## Code Conventions

- TypeScript everywhere — no `.js` source files
- Follow the existing style of the file you are editing; consistency beats personal preference
- Use [Conventional Commits](https://www.conventionalcommits.org) for commit messages: `feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `chore:`, `test:`, with an optional scope, for example `feat(landing): add pricing table`
- Keep pull requests focused on a single change
- Run `pnpm format` before committing so Prettier and `lint-staged` stay quiet

### Frontend (`apps/web`)

- Feature code lives in `src/modules/<feature>/` — `auth/`, `chat/`, `landing/`
- `app/` routes are thin wrappers that render a module component
- Components are `PascalCase.tsx` and use default exports; hooks are `useXxx.ts`
- Server state via TanStack Query; never hand-roll `useEffect` fetching
- Tailwind CSS only — no CSS modules or CSS-in-JS
- The `@/` alias points at the app root

### Backend (`apps/server`)

- ESM TypeScript modules; routes live in `modules/<feature>/routes/`, with a controller, a service, and Zod schemas
- Validate every input with Zod before it reaches a service
- Throw `AppError` subclasses for expected failures; let the global error handler in `errors/` map them to responses
- Log through `lib/logger.ts` — never `console.log`, and never log tokens, secrets, or message content
- Add environment variables to `config/env.ts` with a validation helper, and document them in `apps/server/example.env`

### Agent (`apps/server/agent`)

- Each LangGraph node is a `*.node.ts` in `nodes/` returning a partial `ChatState`
- Prompts live in `prompts/*.prompt.ts` as exported template strings — keep them out of the node logic
- Graph topology changes belong in `orchestration/chat.graph.ts`
- Anything that calls an external service (search, model provider) goes behind a provider interface in `search/` or `models/`

### Database (`packages/db`)

- Schema changes require a migration: `pnpm --filter db db:migrate`
- Commit both `prisma/schema.prisma` and the generated SQL in `prisma/migrations/`
- Never edit an already-applied migration; create a new one
- `generated/` is gitignored — run `pnpm --filter db db:generate` after pulling

## Pull Request Process

1. Update documentation if your change affects setup, env vars, or the API
2. Ensure there are no TypeScript errors (`pnpm check-types`)
3. Ensure there are no lint errors (`pnpm lint`)
4. Run the test suite (`pnpm --filter server test`)
5. Add or update tests that cover the behaviour you changed
6. Request a review from a maintainer

A pre-commit hook (`lint-staged`) runs Prettier and ESLint on staged files. If it fails, fix the files rather than bypassing it with `--no-verify`.

## Reporting Issues

Use the [GitHub Issues](https://github.com/vikas-x7/relic-ai/issues) tracker with one of the provided templates. For security-sensitive reports, do **not** open an issue — follow [SECURITY.md](SECURITY.md) instead.

## Code of Conduct

By participating you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](../LICENSE).
