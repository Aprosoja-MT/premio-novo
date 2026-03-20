import { type LoaderFunctionArgs } from 'react-router';

export function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email') ?? '';
  return { email };
}

export { VerifyEmailPendingPage as default } from '@/pages/auth/verify-email-pending';
