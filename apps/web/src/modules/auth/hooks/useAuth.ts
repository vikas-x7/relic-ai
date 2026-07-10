import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser, logout, getProviders } from '@/src/modules/auth/api/auth';

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProviders() {
  return useQuery({
    queryKey: ['providers'],
    queryFn: getProviders,
    staleTime: 10 * 60 * 1000,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      window.location.href = '/auth';
    },
  });
}
