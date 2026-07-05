import { createHash, randomBytes } from 'node:crypto'
import { env } from '../../config/env'

export type Provider = 'google' | 'github'

export const PROVIDERS: readonly Provider[] = ['google', 'github']

export function isProvider(value: string): value is Provider {
  return (PROVIDERS as readonly string[]).includes(value)
}

export interface OAuthUser {
  provider: Provider
  providerId: string
  email: string
  name: string | null
  avatar: string | null
}

export interface TokenResponse {
  accessToken: string
}

interface ProviderConfig {
  clientId: string
  clientSecret: string
  authorizeUrl: string
  tokenUrl: string
  scope: string
  pkce: boolean
  fetchUser: (accessToken: string) => Promise<Omit<OAuthUser, 'provider'>>
}

const providerConfigs: Record<Provider, ProviderConfig> = {
  google: {
    clientId: env.google.clientId,
    clientSecret: env.google.clientSecret,
    authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scope: 'openid email profile',
    pkce: true,
    fetchUser: async (accessToken) => {
      const res = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!res.ok) {
        throw new Error(`Failed to fetch Google userinfo: ${res.status}`)
      }
      const data = (await res.json()) as {
        sub: string
        email?: string
        name?: string
        picture?: string
      }
      if (!data.email) {
        throw new Error('Google account has no email address')
      }
      return {
        providerId: data.sub,
        email: data.email,
        name: data.name ?? null,
        avatar: data.picture ?? null,
      }
    },
  },
  github: {
    clientId: env.github.clientId,
    clientSecret: env.github.clientSecret,
    authorizeUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    scope: 'read:user user:email',
    pkce: false,
    fetchUser: async (accessToken) => {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'relic-ai',
      }

      const res = await fetch('https://api.github.com/user', { headers })
      if (!res.ok) {
        throw new Error(`Failed to fetch GitHub user: ${res.status}`)
      }
      const data = (await res.json()) as {
        id: number
        login: string
        name?: string | null
        avatar_url?: string | null
        email?: string | null
      }

      let email = data.email ?? null
      if (!email) {
        email = await fetchPrimaryEmail(headers)
      }
      if (!email) {
        throw new Error('GitHub account has no public email')
      }

      return {
        providerId: String(data.id),
        email,
        name: data.name ?? data.login,
        avatar: data.avatar_url ?? null,
      }
    },
  },
}

async function fetchPrimaryEmail(headers: Record<string, string>): Promise<string | null> {
  const res = await fetch('https://api.github.com/user/emails', { headers })
  if (!res.ok) {
    return null
  }
  const emails = (await res.json()) as {
    email: string
    primary: boolean
    verified: boolean
  }[]

  const verified = emails.find((e) => e.primary && e.verified)
  return verified?.email ?? emails.find((e) => e.primary)?.email ?? null
}

export function getProviderConfig(provider: Provider): ProviderConfig {
  return providerConfigs[provider]
}

export function isProviderConfigured(provider: Provider): boolean {
  const config = providerConfigs[provider]
  return Boolean(config.clientId && config.clientSecret)
}

export interface PkcePair {
  verifier: string
  challenge: string
}

export function generatePkce(): PkcePair {
  const verifier = randomBytes(32).toString('base64url')
  const challenge = createHash('sha256').update(verifier).digest('base64url')
  return { verifier, challenge }
}

export function buildAuthorizeUrl(
  provider: Provider,
  state: string,
  pkce: PkcePair | null,
): string {
  const config = getProviderConfig(provider)
  const url = new URL(config.authorizeUrl)
  url.searchParams.set('client_id', config.clientId)
  url.searchParams.set('redirect_uri', callbackUrl(provider))
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', config.scope)
  url.searchParams.set('state', state)

  if (config.pkce && pkce) {
    url.searchParams.set('code_challenge', pkce.challenge)
    url.searchParams.set('code_challenge_method', 'S256')
  }
  return url.toString()
}

export function callbackUrl(provider: Provider): string {
  return `${env.serverUrl}/auth/${provider}/callback`
}

export async function exchangeCodeForToken(
  provider: Provider,
  code: string,
  verifier: string | null,
): Promise<TokenResponse> {
  const config = getProviderConfig(provider)
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    redirect_uri: callbackUrl(provider),
    grant_type: 'authorization_code',
  })
  if (config.pkce && verifier) {
    body.set('code_verifier', verifier)
  }

  const res = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body,
  })

  if (!res.ok) {
    throw new Error(`Token exchange failed with ${res.status}`)
  }

  const data = (await res.json()) as { access_token?: string; error?: string; error_description?: string }
  if (!data.access_token) {
    throw new Error(data.error_description ?? data.error ?? 'Token exchange failed')
  }
  return { accessToken: data.access_token }
}

export async function fetchOAuthUser(
  provider: Provider,
  accessToken: string,
): Promise<OAuthUser> {
  const user = await getProviderConfig(provider).fetchUser(accessToken)
  return { provider, ...user }
}
