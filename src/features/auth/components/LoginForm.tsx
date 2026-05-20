'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { getApiErrorMessage } from '@/shared/utils/error';

const loginSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요.').email('올바른 이메일 형식이 아닙니다.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.').min(8, '비밀번호는 8자 이상이어야 합니다.'),
});

// 스키마에서 타입 자동 추론 — 타입 선언을 별도로 작성할 필요 없음
type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login, isPending, isError, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <Input
        label="이메일"
        type="email"
        placeholder="test@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="비밀번호"
        type="password"
        placeholder="8자 이상 입력"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      {/* 서버 에러: API 호출 실패 시 표시 */}
      {isError && (
        <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
          {getApiErrorMessage(error)}
        </p>
      )}

      <Button type="submit" isLoading={isPending}>
        로그인
      </Button>

      <p className="text-center text-sm text-gray-500">
        계정이 없으신가요?{' '}
        <Link href="/register" className="font-medium text-indigo-600 hover:underline">
          회원가입
        </Link>
      </p>
    </form>
  );
}
