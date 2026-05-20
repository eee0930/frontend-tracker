import { AxiosError } from 'axios';
import type { ApiError } from '@/shared/types/api.types';

export function getApiErrorMessage(
  error: unknown,
  fallback = '오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
): string {
  if (error instanceof AxiosError) {
    return (error.response?.data as ApiError)?.message ?? fallback;
  }
  return fallback;
}
