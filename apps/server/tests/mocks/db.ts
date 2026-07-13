import type { Provider } from '../../modules/auth/oauth/oauth';

export function getPrisma() {
  return null as never;
}

export async function disconnectPrisma(): Promise<void> {}

export function getPgPool() {
  return null as never;
}

export const env = {
  NODE_ENV: 'test',
  DATABASE_URL: 'postgresql://localhost:5432/test',
};

export type ProviderType = Provider;
