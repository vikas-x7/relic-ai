import Landing from '@/src/modules/landing/Landing';
import PublicOnlyGuard from '@/src/modules/auth/guards/PublicOnlyGuard';

export default function Home() {
  return (
    <div>
      <PublicOnlyGuard>
        <Landing />
      </PublicOnlyGuard>
    </div>
  );
}
