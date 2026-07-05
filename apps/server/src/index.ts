import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { env } from './config/env'
import { authRoutes } from './modules/auth/routes'

const app = new Hono()

app.get('/', (c) => c.text('Relic AI API'))

app.route('/auth', authRoutes)

serve(
  { fetch: app.fetch, port: env.port },
  (info) => {
    console.log(`[server] running on http://localhost:${info.port}`)
  },
)

export default app
