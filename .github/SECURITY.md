# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Relic AI, please email the maintainer at **vikaspal.icu@gmail.com** with:

- a description of the issue and the impact you believe it has
- the steps required to reproduce it
- the affected commit, branch, or deployed version
- any proof-of-concept code or screenshots

**Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.** A public report gives an attacker a head start, and it can be hard to retract once indexed.

Please give us a reasonable window to ship a fix before disclosing publicly. We aim to acknowledge reports within a few days.

## Disclosure Policy

When a report is received, a maintainer becomes the primary handler and coordinates the fix and release:

1. Confirm the problem and determine the affected version and scope.
2. Audit the code for similar issues elsewhere in the codebase.
3. Prepare a fix for the affected code and any still-maintained release.
4. Release the fix.
5. Credit the reporter in the release notes, unless they ask to remain anonymous.

## What Counts as a Vulnerability

- Authentication or authorization bypass — including access to another user's conversations
- Forging, replaying, or stealing access or refresh tokens
- Injection flaws in prompts, agent tool inputs, or database queries
- Server-Side Request Forgery through the search or LLM provider calls
- Information disclosure — stack traces, secrets, or private message content returned to the client
- Cross-site scripting in rendered assistant output

Out of scope: missing rate limiting on a self-hosted deployment you control, and issues that require an already-compromised server.

## Security Recommendations

- Always use HTTPS in production
- Keep environment variables out of version control; commit only `example.env` / `.env.example`
- Generate long, unique, random values for `JWT_SECRET` and `REFRESH_TOKEN_SECRET`
- Rotate refresh tokens on every use and revoke them on logout — this is already implemented; preserve it
- Set `COOKIE_DOMAIN` to the shared parent domain when the web and API apps live on different subdomains, so auth cookies remain scoped correctly
- Restrict `CORS_ORIGINS` to your real web origins instead of a wildcard, and keep `credentials: true`
- Run `pnpm audit` and update dependencies regularly
- Treat model output as untrusted input — it is rendered in the browser and can carry citation links

## If You Find a Leaked Secret

If a credential was ever committed to this repository, treat it as compromised:

1. Revoke/rotate it at the provider (Google, GitHub, NVIDIA, Tavily, the database).
2. Open a pull request removing it from the working tree.
3. Do not rely on rewriting history alone — assume the value was already fetched.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.x     | :white_check_mark: |
