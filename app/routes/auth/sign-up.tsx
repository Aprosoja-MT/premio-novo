import { data, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router';
import { z } from 'zod';
import { CpfAlreadyInUse } from '~/errors/CpfAlreadyInUse';
import { EmailAlreadyInUse } from '~/errors/EmailAlreadyInUse';
import { AuthGateway } from '~/gateways/AuthGateway';
import { EmailGateway } from '~/gateways/EmailGateway';
import { Category } from '~/generated/prisma';
import { getSessionFromRequest, isTokenExpired } from '~/lib/session';
import { UserRepository } from '~/repositories/UserRepository';
import { RegisterCandidateUseCase } from '~/usecases/RegisterCandidateUseCase';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = getSessionFromRequest(request);
  if (session && !isTokenExpired(session.accessToken)) {
    return redirect('/dashboard');
  }
  return null;
}

const BRAZILIAN_STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
] as const;

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(2),
  socialName: z.string().optional(),
  cpf: z.string().regex(/^\d{11}$/),
  phone: z.string().min(10),
  state: z.enum(BRAZILIAN_STATES),
  city: z.string().min(2),
  category: z.enum([
    Category.VIDEO,
    Category.TEXT,
    Category.AUDIO,
    Category.PHOTO,
    Category.UNIVERSITY,
  ]),
  wantsMaster: z.string().optional(),
  passport: z.string().optional(),
  visaExpiry: z.string().optional(),
  drtFile: z.string().optional(),
  enrollmentFile: z.string().optional(),
}).superRefine((val, ctx) => {
  if (val.category !== Category.UNIVERSITY && !val.drtFile) {
    ctx.addIssue({ code: 'custom', path: ['drtFile'], message: 'DRT é obrigatório.' });
  }
  if (val.wantsMaster === 'true' && !val.passport) {
    ctx.addIssue({ code: 'custom', path: ['passport'], message: 'Passaporte é obrigatório.' });
  }
  if (val.wantsMaster === 'true' && !val.visaExpiry) {
    ctx.addIssue({ code: 'custom', path: ['visaExpiry'], message: 'Validade do visto é obrigatória.' });
  }
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const raw = Object.fromEntries(formData);

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return data({ error: 'Dados inválidos. Verifique os campos e tente novamente.' }, { status: 400 });
  }

  const { email, password, name, socialName, cpf, phone, state, city, category, wantsMaster, passport, visaExpiry, drtFile, enrollmentFile } = parsed.data;

  try {
    const authGateway = new AuthGateway();
    const userRepository = new UserRepository();
    const emailGateway = new EmailGateway();
    const useCase = new RegisterCandidateUseCase(authGateway, userRepository, emailGateway);

    await useCase.execute({
      email,
      password,
      name,
      socialName: socialName || undefined,
      cpf,
      phone,
      state,
      city,
      category: category as Category,
      drtFile: drtFile || undefined,
      enrollmentFile: enrollmentFile || undefined,
      wantsMaster: wantsMaster === 'true',
      passport: passport || undefined,
      visaExpiry: visaExpiry ? new Date(visaExpiry) : undefined,
    });

    return redirect(`/auth/verify-email-pending?email=${encodeURIComponent(email)}`);
  } catch (error) {
    if (error instanceof EmailAlreadyInUse) {
      return data({ error: 'Este e-mail já está em uso.' }, { status: 409 });
    }
    if (error instanceof CpfAlreadyInUse) {
      return data({ error: 'Este CPF já está cadastrado.' }, { status: 409 });
    }
    throw error;
  }
}

export { SignUpPage as default } from '@/pages/auth/sign-up';
