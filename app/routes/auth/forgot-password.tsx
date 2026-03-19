import { data, redirect, type ActionFunctionArgs } from 'react-router';
import { z } from 'zod';
import { AuthGateway } from '~/gateways/AuthGateway';
import { ForgotPasswordUseCase } from '~/usecases/ForgotPasswordUseCase';

const schema = z.object({
  email: z.email(),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const parsed = schema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return data({ error: 'E-mail inválido.' }, { status: 400 });
  }

  try {
    const authGateway = new AuthGateway();
    const useCase = new ForgotPasswordUseCase(authGateway);
    await useCase.execute(parsed.data);
  } catch {
    // Não revelar se o e-mail existe ou não
  }

  return redirect(`/auth/reset-password?email=${encodeURIComponent(parsed.data.email)}`);
}

export { ForgotPasswordPage as default } from '@/pages/auth/forgot-password';
