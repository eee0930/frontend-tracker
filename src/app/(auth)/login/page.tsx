import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">로그인</h1>
          <p className="mt-2 text-sm text-gray-500">계정에 로그인하세요</p>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
