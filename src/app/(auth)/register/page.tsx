import { RegisterForm } from '@/features/auth/components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">회원가입</h1>
          <p className="mt-2 text-sm text-gray-500">새 계정을 만드세요</p>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
