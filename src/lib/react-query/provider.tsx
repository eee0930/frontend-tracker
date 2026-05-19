'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 데이터를 fresh로 간주하는 시간 (ms)
        // 0이면 마운트할 때마다 항상 refetch → API 과호출
        // 60초면 60초 내 같은 쿼리는 캐시에서 즉시 반환
        staleTime: 60 * 1000,

        // 캐시에서 비활성 쿼리 데이터를 보관하는 시간
        // 컴포넌트가 언마운트된 후에도 이 시간 동안은 캐시 유지
        gcTime: 5 * 60 * 1000,

        // 401, 403은 재시도해봐야 의미 없음
        // 네트워크 에러(5xx)는 1번만 재시도
        retry: (failureCount, error: unknown) => {
          const status = (error as { response?: { status?: number } })?.response
            ?.status;
          if (status === 401 || status === 403 || status === 404) return false;
          return failureCount < 1;
        },

        // 탭 포커스 시 자동 refetch (기본값 true)
        // 실시간성이 중요한 앱은 true, 그렇지 않으면 false로 끄기도 함
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

// SSR 환경에서 서버/클라이언트가 같은 QueryClient를 공유하지 않도록
// 컴포넌트 외부에 싱글턴을 두지 않고 useState로 생성
let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
