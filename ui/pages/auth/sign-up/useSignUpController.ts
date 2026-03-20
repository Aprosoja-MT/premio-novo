import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { useActionData, useNavigation, useSubmit } from 'react-router';
import { z } from 'zod/v4';
import { isValidCpf } from '~/lib/cpf';
import { isValidPassport } from '~/lib/passport';

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
  cpf: z.string().regex(/^\d{11}$/, { error: 'CPF deve ter 11 dígitos (somente números).' }).refine(isValidCpf, { error: 'CPF inválido.' }),
  phone: z.string().min(10, { error: 'Telefone inválido.' }),
  state: z.enum(BRAZILIAN_STATES, { error: 'Selecione um estado.' }),
  city: z.string().min(2, { error: 'Informe sua cidade.' }),
  category: z.enum(['VIDEO', 'TEXT', 'AUDIO', 'PHOTO', 'UNIVERSITY'], { error: 'Selecione uma categoria.' }),
  wantsMaster: z.boolean().default(false),
  passport: z.string().refine((v) => !v || isValidPassport(v), { error: 'Passaporte inválido. Formato: AA000000.' }).optional(),
  visaExpiry: z.date({ error: 'Informe a validade do visto.' }).optional(),
  email: z.email({ error: 'E-mail inválido.' }),
  password: z.string().min(8, { error: 'A senha deve ter no mínimo 8 caracteres.' }),
  confirmPassword: z.string().min(1, { error: 'Confirme a senha.' }),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'As senhas não coincidem.',
  path: ['confirmPassword'],
}).refine((d) => !d.wantsMaster || !!d.passport, {
  message: 'Informe o número do passaporte.',
  path: ['passport'],
}).refine((d) => !d.wantsMaster || !!d.visaExpiry, {
  message: 'Informe a validade do visto.',
  path: ['visaExpiry'],
});

export type SignUpFormValues = z.infer<typeof schema>;

export type Step = 1 | 2 | 3;

type PresignedPostData = {
  presignedPost: { url: string; fields: Record<string, string> };
  key: string;
};

async function getUploadUrl(file: File, folder: 'drt' | 'enrollment'): Promise<PresignedPostData> {
  const res = await fetch('/api/upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contentType: file.type, folder }),
  });
  if (!res.ok) { throw new Error('Falha ao obter URL de upload.'); }
  return res.json();
}

async function uploadToS3(file: File, presignedPost: PresignedPostData['presignedPost']): Promise<void> {
  const fd = new FormData();
  for (const [k, v] of Object.entries(presignedPost.fields)) {
    fd.append(k, v);
  }
  fd.append('file', file);

  const res = await fetch(presignedPost.url, { method: 'POST', body: fd });
  if (!res.ok) { throw new Error('Falha ao fazer upload do arquivo.'); }
}

export function useSignUpController() {
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData<{ error?: string }>();
  const [step, setStep] = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [drtFile, setDrtFile] = useState<File | null>(null);
  const [enrollmentFile, setEnrollmentFile] = useState<File | null>(null);
  const [drtError, setDrtError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: standardSchemaResolver(schema) as never,
    defaultValues: {
      name: '',
      socialName: '',
      cpf: '',
      phone: '',
      state: '' as never,
      city: '',
      category: '' as never,
      wantsMaster: false,
      passport: '',
      visaExpiry: undefined,
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  });

  const isSubmitting = isUploading || navigation.state !== 'idle';
  const serverError = actionData?.error;
  const category = form.watch('category');
  const state = form.watch('state');
  const wantsMaster = form.watch('wantsMaster');

  async function nextStep() {
    const fieldsPerStep: Record<Step, (keyof SignUpFormValues)[]> = {
      1: ['name', 'cpf', 'phone', 'state', 'city'],
      2: ['category', 'wantsMaster', 'passport', 'visaExpiry'],
      3: ['email', 'password', 'confirmPassword'],
    };

    if (step === 2) {
      if (category !== 'UNIVERSITY' && !drtFile) {
        setDrtError('Envie o arquivo do DRT.');
        return;
      }
      setDrtError(null);
    }

    const valid = await form.trigger(fieldsPerStep[step]);
    if (valid) { setStep((s) => (s + 1) as Step); }
  }

  function prevStep() {
    setStep((s) => (s - 1) as Step);
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setUploadError(null);
    setIsUploading(true);

    let drtKey: string | undefined;
    let enrollmentKey: string | undefined;

    try {
      if (drtFile) {
        const data = await getUploadUrl(drtFile, 'drt');
        await uploadToS3(drtFile, data.presignedPost);
        drtKey = data.key;
      }

      if (enrollmentFile) {
        const data = await getUploadUrl(enrollmentFile, 'enrollment');
        await uploadToS3(enrollmentFile, data.presignedPost);
        enrollmentKey = data.key;
      }
    } catch (err) {
      console.error('[upload error]', err);
      setUploadError('Falha ao enviar arquivo. Tente novamente.');
      setIsUploading(false);
      return;
    }

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
    if (values.visaExpiry) { fd.append('visaExpiry', values.visaExpiry.toISOString()); }
    if (drtKey) { fd.append('drtFile', drtKey); }
    if (enrollmentKey) { fd.append('enrollmentFile', enrollmentKey); }

    submit(fd, { method: 'post', action: '/auth/sign-up', encType: 'multipart/form-data' });
  });

  return {
    form: form as unknown as UseFormReturn<SignUpFormValues>,
    step,
    nextStep,
    prevStep,
    onSubmit,
    isSubmitting,
    serverError,
    uploadError,
    drtError,
    drtFile,
    setDrtFile,
    enrollmentFile,
    setEnrollmentFile,
    category,
    state,
    wantsMaster,
    showPassword,
    setShowPassword,
  };
}
