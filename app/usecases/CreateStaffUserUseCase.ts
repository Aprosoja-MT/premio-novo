import { EmailAlreadyInUse } from '~/errors/EmailAlreadyInUse';
import { AuthGateway } from '~/gateways/AuthGateway';
import { Role } from '~/generated/prisma';
import { UserRepository } from '~/repositories/UserRepository';

export class CreateStaffUserUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: CreateStaffUserUseCase.Input): Promise<void> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) { throw new EmailAlreadyInUse(); }

    const tempPassword = 'Aprosoja2025@';

    const { externalId } = await this.authGateway.signUp({ email: input.email, password: tempPassword });

    try {
      await this.authGateway.adminConfirmSignUp({ externalId });
      await this.userRepository.create({ externalId, email: input.email, role: input.role });
    } catch (error) {
      await this.authGateway.deleteUser({ externalId });
      throw error;
    }
  }
}

export namespace CreateStaffUserUseCase {
  export type Input = {
    email: string;
    role: Role;
  };
}
