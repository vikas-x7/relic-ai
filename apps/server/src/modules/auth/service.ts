import { getPrisma } from '../../prisma'
import type { OAuthUser } from './oauth'

export interface AuthUser {
  id: number
  email: string
  name: string | null
  avatar: string | null
}

export async function findOrCreateUser(oauthUser: OAuthUser): Promise<AuthUser> {
  const prisma = getPrisma()
  const existingAccount = await prisma.account.findUnique({
    where: {
      provider_providerId: {
        provider: oauthUser.provider,
        providerId: oauthUser.providerId,
      },
    },
    include: { user: true },
  })

  if (existingAccount) {
    return toAuthUser(existingAccount.user)
  }

  const userByEmail = await prisma.user.findUnique({
    where: { email: oauthUser.email },
  })

  const user =
    userByEmail ??
    (await prisma.user.create({
      data: {
        email: oauthUser.email,
        name: oauthUser.name,
        avatar: oauthUser.avatar,
      },
    }))

  await prisma.account.create({
    data: {
      provider: oauthUser.provider,
      providerId: oauthUser.providerId,
      userId: user.id,
    },
  })

  return toAuthUser(user)
}

export async function storeRefreshToken(input: {
  jti: string
  userId: number
  expiresAt: Date
}): Promise<void> {
  const prisma = getPrisma()
  await prisma.refreshToken.create({
    data: {
      jti: input.jti,
      userId: input.userId,
      expiresAt: input.expiresAt,
    },
  })
}

export async function findRefreshToken(jti: string) {
  const prisma = getPrisma()
  return prisma.refreshToken.findUnique({
    where: { jti },
    include: { user: true },
  })
}

export async function revokeRefreshToken(jti: string): Promise<void> {
  const prisma = getPrisma()
  await prisma.refreshToken.update({
    where: { jti },
    data: { revokedAt: new Date() },
  })
}

function toAuthUser(user: {
  id: number
  email: string
  name: string | null
  avatar: string | null
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
  }
}
