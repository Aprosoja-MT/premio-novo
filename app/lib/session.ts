import type { Role } from '~/generated/prisma';

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
  if (!accessToken || !refreshToken) {return null;}
  return { accessToken, refreshToken };
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
