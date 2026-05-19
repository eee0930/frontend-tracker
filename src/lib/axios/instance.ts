import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor: 모든 요청에 access token 첨부
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor: 401 발생 시 token refresh 후 재시도
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const is401 = error.response?.status === 401;
    const isNotRefreshEndpoint = !originalRequest.url?.includes('/auth/refresh');
    const isFirstAttempt = !originalRequest._retry;

    if (is401 && isNotRefreshEndpoint && isFirstAttempt) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        setAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch {
        clearAccessToken();
        // 인증 실패 → 로그인 페이지로 이동 처리는 store에서 담당
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// --- Token 관리 함수 ---
// 메모리에 저장. 모듈 스코프 변수는 JS heap에만 존재하고
// localStorage/sessionStorage와 달리 다른 스크립트가 접근할 수 없다.
let _accessToken: string | null = null;

export function getAccessToken(): string | null {
  return _accessToken;
}

export function setAccessToken(token: string): void {
  _accessToken = token;
}

export function clearAccessToken(): void {
  _accessToken = null;
}

async function refreshAccessToken(): Promise<string> {
  // withCredentials: true 이므로 refresh token cookie가 자동 전송됨
  const response = await axiosInstance.post<{ accessToken: string }>(
    '/auth/refresh'
  );
  return response.data.accessToken;
}
