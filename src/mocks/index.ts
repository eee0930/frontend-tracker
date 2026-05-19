export async function initMocks() {
  if (typeof window === 'undefined') return;

  const { worker } = await import('./browser');

  await worker.start({
    onUnhandledRequest: 'bypass', // Mock 핸들러 없는 요청은 그냥 통과
  });
}
