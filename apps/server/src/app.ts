import { Hono } from 'hono'
import { createAuthRoutes } from './modules/auth/routes'

export function createApp(): Hono {
  const app = new Hono().basePath('/api')

  app.route('/auth', createAuthRoutes())
  
  app.get('/health', (c) => c.json({ status: 'ok' }))

  return app
}
