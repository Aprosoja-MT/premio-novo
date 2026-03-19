import type { LoaderFunctionArgs } from 'react-router';
import { withSession } from '~/lib/session';

export async function loader({ request }: LoaderFunctionArgs) {
  return withSession(request, async ({ role }, headers) => {
    return Response.json({ role }, { headers });
  });
}

export { DashboardPage as default } from '@/pages/dashboard/index';
