'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Auth from '@/src/modules/auth/Auth';
import PublicOnlyGuard from '@/src/modules/auth/guards/PublicOnlyGuard';

function AuthContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('reason') ?? undefined;

  return (
    <PublicOnlyGuard>
      <Auth error={error} />
    </PublicOnlyGuard>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthContent />
    </Suspense>
  );
}
