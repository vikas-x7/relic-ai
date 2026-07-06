import { Hono } from 'hono';
import { requireAuth } from './middleware';
import { getCurrentUser, getProviderAvailability, handleCallback, logout, refreshTokens, startAuth } from './controller';
import type { AppVariables } from './types';

export const authRoutes = new Hono<{ Variables: AppVariables }>();

authRoutes.get('/providers', (c) => c.json(getProviderAvailability()));

authRoutes.get('/me', requireAuth, getCurrentUser);
authRoutes.post('/refresh', refreshTokens);
authRoutes.post('/logout', logout);

authRoutes.get('/:provider', startAuth);
authRoutes.get('/:provider/callback', handleCallback);
