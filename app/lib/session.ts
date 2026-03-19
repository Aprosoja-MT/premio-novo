import { redirect } from 'react-router';
import type { Role } from '~/generated/prisma';
import { AuthGateway } from '~/gateways/AuthGateway';
import { InvalidRefreshToken } from '~/errors/InvalidRefreshToken';

export function getSessionFromRequest(request: Request) {
  const cookieHeader = request.headers.get('Cookie') ?? '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    }),
  );
  const accessToken = cookies['accessToken'];
  const refreshToken = cookies['refreshToken'];
  if (!accessToken || !refreshToken) { return null; }
  return { accessToken, refreshToken };
}

export function buildSessionCookies(tokens: { accessToken: string; refreshToken: string }) {
  return [
    `accessToken=${tokens.accessToken}; HttpOnly; Path=/; SameSite=Lax`,
    `refreshToken=${tokens.refreshToken}; HttpOnly; Path=/; SameSite=Lax`,
  ];
}

export function clearSessionCookies() {
  return [
    'accessToken=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0',
    'refreshToken=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0',
  ];
}

export function isTokenExpired(accessToken: string): boolean {
  try {
    const parts = accessToken.split('.');
    if (parts.length !== 3) { return true; }
    const decoded = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
    const exp: number = decoded['exp'] ?? 0;
    return Date.now() / 1000 >= exp;
  } catch {
    return true;
  }
}

export function getRoleFromToken(accessToken: string): Role | null {
  try {
    const parts = accessToken.split('.');
    if (parts.length !== 3) { return null; }
    const decoded = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
    const groups: string[] = decoded['cognito:groups'] ?? [];
    const priority: Role[] = ['ADMIN', 'PHASE3_JUDGE', 'PHASE2_JUDGE', 'PHASE1_REVIEWER', 'CANDIDATE'];
    return priority.find((r) => groups.includes(r)) ?? 'CANDIDATE';
  } catch {
    return null;
  }
}

type WithSessionCallback<T> = (session: { accessToken: string; refreshToken: string; role: Role }, headers: Headers) => Promise<T>;

export async function withSession<T>(request: Request, callback: WithSessionCallback<T>): Promise<T> {
  const session = getSessionFromRequest(request);
  if (!session) { return redirect('/auth/sign-in') as T; }

  const headers = new Headers();
  let { accessToken, refreshToken } = session;

  if (isTokenExpired(accessToken)) {
    try {
      const authGateway = new AuthGateway();
      const tokens = await authGateway.refreshToken({ refreshToken });
      accessToken = tokens.accessToken;
      refreshToken = tokens.refreshToken;
      for (const cookie of buildSessionCookies({ accessToken, refreshToken })) {
        headers.append('Set-Cookie', cookie);
      }
    } catch (error) {
      if (error instanceof InvalidRefreshToken) {
        const clearHeaders = new Headers();
        for (const cookie of clearSessionCookies()) {
          clearHeaders.append('Set-Cookie', cookie);
        }
        return redirect('/auth/sign-in', { headers: clearHeaders }) as T;
      }
      throw error;
    }
  }

  const role = getRoleFromToken(accessToken);
  if (!role) { return redirect('/auth/sign-in') as T; }

  return callback({ accessToken, refreshToken, role }, headers);
}
