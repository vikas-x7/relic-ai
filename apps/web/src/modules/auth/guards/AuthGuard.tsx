'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/src/modules/auth/hooks/useAuth';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isLoading, error } = useUser();

  useEffect(() => {
    if (!isLoading && !data?.user) {
      console.log('[AuthGuard] No user, redirecting to /auth', { error });
      router.replace('/auth');
    }
  }, [data, isLoading, router, error]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          {/* <p className="text-sm text-white/50">Verifying authentication...</p> */}
        </div>
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        {/* <p className="text-sm text-white/50">Redirecting to login...</p> */}
      </div>
    );
  }

  return <>{children}</>;
}
