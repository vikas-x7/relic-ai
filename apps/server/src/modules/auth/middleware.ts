import type { MiddlewareHandler } from 'hono'
import { getCookie } from 'hono/cookie'
import { ACCESS_COOKIE_NAME, verifyAccessToken } from './jwt'
import type { AppVariables } from './types'

export const requireAuth: MiddlewareHandler<{ Variables: AppVariables }> = async (
  c,
  next,
) => {
  const token = getCookie(c, ACCESS_COOKIE_NAME)
  const session = token ? await verifyAccessToken(token) : null

  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  c.set('authUser', session)
  await next()
}
