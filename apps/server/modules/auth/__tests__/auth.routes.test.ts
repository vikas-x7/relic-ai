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

  it('POST /api/auth/logout clears access and refresh cookies with the configured domain', async () => {
    const app = createApp();
    const res = await app.request('/api/auth/logout', { method: 'POST' });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    const setCookies = res.headers.getSetCookie();
    const access = setCookies.find((c) => c.startsWith('relic_access_token='));
    const refresh = setCookies.find((c) => c.startsWith('relic_refresh_token='));
    expect(access).toContain('Max-Age=0');
    expect(access).toContain('Path=/');
    expect(access).toContain('Domain=relicai.in');
    expect(refresh).toContain('Max-Age=0');
    expect(refresh).toContain('Path=/');
    expect(refresh).toContain('Domain=relicai.in');
  });

  it('clears the oauth state cookie with the configured domain on callback', async () => {
    const app = createApp();
    const res = await app.request('/api/auth/google/callback?state=abc', {
      headers: { cookie: 'relic_oauth_state=abc' },
    });
    expect(res.status).toBe(302);

    const setCookies = res.headers.getSetCookie();
    const state = setCookies.find((c) => c.startsWith('relic_oauth_state='));
    expect(state).toBeDefined();
    expect(state).toContain('Max-Age=0');
    expect(state).toContain('Path=/');
    expect(state).toContain('Domain=relicai.in');
  });

  it('POST /api/auth/refresh rotates the refresh token and issues a fresh 15-day cookie', async () => {
    const jwt = jest.requireActual('../tokens/jwt') as typeof import('../tokens/jwt');
    const refresh = await jwt.createRefreshToken({ id: 1, jti: 'rotatable-jti' });
    const future = new Date(Date.now() + 1000 * 60 * 60 * 24 * 15);
    service.findRefreshToken.mockResolvedValue({
      jti: 'rotatable-jti',
      userId: 1,
      revokedAt: null,
      expiresAt: future,
    } as never);
    service.findUserById.mockResolvedValue({
      id: 1,
      email: 'user@relicai.in',
      name: 'Test User',
      avatar: '',
    } as never);
    service.revokeRefreshToken.mockResolvedValue({} as never);
    service.storeRefreshToken.mockResolvedValue({} as never);

    const app = createApp();
    const res = await app.request('/api/auth/refresh', {
      method: 'POST',
      headers: { cookie: 'relic_refresh_token=' + refresh },
    });
    expect(res.status).toBe(200);
    expect(service.revokeRefreshToken).toHaveBeenCalledWith('rotatable-jti');
    expect(service.storeRefreshToken).toHaveBeenCalled();

    const stored = service.storeRefreshToken.mock.calls[0][0] as {
      expiresAt: Date;
    };
    const daysMs = 15 * 24 * 60 * 60 * 1000;
    expect(Math.abs(stored.expiresAt.getTime() - (Date.now() + daysMs))).toBeLessThan(60_000);

    const setCookies = res.headers.getSetCookie();
    const refreshCookie = setCookies.find((c) => c.startsWith('relic_refresh_token='));
    const accessCookie = setCookies.find((c) => c.startsWith('relic_access_token='));
    expect(refreshCookie).toContain('Max-Age=1296000');
    expect(refreshCookie).toContain('Domain=relicai.in');
    expect(accessCookie).toContain('Max-Age=900');
  });

  it('POST /api/auth/refresh returns 401 and clears cookies for an expired refresh token', async () => {
    const honoJwt = jest.requireActual('hono/jwt') as typeof import('hono/jwt');
    const expired = await honoJwt.sign(
      {
        type: 'refresh',
        sub: '1',
        jti: 'expired-jti',
        exp: Math.floor(Date.now() / 1000) - 60,
      },
      (process.env.REFRESH_TOKEN_SECRET as string) ?? 'test-refresh-secret',
      'HS256',
    );

    const app = createApp();
    const res = await app.request('/api/auth/refresh', {
      method: 'POST',
      headers: { cookie: 'relic_refresh_token=' + expired },
    });
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Invalid refresh token');
    expect(service.findRefreshToken).not.toHaveBeenCalled();

    const setCookies = res.headers.getSetCookie();
    const access = setCookies.find((c) => c.startsWith('relic_access_token='));
    const refresh = setCookies.find((c) => c.startsWith('relic_refresh_token='));
    expect(access).toContain('Max-Age=0');
    expect(refresh).toContain('Max-Age=0');
  });

  it('POST /api/auth/refresh returns 401 and clears cookies for a revoked refresh token', async () => {
    const jwt = jest.requireActual('../tokens/jwt') as typeof import('../tokens/jwt');
    const refresh = await jwt.createRefreshToken({ id: 1, jti: 'revoked-jti' });
    service.findRefreshToken.mockResolvedValue({
      jti: 'revoked-jti',
      userId: 1,
      revokedAt: new Date(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
    } as never);

    const app = createApp();
    const res = await app.request('/api/auth/refresh', {
      method: 'POST',
      headers: { cookie: 'relic_refresh_token=' + refresh },
    });
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Refresh token revoked or expired');

    const setCookies = res.headers.getSetCookie();
    const access = setCookies.find((c) => c.startsWith('relic_access_token='));
    const refreshCookie = setCookies.find((c) => c.startsWith('relic_refresh_token='));
    expect(access).toContain('Max-Age=0');
    expect(refreshCookie).toContain('Max-Age=0');
  });
});
