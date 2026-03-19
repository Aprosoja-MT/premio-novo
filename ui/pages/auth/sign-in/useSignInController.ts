import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFetcher } from 'react-router';
import { z } from 'zod/v4';

export const signInSchema = z.object({
  email: z.email({ error: 'E-mail inválido.' }),
  password: z.string().min(6, { error: 'A senha deve ter no mínimo 6 caracteres.' }),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

export function useSignInController() {
  const fetcher = useFetcher<{ error?: string }>();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: standardSchemaResolver(signInSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  const isSubmitting = fetcher.state !== 'idle';
  const serverError = fetcher.data?.error;

  function onSubmit(values: SignInFormValues) {
    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('password', values.password);
    fetcher.submit(formData, { method: 'post', action: '/auth/sign-in' });
  }

  function togglePassword() {
    setShowPassword((prev) => !prev);
  }

  return {
    form,
    showPassword,
    togglePassword,
    isSubmitting,
    serverError,
    onSubmit,
  };
}
