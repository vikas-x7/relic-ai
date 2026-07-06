import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { fileURLToPath } from 'node:url'
import { env } from './config/env'
import { authRoutes } from './modules/auth/routes'

const app = new Hono()

app.get('/', (c) => c.text('Relic AI API'))

app.route('/auth', authRoutes)

// Vercel serverless functions use these named handlers.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const vercelHandle = (req: any) => app.fetch(req)

export const GET = vercelHandle
export const POST = vercelHandle
export const PUT = vercelHandle
export const PATCH = vercelHandle
export const DELETE = vercelHandle
export const OPTIONS = vercelHandle

export default app

const isDirectRun =
  process.argv[1] !== undefined &&
  import.meta.url.startsWith('file:') &&
  fileURLToPath(import.meta.url) === process.argv[1]

if (isDirectRun) {
  serve(
    { fetch: app.fetch, port: env.port, hostname: '0.0.0.0' },
    (info) => {
      console.log(`[server] running on http://localhost:${info.port}`)
    },
  )
}
