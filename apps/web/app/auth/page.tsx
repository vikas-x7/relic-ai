'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Auth from '@/src/modules/auth/Auth';

function AuthContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('reason') ?? undefined;

  return <Auth error={error} />;
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthContent />
    </Suspense>
  );
}
