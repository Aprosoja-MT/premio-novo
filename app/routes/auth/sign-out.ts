import { redirect, type ActionFunctionArgs } from 'react-router';

export async function action(_: ActionFunctionArgs) {
  const headers = new Headers();
  headers.append('Set-Cookie', 'accessToken=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0');
  headers.append('Set-Cookie', 'refreshToken=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0');
  return redirect('/auth/sign-in', { headers });
}
