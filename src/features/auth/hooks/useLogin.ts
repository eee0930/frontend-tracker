'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { LoginRequest } from '@/features/auth/types/auth.types';

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { mutate, mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),

    onSuccess: (response) => {
      const { user, accessToken } = response.data;
      // Zustand store 업데이트 → axios 메모리 토큰도 동시에 갱신
      setAuth(user, accessToken);
      router.push('/home');
    },

    onError: (err: unknown) => {
      // 에러 처리는 hook에서 하지 않고 컴포넌트로 위임
      // hook이 UI(toast, alert)에 의존하면 재사용성이 떨어짐
      console.error('[useLogin] 로그인 실패:', err);
    },
  });

  return {
    login: mutate,
    loginAsync: mutateAsync,
    isPending,
    isError,
    error,
  };
}
