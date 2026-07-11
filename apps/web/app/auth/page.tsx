'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Auth from '@/src/modules/auth/Auth';
import { useUser } from '@/src/modules/auth/hooks/useAuth';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('reason') ?? undefined;
  const { data, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && data?.user) {
      router.replace('/chat');
    }
  }, [data, isLoading, router]);

  return <Auth error={error} />;
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthContent />
    </Suspense>
  );
}
