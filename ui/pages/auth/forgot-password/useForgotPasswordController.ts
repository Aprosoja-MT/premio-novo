import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';
import { useNavigation, useActionData, useSubmit } from 'react-router';
import { z } from 'zod/v4';

const schema = z.object({
  email: z.email({ error: 'E-mail inválido.' }),
});

type FormValues = z.infer<typeof schema>;

export function useForgotPasswordController() {
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData<{ error?: string }>();

  const form = useForm<FormValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues: { email: '' },
    mode: 'onTouched',
  });

  const isSubmitting = navigation.state !== 'idle';
  const serverError = actionData?.error;

  const onSubmit = form.handleSubmit((values) => {
    submit(values, { method: 'post', action: '/auth/forgot-password', encType: 'application/x-www-form-urlencoded' });
  });

  return { form, onSubmit, isSubmitting, serverError };
}
