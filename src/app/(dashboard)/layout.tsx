'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthMe } from '@/features/auth/hooks/useAuthMe';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoading, isError } = useAuthMe();

  useEffect(() => {
    if (isError) {
      router.replace('/login');
    }
  }, [isError, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    // useEffect의 router.replace가 실행되는 동안 잠깐 빈 화면 표시
    return null;
  }

  return <>{children}</>;
}
