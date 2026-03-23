/* eslint-disable no-console */
import 'dotenv/config';
import { createHmac } from 'node:crypto';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  AdminConfirmSignUpCommand,
  AdminUpdateUserAttributesCommand,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../app/generated/prisma/index.js';

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL']! });
const prisma = new PrismaClient({ adapter });

const cognito = new CognitoIdentityProviderClient({
  region: process.env['AWS_REGION']!,
  credentials: {
    accessKeyId: process.env['AWS_ACCESS_KEY']!,
    secretAccessKey: process.env['AWS_ACCESS_SECRET_KEY']!,
  },
});

const USER_POOL_ID = process.env['COGNITO_USER_POOL_ID']!;
const CLIENT_ID = process.env['COGNITO_CLIENT_ID']!;
const CLIENT_SECRET = process.env['COGNITO_CLIENT_SECRET']!;

function secretHash(email: string) {
  return createHmac('SHA256', CLIENT_SECRET).update(`${email}${CLIENT_ID}`).digest('base64');
}

async function createCognitoUser(email: string, password: string): Promise<string> {
  try {
    const result = await cognito.send(new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      SecretHash: secretHash(email),
      UserAttributes: [{ Name: 'email', Value: email }],
    }));
    if (!result.UserSub) { throw new Error(`Falha ao criar usuário Cognito: ${email}`); }

    await cognito.send(new AdminConfirmSignUpCommand({ UserPoolId: USER_POOL_ID, Username: result.UserSub }));
    await cognito.send(new AdminUpdateUserAttributesCommand({
      UserPoolId: USER_POOL_ID,
      Username: result.UserSub,
      UserAttributes: [{ Name: 'email_verified', Value: 'true' }],
    }));

    return result.UserSub;
  } catch (err: any) {
    if (err.name !== 'UsernameExistsException') { throw err; }

    const { Users } = await cognito.send(new ListUsersCommand({
      UserPoolId: USER_POOL_ID,
      Filter: `email = "${email}"`,
      Limit: 1,
    }));
    const sub = Users?.[0]?.Attributes?.find(a => a.Name === 'sub')?.Value;
    if (!sub) { throw new Error(`Usuário existe no Cognito mas sub não encontrado: ${email}`, { cause: err }); }
    console.log(`  Já existia no Cognito, reutilizando: ${email}`);
    return sub;
  }
}

const ADMINS = [
  { email: 'ian.martins@aprosoja.com.br', password: 'Aprosoja2025@' },
];

async function main() {
  for (const { email, password } of ADMINS) {
    console.log(`Criando admin: ${email}`);
    const externalId = await createCognitoUser(email, password);

    await prisma.user.upsert({
      where: { externalId },
      update: { email, role: 'ADMIN' },
      create: { externalId, email, role: 'ADMIN' },
    });

    console.log(`  OK — externalId: ${externalId}`);
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
