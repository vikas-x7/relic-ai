import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { createApp } from '@/app';

const service = jest.requireMock('../services/auth.service') as {
  findOrCreateUser: jest.Mock;
  findRefreshToken: jest.Mock;
  findUserById: jest.Mock;
  revokeRefreshToken: jest.Mock;
  storeRefreshToken: jest.Mock;
};

jest.mock('../services/auth.service', () => ({
  findOrCreateUser: jest.fn(),
  findRefreshToken: jest.fn(),
  findUserById: jest.fn(),
  revokeRefreshToken: jest.fn(),
  storeRefreshToken: jest.fn(),
}));

describe('auth routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/auth/providers returns configured providers', async () => {
    const app = createApp();
    const res = await app.request('/api/auth/providers');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ google: true, github: true });
  });

  it('GET /api/auth/me returns 401 when no auth cookie', async () => {
    const app = createApp();
    const res = await app.request('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('POST /api/auth/refresh returns 401 when no refresh cookie', async () => {
    const app = createApp();
    const res = await app.request('/api/auth/refresh', { method: 'POST' });
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('No refresh token');
  });

  it('POST /api/auth/logout clears cookies and revokes token', async () => {
    const app = createApp();
    const res = await app.request('/api/auth/logout', { method: 'POST' });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it('GET /api/auth/google redirects to google authorize url', async () => {
    const app = createApp();
    const res = await app.request('/api/auth/google');
    expect(res.status).toBe(302);
    const location = res.headers.get('location') ?? '';
    expect(location).toContain('accounts.google.com/o/oauth2/v2/auth');
  });

  it('GET /api/auth/unknown returns 400 for unsupported provider', async () => {
    const app = createApp();
    const res = await app.request('/api/auth/unknown');
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Unsupported provider');
  });

  it('GET /api/auth/google/callback redirects to web when state mismatches', async () => {
    const app = createApp();
    const res = await app.request('/api/auth/google/callback?state=some-state');
    expect(res.status).toBe(302);
    const location = res.headers.get('location') ?? '';
    expect(location).toContain('/auth?auth=error&reason=invalid_state');
  });

  it('GET /api/auth/google/callback redirects to web when code is missing', async () => {
    const app = createApp();
    const res = await app.request('/api/auth/google/callback?state=abc', {
      headers: { cookie: 'relic_oauth_state=abc' },
    });
    expect(res.status).toBe(302);
    const location = res.headers.get('location') ?? '';
    expect(location).toContain('/auth?auth=error&reason=invalid_state');
  });

  it('POST /api/auth/refresh returns 401 when refresh token not found in db', async () => {
    const jwt = jest.requireActual('../tokens/jwt') as typeof import('../tokens/jwt');
    const refresh = await jwt.createRefreshToken({ id: 1, jti: 'test-jti' });
    service.findRefreshToken.mockResolvedValue(null as never);

    const app = createApp();
    const res = await app.request('/api/auth/refresh', {
      method: 'POST',
      headers: { cookie: 'relic_refresh_token=' + refresh },
    });
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Refresh token revoked or expired');
  });
});
