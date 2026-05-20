'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api/auth.api';
import { getAccessToken } from '@/lib/axios/instance';
import { useAuthStore } from '@/features/auth/store/auth.store';

export const AUTH_ME_QUERY_KEY = ['auth', 'me'] as const;

export function useAuthMe() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: () => authApi.getMe(),

    // 새로고침할 때마다 항상 서버에서 확인
    // access token이 메모리에서 날아났으므로 stale 여부 무관하게 실행
    staleTime: 0,

    // 401 → interceptor가 refresh 후 재요청을 처리
    // 그래도 실패하면(refresh 만료) isError: true로 떨어짐
    retry: false,
  });

  useEffect(() => {
    if (!isSuccess || !data?.data.user) return;

    // /auth/me 성공: interceptor가 이미 access token을 갱신한 상태
    // getAccessToken()으로 현재 메모리 토큰을 읽어 Zustand와 동기화
    const token = getAccessToken();
    if (token) {
      setAuth(data.data.user, token);
    }
  }, [isSuccess, data, setAuth]);

  useEffect(() => {
    if (isError) {
      clearAuth();
    }
  }, [isError, clearAuth]);

  return { isLoading, isError };
}
