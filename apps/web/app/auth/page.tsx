'use client';

import { useSearchParams } from 'next/navigation';
import Auth from '@/src/modules/auth/Auth';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('reason') ?? undefined;

  return <Auth error={error} />;
}
