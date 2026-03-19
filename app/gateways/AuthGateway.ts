import { createHmac } from 'node:crypto';
import {
  InitiateAuthCommand,
  SignUpCommand,
  GetTokensFromRefreshTokenCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  AdminDeleteUserCommand,
  AdminConfirmSignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '~/lib/cognitoClient';
import { env } from '~/config/env';
import { InvalidRefreshToken } from '~/errors/InvalidRefreshToken';

export class AuthGateway {
  async signIn({ email, password }: AuthGateway.SignInParams): Promise<AuthGateway.SignInResult> {
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: this.getSecretHash(email),
      },
    });

    const { AuthenticationResult } = await cognitoClient.send(command);

    if (!AuthenticationResult?.AccessToken || !AuthenticationResult.RefreshToken) {
      throw new Error(`Cannot authenticate user: ${email}`);
    }

    return {
      accessToken: AuthenticationResult.AccessToken,
      refreshToken: AuthenticationResult.RefreshToken,
    };
  }

  async signUp({ email, password }: AuthGateway.SignUpParams): Promise<AuthGateway.SignUpResult> {
    const command = new SignUpCommand({
      ClientId: env.COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      SecretHash: this.getSecretHash(email),
    });

    const { UserSub: externalId } = await cognitoClient.send(command);

    if (!externalId) {
      throw new Error(`Cannot sign up user: ${email}`);
    }

    return { externalId };
  }

  async refreshToken({ refreshToken }: AuthGateway.RefreshTokenParams): Promise<AuthGateway.RefreshTokenResult> {
    try {
      const command = new GetTokensFromRefreshTokenCommand({
        ClientId: env.COGNITO_CLIENT_ID,
        RefreshToken: refreshToken,
        ClientSecret: env.COGNITO_CLIENT_SECRET,
      });

      const { AuthenticationResult } = await cognitoClient.send(command);

      if (!AuthenticationResult?.AccessToken || !AuthenticationResult.RefreshToken) {
        throw new Error('Cannot refresh token');
      }

      return {
        accessToken: AuthenticationResult.AccessToken,
        refreshToken: AuthenticationResult.RefreshToken,
      };
    } catch {
      throw new InvalidRefreshToken();
    }
  }

  async forgotPassword({ email }: AuthGateway.ForgotPasswordParams): Promise<void> {
    const command = new ForgotPasswordCommand({
      ClientId: env.COGNITO_CLIENT_ID,
      Username: email,
      SecretHash: this.getSecretHash(email),
    });

    await cognitoClient.send(command);
  }

  async confirmForgotPassword({ email, confirmationCode, password }: AuthGateway.ConfirmForgotPasswordParams): Promise<void> {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: confirmationCode,
      Password: password,
      SecretHash: this.getSecretHash(email),
    });

    await cognitoClient.send(command);
  }

  async adminConfirmSignUp({ externalId }: AuthGateway.AdminConfirmSignUpParams): Promise<void> {
    const command = new AdminConfirmSignUpCommand({
      UserPoolId: env.COGNITO_USER_POOL_ID,
      Username: externalId,
    });

    await cognitoClient.send(command);
  }

  async deleteUser({ externalId }: AuthGateway.DeleteUserParams): Promise<void> {
    const command = new AdminDeleteUserCommand({
      UserPoolId: env.COGNITO_USER_POOL_ID,
      Username: externalId,
    });

    await cognitoClient.send(command);
  }

  private getSecretHash(email: string): string {
    return createHmac('SHA256', env.COGNITO_CLIENT_SECRET)
      .update(`${email}${env.COGNITO_CLIENT_ID}`)
      .digest('base64');
  }
}

export namespace AuthGateway {
  export type SignInParams = { email: string; password: string };
  export type SignInResult = { accessToken: string; refreshToken: string };

  export type SignUpParams = { email: string; password: string };
  export type SignUpResult = { externalId: string };

  export type RefreshTokenParams = { refreshToken: string };
  export type RefreshTokenResult = { accessToken: string; refreshToken: string };

  export type ForgotPasswordParams = { email: string };

  export type ConfirmForgotPasswordParams = {
    email: string;
    confirmationCode: string;
    password: string;
  };

  export type AdminConfirmSignUpParams = { externalId: string };

  export type DeleteUserParams = { externalId: string };
}
