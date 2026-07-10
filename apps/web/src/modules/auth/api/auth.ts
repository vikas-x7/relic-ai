import api from '@/src/lib/api/axios';
import type { AuthResponse, ProviderAvailability } from '@/src/modules/auth/schemas/types';

export async function getProviders(): Promise<ProviderAvailability> {
  const { data } = await api.get<ProviderAvailability>('/auth/providers');
  return data;
}

export async function getCurrentUser(): Promise<AuthResponse> {
  const { data } = await api.get<AuthResponse>('/auth/me');
  return data;
}

export async function refreshTokens(): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/refresh');
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}
