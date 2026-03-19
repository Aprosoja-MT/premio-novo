import { data, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router';
import { z } from 'zod';
import { InvalidCredentials } from '~/errors/InvalidCredentials';
import { AuthGateway } from '~/gateways/AuthGateway';
import { buildSessionCookies, getSessionFromRequest, isTokenExpired } from '~/lib/session';
import { SignInUseCase } from '~/usecases/SignInUseCase';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = getSessionFromRequest(request);
  if (session && !isTokenExpired(session.accessToken)) {
    return redirect('/dashboard');
  }
  const url = new URL(request.url);
  const reset = url.searchParams.get('reset') === '1';
  const registered = url.searchParams.get('registered') === '1';
  return { reset, registered };
}

const schema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const parsed = schema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return data({ error: 'Dados inválidos.' }, { status: 400 });
  }

  try {
    const authGateway = new AuthGateway();
    const useCase = new SignInUseCase(authGateway);
    const tokens = await useCase.execute(parsed.data);

    const headers = new Headers();
    for (const cookie of buildSessionCookies(tokens)) {
      headers.append('Set-Cookie', cookie);
    }
    return redirect('/dashboard', { headers });
  } catch (error) {
    if (error instanceof InvalidCredentials) {
      return data({ error: 'E-mail ou senha inválidos.' }, { status: 401 });
    }
    throw error;
  }
}

export { SignInPage as default } from '@/pages/auth/sign-in';
