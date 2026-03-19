import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { env } from '~/config/env';

export const cognitoClient = new CognitoIdentityProviderClient({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_ACCESS_SECRET_KEY,
  },
});
