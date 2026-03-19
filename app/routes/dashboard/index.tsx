import { redirect, type LoaderFunctionArgs } from 'react-router';
import { getSessionFromRequest, getRoleFromToken } from '~/lib/session';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = getSessionFromRequest(request);
  if (!session) { return redirect('/auth/sign-in'); }

  const role = getRoleFromToken(session.accessToken);
  if (!role) { return redirect('/auth/sign-in'); }

  return { role };
}

export { DashboardPage as default } from '@/pages/dashboard/index';
