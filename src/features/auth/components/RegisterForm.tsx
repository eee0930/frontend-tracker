'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { getApiErrorMessage } from '@/shared/utils/error';

const registerSchema = z
  .object({
    name: z.string().min(1, '이름을 입력해주세요.').min(2, '이름은 2자 이상이어야 합니다.'),
    email: z.string().min(1, '이메일을 입력해주세요.').email('올바른 이메일 형식이 아닙니다.'),
    password: z.string().min(1, '비밀번호를 입력해주세요.').min(8, '비밀번호는 8자 이상이어야 합니다.'),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'], // 에러를 confirmPassword 필드에 표시
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register: registerUser, isPending, isError, error } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = ({ name, email, password }: RegisterFormValues) => {
    // confirmPassword는 서버에 보내지 않음 — 클라이언트 전용 검증
    registerUser({ name, email, password });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <Input
        label="이름"
        type="text"
        placeholder="홍길동"
        autoComplete="name"
        error={errors.name?.message}
        {...register('name')}
      />
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
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Input
        label="비밀번호 확인"
        type="password"
        placeholder="비밀번호를 다시 입력"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      {isError && (
        <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
          {getApiErrorMessage(error)}
        </p>
      )}

      <Button type="submit" isLoading={isPending}>
        회원가입
      </Button>

      <p className="text-center text-sm text-gray-500">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="font-medium text-indigo-600 hover:underline">
          로그인
        </Link>
      </p>
    </form>
  );
}
