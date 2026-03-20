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
  route('dashboard/admin/users', 'routes/dashboard/admin/users.tsx'),
  route('*', 'routes/$.tsx'),
] satisfies RouteConfig;
