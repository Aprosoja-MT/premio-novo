import { EmailAlreadyInUse } from '~/errors/EmailAlreadyInUse';
import { AuthGateway } from '~/gateways/AuthGateway';
import { UserRepository } from '~/repositories/UserRepository';

export class SignUpUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ email, password }: SignUpUseCase.Input): Promise<void> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) { throw new EmailAlreadyInUse(); }

    const { externalId } = await this.authGateway.signUp({ email, password });

    try {
      await this.authGateway.adminConfirmSignUp({ externalId });
      await this.userRepository.create({ externalId, email });
    } catch (error) {
      await this.authGateway.deleteUser({ externalId });
      throw error;
    }
  }
}

export namespace SignUpUseCase {
  export type Input = { email: string; password: string };
}
