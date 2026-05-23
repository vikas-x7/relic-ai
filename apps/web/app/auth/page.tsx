import Auth from '@/src/modules/auth/Auth';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AuthPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const error = typeof resolvedSearchParams.error === 'string' ? resolvedSearchParams.error : undefined;

  return <Auth error={error} />;
}
