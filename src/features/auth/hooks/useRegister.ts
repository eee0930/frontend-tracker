'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { RegisterRequest } from '@/features/auth/types/auth.types';

export function useRegister() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),

    onSuccess: (response) => {
      const { user, accessToken } = response.data;
      setAuth(user, accessToken);
      router.push('/home');
    },

    onError: (err: unknown) => {
      console.error('[useRegister] 회원가입 실패:', err);
    },
  });

  return {
    register: mutate,
    isPending,
    isError,
    error,
  };
}
