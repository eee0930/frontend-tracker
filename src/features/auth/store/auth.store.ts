import { create } from 'zustand';
import {
  clearAccessToken,
  setAccessToken,
} from '@/lib/axios/instance';
import type { User } from '@/features/auth/types/auth.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isAuthenticated: false,

  setAuth: (user, accessToken) => {
    // axios instance의 메모리 토큰과 동기화
    setAccessToken(accessToken);
    set({ user, isAuthenticated: true });
  },

  clearAuth: () => {
    // axios instance의 메모리 토큰도 함께 초기화
    clearAccessToken();
    set({ user: null, isAuthenticated: false });
  },
}));

// 컴포넌트 리렌더 최소화를 위한 selector 함수들
// useAuthStore(selectUser) 형태로 사용
// → user가 바뀔 때만 해당 컴포넌트 리렌더
export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuthenticated = (state: AuthStore) =>
  state.isAuthenticated;
