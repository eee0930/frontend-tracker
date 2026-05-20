'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore, selectUser } from '@/features/auth/store/auth.store';
import { authApi } from '@/features/auth/api/auth.api';
import { Button } from '@/shared/components/ui/Button';

export function HomeView() {
  const user = useAuthStore(selectUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      // 서버 로그아웃 성공 여부와 관계없이 클라이언트 상태는 초기화
      clearAuth();
      router.replace('/login');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">Frontend Tracker</span>
          <Button variant="ghost" onClick={handleLogout} className="w-auto px-4">
            로그아웃
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            안녕하세요, {user?.name ?? '사용자'}님 👋
          </h1>
          <p className="mt-2 text-sm text-gray-500">{user?.email}</p>

          <div className="mt-8 rounded-xl bg-indigo-50 p-6">
            <p className="text-sm font-medium text-indigo-700">현재 로그인 상태</p>
            <pre className="mt-2 text-xs text-indigo-600">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}
