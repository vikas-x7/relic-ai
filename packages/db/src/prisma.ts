import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

let prisma: PrismaClient | undefined;

/**
 * Create the client only when a route actually needs the database. This lets
 * health checks work and gives a useful application error instead of crashing
 * the whole serverless function while it is being imported.
 */
export function getPrisma(): PrismaClient {
  if (prisma) return prisma;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('Missing database configuration: DATABASE_URL');
  }

  const adapter = new PrismaPg({ connectionString });
  prisma = new PrismaClient({ adapter });
  return prisma;
}
