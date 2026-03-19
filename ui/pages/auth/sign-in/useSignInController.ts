import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useActionData, useLoaderData, useNavigation, useSubmit } from 'react-router';
import { z } from 'zod/v4';

export const signInSchema = z.object({
  email: z.email({ error: 'E-mail inválido.' }),
  password: z.string().min(6, { error: 'A senha deve ter no mínimo 6 caracteres.' }),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

export function useSignInController() {
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData<{ error?: string }>();
  const { reset } = useLoaderData<{ reset: boolean }>();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: standardSchemaResolver(signInSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  const isSubmitting = navigation.state !== 'idle';
  const serverError = actionData?.error;

  const onSubmit = form.handleSubmit((values) => {
    submit(
      { email: values.email, password: values.password },
      { method: 'post', action: '/auth/sign-in', encType: 'application/x-www-form-urlencoded' },
    );
  });

  function togglePassword() {
    setShowPassword((prev) => !prev);
  }

  return {
    form,
    onSubmit,
    showPassword,
    togglePassword,
    isSubmitting,
    serverError,
    resetSuccess: reset,
  };
}
