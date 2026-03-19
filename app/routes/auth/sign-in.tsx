import { data, redirect, type ActionFunctionArgs } from 'react-router';
import { z } from 'zod';
import { InvalidCredentials } from '~/errors/InvalidCredentials';
import { AuthGateway } from '~/gateways/AuthGateway';
import { SignInUseCase } from '~/usecases/SignInUseCase';
import { buildSessionCookies } from '~/lib/session';

const schema = z.object({
  email: z.string().email(),
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
