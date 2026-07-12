import { Pool, type PoolConfig } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { env } from './env';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: Pool;
};

const poolConfig: PoolConfig = {
  max: env.DATABASE_POOL_MAX,
  idleTimeoutMillis: env.DATABASE_POOL_IDLE_TIMEOUT_MS,
  connectionTimeoutMillis: env.DATABASE_POOL_CONNECTION_TIMEOUT_MS,
  allowExitOnIdle: false,
};

function createPool(connectionString: string): Pool {
  return new Pool({ ...poolConfig, connectionString });
}

function logConfig(): { level: 'query' | 'warn' | 'error'; emit: 'event' }[] {
  if (env.DATABASE_LOGGING === 'none') return [];
  const levels = env.DATABASE_LOGGING === 'query' ? ['query', 'warn', 'error'] : ['warn', 'error'];
  return levels.map((level) => ({
    level: level as 'query' | 'warn' | 'error',
    emit: 'event' as const,
  }));
}

function createPgPool(): Pool {
  const pool = createPool(env.DATABASE_URL);
  globalForPrisma.pgPool = pool;
  return pool;
}

function createPrismaClient(): PrismaClient {
  const pool = createPgPool();

  const adapter = new PrismaPg(pool, {
    disposeExternalPool: false,
    onPoolError: (err) => console.error('[db] pool error:', err),
    onConnectionError: (err) => console.error('[db] connection error:', err),
  });

  const client = new PrismaClient({
    adapter,
    log: logConfig(),
  });

  if (env.DATABASE_LOGGING !== 'none') {
    client.$on('query', (e) => console.log(`[db] ${e.duration}ms ${e.query}`));
    client.$on('warn', (e) => console.warn('[db] warn:', e.message));
    client.$on('error', (e) => console.error('[db] error:', e.message));
  }

  client.$connect().catch((err) => {
    console.error('[db] failed to connect to the database:', err);
  });

  return client;
}

export function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const client = createPrismaClient();
  globalForPrisma.prisma = client;
  return client;
}

export async function disconnectPrisma(): Promise<void> {
  if (globalForPrisma.prisma) {
    await globalForPrisma.prisma.$disconnect();
    globalForPrisma.prisma = undefined;
  }
  if (globalForPrisma.pgPool) {
    await globalForPrisma.pgPool.end();
    globalForPrisma.pgPool = undefined;
  }
}

export function getPgPool(): Pool {
  if (globalForPrisma.pgPool) return globalForPrisma.pgPool;
  return createPgPool();
}
