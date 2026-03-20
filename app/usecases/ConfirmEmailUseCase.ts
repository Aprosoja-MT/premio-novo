import { AuthGateway } from '~/gateways/AuthGateway';
import { CandidateRepository } from '~/repositories/CandidateRepository';
import { UserRepository } from '~/repositories/UserRepository';

export class InvalidVerificationToken extends Error {}

export class ConfirmEmailUseCase {
  constructor(
    private readonly candidateRepository: CandidateRepository,
    private readonly userRepository: UserRepository,
    private readonly authGateway: AuthGateway,
  ) {}

  async execute(token: string): Promise<void> {
    const candidate = await this.candidateRepository.findByVerificationToken(token);
    if (!candidate) { throw new InvalidVerificationToken(); }

    const user = await this.userRepository.findById(candidate.userId);
    if (!user) { throw new InvalidVerificationToken(); }

    await this.authGateway.adminConfirmSignUp({ externalId: user.externalId });
    await this.candidateRepository.confirmEmail(candidate.id);
  }
}
