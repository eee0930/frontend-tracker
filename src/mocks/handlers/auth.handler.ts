import { http, HttpResponse, delay } from 'msw';
import type { LoginRequest, RegisterRequest } from '@/features/auth/types/auth.types';

// 메모리 내 가짜 사용자 DB
const mockUsers = [
  {
    id: 'user-1',
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  },
];

// 발급된 refresh token 저장소 (실제 서버에서는 DB나 Redis에 저장)
const validRefreshTokens = new Set<string>();

function generateAccessToken(userId: string): string {
  // 실제로는 JWT. Mock에서는 식별 가능한 문자열로 대체
  return `mock-access-token-${userId}-${Date.now()}`;
}

function generateRefreshToken(userId: string): string {
  const token = `mock-refresh-token-${userId}-${Date.now()}`;
  validRefreshTokens.add(token);
  return token;
}

export const authHandlers = [
  // POST /api/auth/login
  http.post('/api/auth/login', async ({ request }) => {
    await delay(400); // 실제 네트워크 지연 시뮬레이션

    const body = await request.json() as LoginRequest;
    const user = mockUsers.find((u) => u.email === body.email);

    if (!user) {
      return HttpResponse.json(
        { success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    if (user.password !== body.password) {
      return HttpResponse.json(
        { success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // refresh token은 httpOnly 쿠키로 전달 (XSS로 읽을 수 없음)
    return HttpResponse.json(
      {
        success: true,
        message: '로그인 성공',
        data: {
          user: { id: user.id, email: user.email, name: user.name },
          accessToken,
        },
      },
      {
        headers: {
          // MSW에서 Set-Cookie 시뮬레이션
          // 실제 서버에서는 HttpOnly; Secure; SameSite=Strict 플래그 추가
          'Set-Cookie': `refreshToken=${refreshToken}; Path=/; HttpOnly; SameSite=Strict`,
        },
      }
    );
  }),

  // POST /api/auth/register
  http.post('/api/auth/register', async ({ request }) => {
    await delay(400);

    const body = await request.json() as RegisterRequest;
    const existingUser = mockUsers.find((u) => u.email === body.email);

    if (existingUser) {
      return HttpResponse.json(
        { success: false, message: '이미 사용 중인 이메일입니다.', code: 'EMAIL_ALREADY_EXISTS' },
        { status: 409 }
      );
    }

    const newUser = {
      id: `user-${mockUsers.length + 1}`,
      email: body.email,
      password: body.password,
      name: body.name,
    };
    mockUsers.push(newUser);

    const accessToken = generateAccessToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);

    return HttpResponse.json(
      {
        success: true,
        message: '회원가입 성공',
        data: {
          user: { id: newUser.id, email: newUser.email, name: newUser.name },
          accessToken,
        },
      },
      {
        status: 201,
        headers: {
          'Set-Cookie': `refreshToken=${refreshToken}; Path=/; HttpOnly; SameSite=Strict`,
        },
      }
    );
  }),

  // POST /api/auth/refresh
  // 브라우저가 쿠키를 자동 전송 → refresh token 검증 → 새 access token 발급
  http.post('/api/auth/refresh', async ({ cookies }) => {
    await delay(200);

    const refreshToken = cookies.refreshToken;

    if (!refreshToken || !validRefreshTokens.has(refreshToken)) {
      return HttpResponse.json(
        { success: false, message: '세션이 만료되었습니다. 다시 로그인해주세요.', code: 'REFRESH_TOKEN_EXPIRED' },
        { status: 401 }
      );
    }

    // 기존 refresh token 무효화 (Refresh Token Rotation)
    validRefreshTokens.delete(refreshToken);

    // userId 추출 (mock 토큰 파싱)
    const userId = refreshToken.split('-')[3];
    const newAccessToken = generateAccessToken(userId);
    const newRefreshToken = generateRefreshToken(userId);

    return HttpResponse.json(
      {
        success: true,
        message: '토큰 갱신 성공',
        data: { accessToken: newAccessToken },
      },
      {
        headers: {
          'Set-Cookie': `refreshToken=${newRefreshToken}; Path=/; HttpOnly; SameSite=Strict`,
        },
      }
    );
  }),

  // GET /api/auth/me
  http.get('/api/auth/me', async ({ request }) => {
    await delay(300);

    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json(
        { success: false, message: '인증이 필요합니다.', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // mock-access-token-{userId}-{timestamp} 형태
    if (!token.startsWith('mock-access-token-')) {
      return HttpResponse.json(
        { success: false, message: '유효하지 않은 토큰입니다.', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
    }

    const userId = token.split('-')[3];
    const user = mockUsers.find((u) => u.id === `user-${userId.replace('user', '')}`);

    if (!user) {
      return HttpResponse.json(
        { success: false, message: '사용자를 찾을 수 없습니다.', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      message: '사용자 정보 조회 성공',
      data: { user: { id: user.id, email: user.email, name: user.name } },
    });
  }),

  // POST /api/auth/logout
  http.post('/api/auth/logout', async ({ cookies }) => {
    await delay(200);
    const refreshToken = cookies.refreshToken;
    if (refreshToken) {
      validRefreshTokens.delete(refreshToken);
    }
    return HttpResponse.json(
      { success: true, message: '로그아웃 성공' },
      {
        headers: {
          'Set-Cookie': 'refreshToken=; Path=/; HttpOnly; Max-Age=0',
        },
      }
    );
  }),
];
