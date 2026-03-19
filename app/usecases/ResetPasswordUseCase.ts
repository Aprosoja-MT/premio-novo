import { AuthGateway } from '~/gateways/AuthGateway';

export class ResetPasswordUseCase {
  constructor(private readonly authGateway: AuthGateway) {}

  async execute({ email, confirmationCode, password }: ResetPasswordUseCase.Input): Promise<void> {
    await this.authGateway.confirmForgotPassword({ email, confirmationCode, password });
  }
}

export namespace ResetPasswordUseCase {
  export type Input = { email: string; confirmationCode: string; password: string };
}
