import { getPrisma } from 'db'
import type { Provider } from '../oauth/oauth'

export async function findOrCreateUser(input: {
  provider: Provider
  providerId: string
  email: string
  name: string
  avatar: string
}) {
  const prisma = getPrisma()
  const existing = await prisma.account.findUnique({
    where: { provider_providerId: { provider: input.provider, providerId: input.providerId } },
    include: { user: true },
  })
  if (existing) {
    return prisma.user.update({
      where: { id: existing.userId },
      data: {
        name: input.name || existing.user.name || undefined,
        avatar: input.avatar || existing.user.avatar || undefined,
      },
    })
  }

  let user = await prisma.user.findUnique({ where: { email: input.email } })
  if (!user) {
    user = await prisma.user.create({
      data: { email: input.email, name: input.name || null, avatar: input.avatar || null },
    })
  }
  await prisma.account.create({
    data: {
      userId: user.id,
      provider: input.provider,
      providerId: input.providerId,
    },
  })
  return user
}

export async function storeRefreshToken(input: { jti: string; userId: number; expiresAt: Date }) {
  const prisma = getPrisma()
  return prisma.refreshToken.create({
    data: {
      jti: input.jti,
      userId: input.userId,
      expiresAt: input.expiresAt,
    },
  })
}

export async function findRefreshToken(jti: string) {
  const prisma = getPrisma()
  return prisma.refreshToken.findUnique({ where: { jti } })
}

export async function revokeRefreshToken(jti: string) {
  const prisma = getPrisma()
  return prisma.refreshToken.update({
    where: { jti },
    data: { revokedAt: new Date() },
  })
}

export async function findUserById(id: number) {
  const prisma = getPrisma()
  return prisma.user.findUnique({ where: { id } })
}
