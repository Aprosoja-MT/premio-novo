import { z } from 'zod';

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  AWS_REGION: z.string().min(1),
  AWS_ACCESS_KEY: z.string().min(1),
  AWS_ACCESS_SECRET_KEY: z.string().min(1),
  COGNITO_USER_POOL_ID: z.string().min(1),
  COGNITO_CLIENT_ID: z.string().min(1),
  COGNITO_CLIENT_SECRET: z.string().min(1),
  SES_EMAIL_FROM: z.string().min(1),
  APP_URL: z.url(),
  AWS_BUCKET: z.string().min(1),
  AWS_BUCKET_DOMAIN_NAME: z.string().min(1),
});

export const env = schema.parse(process.env);
