import { redirect, type ActionFunctionArgs } from 'react-router';
import { clearSessionCookies } from '~/lib/session';

export async function action(_: ActionFunctionArgs) {
  const headers = new Headers();
  for (const cookie of clearSessionCookies()) {
    headers.append('Set-Cookie', cookie);
  }
  return redirect('/auth/sign-in', { headers });
}
