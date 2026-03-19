import { data, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router';
import { z } from 'zod';
import { AuthGateway } from '~/gateways/AuthGateway';
import { ResetPasswordUseCase } from '~/usecases/ResetPasswordUseCase';

const schema = z.object({
  email: z.email(),
  confirmationCode: z.string().min(1),
  password: z.string().min(8),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email') ?? '';
  return { email };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const parsed = schema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return data({ error: 'Dados inválidos.' }, { status: 400 });
  }

  try {
    const authGateway = new AuthGateway();
    const useCase = new ResetPasswordUseCase(authGateway);
    await useCase.execute(parsed.data);
    return redirect('/auth/sign-in?reset=1');
  } catch {
    return data({ error: 'Código inválido ou expirado. Solicite um novo código.' }, { status: 400 });
  }
}

export { ResetPasswordPage as default } from '@/pages/auth/reset-password';
