import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('auth/sign-in', 'routes/auth/sign-in.tsx'),
  route('auth/sign-up', 'routes/auth/sign-up.tsx'),
  route('auth/sign-out', 'routes/auth/sign-out.ts'),
  route('auth/forgot-password', 'routes/auth/forgot-password.tsx'),
  route('auth/reset-password', 'routes/auth/reset-password.tsx'),
  route('auth/verify-email', 'routes/auth/verify-email.tsx'),
  route('auth/verify-email-pending', 'routes/auth/verify-email-pending.tsx'),
  route('api/upload-url', 'routes/api/upload-url.ts'),
  route('dashboard', 'routes/dashboard/index.tsx'),
  route('dashboard/profile', 'routes/dashboard/profile.tsx'),
  route('dashboard/works', 'routes/dashboard/works.tsx'),
  route('dashboard/admin/users', 'routes/dashboard/admin/users.tsx'),
  route('dashboard/admin/phases', 'routes/dashboard/admin/phases.tsx'),
  route('dashboard/phase1/works', 'routes/dashboard/phase1/works.tsx'),
  route('dashboard/phase2/works', 'routes/dashboard/phase2/works.tsx'),
  route('dashboard/phase3/works', 'routes/dashboard/phase3/works.tsx'),
  route('dashboard/admin/ranking', 'routes/dashboard/admin/ranking.tsx'),
  route('*', 'routes/$.tsx'),
] satisfies RouteConfig;
