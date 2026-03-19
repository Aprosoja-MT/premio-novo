import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useActionData, useNavigation, useSubmit } from 'react-router';
import { z } from 'zod/v4';

const BRAZILIAN_STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
] as const;

export const CATEGORIES = [
  { value: 'VIDEO', label: 'Reportagem em Vídeo' },
  { value: 'TEXT', label: 'Reportagem em Texto' },
  { value: 'AUDIO', label: 'Reportagem em Áudio' },
  { value: 'PHOTO', label: 'Fotojornalismo' },
  { value: 'UNIVERSITY', label: 'Jornalismo Universitário' },
] as const;

const schema = z.object({
  name: z.string().min(2, { error: 'Informe seu nome completo.' }),
  socialName: z.string().optional(),
  cpf: z.string().regex(/^\d{11}$/, { error: 'CPF deve ter 11 dígitos (somente números).' }),
  phone: z.string().min(10, { error: 'Telefone inválido.' }),
  state: z.enum(BRAZILIAN_STATES, { error: 'Selecione um estado.' }),
  city: z.string().min(2, { error: 'Informe sua cidade.' }),
  category: z.enum(['VIDEO', 'TEXT', 'AUDIO', 'PHOTO', 'UNIVERSITY'], { error: 'Selecione uma categoria.' }),
  drtFile: z.instanceof(File).optional(),
  enrollmentFile: z.instanceof(File).optional(),
  wantsMaster: z.boolean().default(false),
  passport: z.string().optional(),
  visaExpiry: z.string().optional(),
  email: z.email({ error: 'E-mail inválido.' }),
  password: z.string().min(8, { error: 'A senha deve ter no mínimo 8 caracteres.' }),
  confirmPassword: z.string().min(1, { error: 'Confirme a senha.' }),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'As senhas não coincidem.',
  path: ['confirmPassword'],
}).refine((d) => d.category === 'UNIVERSITY' || !!d.drtFile, {
  message: 'Envie o arquivo do DRT.',
  path: ['drtFile'],
}).refine((d) => !d.wantsMaster || !!d.passport, {
  message: 'Informe o número do passaporte.',
  path: ['passport'],
}).refine((d) => !d.wantsMaster || !!d.visaExpiry, {
  message: 'Informe a validade do visto.',
  path: ['visaExpiry'],
});

export type SignUpFormValues = z.infer<typeof schema>;

export type Step = 1 | 2 | 3;

export function useSignUpController() {
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData<{ error?: string }>();
  const [step, setStep] = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      name: '',
      socialName: '',
      cpf: '',
      phone: '',
      state: undefined,
      city: '',
      category: undefined,
      drtFile: undefined,
      enrollmentFile: undefined,
      wantsMaster: false,
      passport: '',
      visaExpiry: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  });

  const isSubmitting = navigation.state !== 'idle';
  const serverError = actionData?.error;
  const category = form.watch('category');
  const wantsMaster = form.watch('wantsMaster');

  async function nextStep() {
    const fieldsPerStep: Record<Step, (keyof SignUpFormValues)[]> = {
      1: ['name', 'cpf', 'phone', 'state', 'city'],
      2: ['category', 'drtFile', 'enrollmentFile', 'wantsMaster', 'passport', 'visaExpiry'],
      3: ['email', 'password', 'confirmPassword'],
    };
    const valid = await form.trigger(fieldsPerStep[step]);
    if (valid) { setStep((s) => (s + 1) as Step); }
  }

  function prevStep() {
    setStep((s) => (s - 1) as Step);
  }

  const onSubmit = form.handleSubmit((values) => {
    const fd = new FormData();
    fd.append('email', values.email);
    fd.append('password', values.password);
    fd.append('name', values.name);
    if (values.socialName) { fd.append('socialName', values.socialName); }
    fd.append('cpf', values.cpf);
    fd.append('phone', values.phone);
    fd.append('state', values.state);
    fd.append('city', values.city);
    fd.append('category', values.category);
    fd.append('wantsMaster', String(values.wantsMaster));
    if (values.passport) { fd.append('passport', values.passport); }
    if (values.visaExpiry) { fd.append('visaExpiry', values.visaExpiry); }
    if (values.drtFile) { fd.append('drtFile', values.drtFile); }
    if (values.enrollmentFile) { fd.append('enrollmentFile', values.enrollmentFile); }

    submit(fd, { method: 'post', action: '/auth/sign-up', encType: 'multipart/form-data' });
  });

  return {
    form,
    step,
    nextStep,
    prevStep,
    onSubmit,
    isSubmitting,
    serverError,
    category,
    wantsMaster,
    showPassword,
    setShowPassword,
  };
}
