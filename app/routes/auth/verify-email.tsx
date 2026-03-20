import { redirect, type LoaderFunctionArgs } from 'react-router';
import { AuthGateway } from '~/gateways/AuthGateway';
import { CandidateRepository } from '~/repositories/CandidateRepository';
import { UserRepository } from '~/repositories/UserRepository';
import { ConfirmEmailUseCase, InvalidVerificationToken } from '~/usecases/ConfirmEmailUseCase';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return redirect('/auth/sign-in?verified=invalid');
  }

  try {
    const candidateRepository = new CandidateRepository();
    const userRepository = new UserRepository();
    const authGateway = new AuthGateway();
    const useCase = new ConfirmEmailUseCase(candidateRepository, userRepository, authGateway);

    await useCase.execute(token);

    return redirect('/auth/sign-in?verified=1');
  } catch (error) {
    if (error instanceof InvalidVerificationToken) {
      return redirect('/auth/sign-in?verified=invalid');
    }
    throw error;
  }
}

export default function VerifyEmailPage() {
  return null;
}
