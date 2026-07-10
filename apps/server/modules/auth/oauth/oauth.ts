import { env } from '../../../config/env'

export type Provider = 'google' | 'github'

interface ProviderConfig {
  clientId: string
  clientSecret: string
  authorizeUrl: string
  tokenUrl: string
  userinfoUrl: string
  scopes: string[]
  userinfoMapper: (data: Record<string, unknown>) => {
    providerId: string
    email: string
    name: string
    avatar: string
  }
}

const providers: Record<Provider, ProviderConfig> = {
  google: {
    clientId: env.google.clientId,
    clientSecret: env.google.clientSecret,
    authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userinfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    scopes: ['openid', 'email', 'profile'],
    userinfoMapper: (data) => ({
      providerId: String(data.id),
      email: String(data.email),
      name: String(data.name ?? data.given_name ?? ''),
      avatar: String(data.picture ?? ''),
    }),
  },
  github: {
    clientId: env.github.clientId,
    clientSecret: env.github.clientSecret,
    authorizeUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userinfoUrl: 'https://api.github.com/user',
    scopes: ['read:user', 'user:email'],
    userinfoMapper: (data) => ({
      providerId: String(data.id),
      email: String(data.email ?? ''),
      name: String(data.name ?? data.login ?? ''),
      avatar: String(data.avatar_url ?? ''),
    }),
  },
}

export function isProvider(value?: string): value is Provider {
  return value === 'google' || value === 'github'
}

export function isProviderConfigured(provider: Provider): boolean {
  const p = providers[provider]
  return Boolean(p.clientId && p.clientSecret)
}

export function callbackUrl(provider: Provider): string {
  return `${env.serverUrl}/api/auth/${provider}/callback`
}

export async function generatePkce(): Promise<{ verifier: string; challenge: string }> {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const random = new Uint8Array(64)
  crypto.getRandomValues(random)
  let verifier = ''
  for (const byte of random) {
    verifier += charset[byte % charset.length]
  }
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  const challenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  return { verifier, challenge }
}

export async function buildAuthorizeUrl(
  provider: Provider,
  state: string,
  pkce?: { verifier: string; challenge: string },
): Promise<string> {
  const p = providers[provider]
  const params = new URLSearchParams({
    client_id: p.clientId,
    redirect_uri: callbackUrl(provider),
    response_type: 'code',
    scope: p.scopes.join(' '),
    state,
  })
  if (pkce) {
    params.set('code_challenge', pkce.challenge)
    params.set('code_challenge_method', 'S256')
  }
  return `${p.authorizeUrl}?${params.toString()}`
}

export async function exchangeCodeForToken(
  provider: Provider,
  code: string,
  verifier?: string,
): Promise<{ accessToken: string; refreshToken?: string }> {
  const p = providers[provider]
  const params = new URLSearchParams({
    client_id: p.clientId,
    client_secret: p.clientSecret,
    code,
    redirect_uri: callbackUrl(provider),
    grant_type: 'authorization_code',
  })
  if (verifier) {
    params.set('code_verifier', verifier)
  }
  const res = await fetch(p.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: params.toString(),
  })
  const data = (await res.json()) as Record<string, string>
  if (!res.ok || !data.access_token) {
    throw new Error(`OAuth token exchange failed: ${JSON.stringify(data)}`)
  }
  return { accessToken: data.access_token, refreshToken: data.refresh_token }
}

export async function fetchOAuthUser(provider: Provider, accessToken: string) {
  const p = providers[provider]
  const res = await fetch(p.userinfoUrl, {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch ${provider} user info: ${res.status}`)
  }
  const data = (await res.json()) as Record<string, unknown>
  return p.userinfoMapper(data)
}
