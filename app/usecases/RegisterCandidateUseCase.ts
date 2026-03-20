import { randomBytes } from 'node:crypto';
import { Category } from '~/generated/prisma';
import { EmailAlreadyInUse } from '~/errors/EmailAlreadyInUse';
import { AuthGateway } from '~/gateways/AuthGateway';
import { EmailGateway } from '~/gateways/EmailGateway';
import { CandidateRepository } from '~/repositories/CandidateRepository';
import { UserRepository } from '~/repositories/UserRepository';
import { env } from '~/config/env';

export class RegisterCandidateUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly userRepository: UserRepository,
    private readonly candidateRepository: CandidateRepository,
    private readonly emailGateway: EmailGateway,
  ) {}

  async execute(input: RegisterCandidateUseCase.Input): Promise<void> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) { throw new EmailAlreadyInUse(); }

    const { externalId } = await this.authGateway.signUp({ email: input.email, password: input.password });

    const token = randomBytes(32).toString('hex');

    try {
      const user = await this.userRepository.create({ externalId, email: input.email });

      await this.candidateRepository.create({
        userId: user.id,
        name: input.name,
        socialName: input.socialName,
        cpf: input.cpf,
        phone: input.phone,
        state: input.state,
        city: input.city,
        category: input.category,
        drtFile: input.drtFile,
        enrollmentFile: input.enrollmentFile,
        wantsMaster: input.wantsMaster,
        passport: input.passport,
        visaExpiry: input.visaExpiry,
        emailVerificationToken: token,
      });

      const link = `${env.APP_URL}/auth/verify-email?token=${token}`;
      await this.emailGateway.sendVerifyEmail({ to: input.email, link });
    } catch (error) {
      await this.authGateway.deleteUser({ externalId });
      throw error;
    }
  }
}

export namespace RegisterCandidateUseCase {
  export type Input = {
    email: string;
    password: string;
    name: string;
    socialName?: string;
    cpf: string;
    phone: string;
    state: string;
    city: string;
    category: Category;
    drtFile?: string;
    enrollmentFile?: string;
    wantsMaster: boolean;
    passport?: string;
    visaExpiry?: Date;
  };
}
