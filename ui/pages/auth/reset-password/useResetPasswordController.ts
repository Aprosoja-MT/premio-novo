import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigation, useActionData, useSubmit, useLoaderData } from 'react-router';
import { z } from 'zod/v4';

const schema = z
  .object({
    confirmationCode: z.string().min(1, { error: 'Informe o código.' }),
    password: z.string().min(8, { error: 'A senha deve ter no mínimo 8 caracteres.' }),
    confirmPassword: z.string().min(1, { error: 'Confirme a senha.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export function useResetPasswordController() {
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData<{ error?: string }>();
  const { email } = useLoaderData<{ email: string }>();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues: { confirmationCode: '', password: '', confirmPassword: '' },
    mode: 'onTouched',
  });

  const isSubmitting = navigation.state !== 'idle';
  const serverError = actionData?.error;

  const onSubmit = form.handleSubmit((values) => {
    submit(
      { email, confirmationCode: values.confirmationCode, password: values.password },
      { method: 'post', action: '/auth/reset-password', encType: 'application/x-www-form-urlencoded' },
    );
  });

  return { form, onSubmit, isSubmitting, serverError, email, showPassword, setShowPassword };
}
