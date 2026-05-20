import { axiosInstance } from '@/lib/axios/instance';
import type { ApiResponse } from '@/shared/types/api.types';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from '@/features/auth/types/auth.types';

export const authApi = {
  login: (data: LoginRequest) =>
    axiosInstance
      .post<ApiResponse<LoginResponse>>('/auth/login', data)
      .then((res) => res.data),

  register: (data: RegisterRequest) =>
    axiosInstance
      .post<ApiResponse<LoginResponse>>('/auth/register', data)
      .then((res) => res.data),

  refresh: () =>
    axiosInstance
      .post<ApiResponse<{ accessToken: string }>>('/auth/refresh')
      .then((res) => res.data),

  getMe: () =>
    axiosInstance
      .get<ApiResponse<{ user: User }>>('/auth/me')
      .then((res) => res.data),

  logout: () =>
    axiosInstance.post('/auth/logout').then((res) => res.data),
};
