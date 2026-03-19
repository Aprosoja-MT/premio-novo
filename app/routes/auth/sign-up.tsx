import { data, redirect, type ActionFunctionArgs } from 'react-router';
import { z } from 'zod';
import { EmailAlreadyInUse } from '~/errors/EmailAlreadyInUse';
import { AuthGateway } from '~/gateways/AuthGateway';
import { UserRepository } from '~/repositories/UserRepository';
import { SignUpUseCase } from '~/usecases/SignUpUseCase';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const parsed = schema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return data({ error: 'Dados inválidos.' }, { status: 400 });
  }

  try {
    const authGateway = new AuthGateway();
    const userRepository = new UserRepository();
    const useCase = new SignUpUseCase(authGateway, userRepository);
    await useCase.execute(parsed.data);

    return redirect('/auth/verify-email?email=' + encodeURIComponent(parsed.data.email));
  } catch (error) {
    if (error instanceof EmailAlreadyInUse) {
      return data({ error: 'Este e-mail já está em uso.' }, { status: 409 });
    }
    throw error;
  }
}

export default function SignUpPage() {
  return null;
}
