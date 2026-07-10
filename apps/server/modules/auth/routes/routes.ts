import { Hono } from 'hono'
import { requireAuth } from '../middleware/middleware'
import {
  getCurrentUser,
  getProviderAvailability,
  handleCallback,
  logout,
  refreshTokens,
  startAuth,
} from '../controller/controller'
import type { AppVariables } from '../types/types'

export function createAuthRoutes(): Hono<{ Variables: AppVariables }> {
  const auth = new Hono<{ Variables: AppVariables }>()

  auth.get('/providers', getProviderAvailability)
  auth.get('/me', requireAuth, getCurrentUser)
  auth.post('/refresh', refreshTokens)
  auth.post('/logout', logout)

  auth.get('/:provider', startAuth)
  auth.get('/:provider/callback', handleCallback)

  return auth
}
