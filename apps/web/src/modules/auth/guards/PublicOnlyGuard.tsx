'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/src/modules/auth/hooks/useAuth';

export default function PublicOnlyGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && data?.user) {
      router.replace('/chat');
    }
  }, [data, isLoading, router]);

  if (isLoading || data?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
