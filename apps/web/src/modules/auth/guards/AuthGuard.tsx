'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/src/modules/auth/hooks/useAuth';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !data?.user) {
      router.replace('/auth');
    }
  }, [data, isLoading, router]);

  if (isLoading || !data?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
