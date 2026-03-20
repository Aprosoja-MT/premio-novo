import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useActionData, useLoaderData, useNavigation, useSearchParams, useSubmit } from 'react-router';
import { z } from 'zod/v4';
import { Role } from '~/lib/roles';

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Administrador',
  CANDIDATE: 'Candidato',
  PHASE1_REVIEWER: 'Comissão de Habilitação',
  PHASE2_JUDGE: 'Comissão Técnica',
  PHASE3_JUDGE: 'Comissão Institucional',
};

export const STAFF_ROLES = [
  { value: 'PHASE1_REVIEWER', label: 'Comissão de Habilitação' },
  { value: 'PHASE2_JUDGE', label: 'Comissão Técnica' },
  { value: 'PHASE3_JUDGE', label: 'Comissão Institucional' },
  { value: 'ADMIN', label: 'Administrador' },
] as const;

export const ALL_ROLES = [
  { value: '', label: 'Todos os cargos' },
  { value: 'CANDIDATE', label: 'Candidato' },
  ...STAFF_ROLES,
] as const;

const createSchema = z.object({
  email: z.email({ error: 'E-mail inválido.' }),
  role: z.enum(['PHASE1_REVIEWER', 'PHASE2_JUDGE', 'PHASE3_JUDGE', 'ADMIN'], {
    error: 'Selecione um cargo.',
  }),
});

export type CreateFormValues = z.infer<typeof createSchema>;

export type UserRow = {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
  candidate: {
    name: string;
    category: string;
    state: string;
    wantsMaster: boolean;
    emailConfirmedAt: string | null;
    profilePhotoUrl: string | null;
    _count: { works: number };
  } | null;
};

export function useAdminUsersController() {
  const { users } = useLoaderData<{ users: UserRow[] }>();
  const actionData = useActionData<{ error?: string; success?: boolean }>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);

  const roleFilter = searchParams.get('role') ?? '';
  const wantsMasterFilter = searchParams.get('wantsMaster') ?? '';

  const form = useForm<CreateFormValues>({
    resolver: standardSchemaResolver(createSchema) as never,
    defaultValues: { email: '', role: '' as never },
    mode: 'onTouched',
  });

  const isSubmitting = navigation.state !== 'idle';

  function setRoleFilter(value: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) { next.set('role', value); } else { next.delete('role'); }
      return next;
    });
  }

  function setWantsMasterFilter(value: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) { next.set('wantsMaster', value); } else { next.delete('wantsMaster'); }
      return next;
    });
  }

  const onSubmitCreate = form.handleSubmit((values) => {
    submit(
      { intent: 'create', email: values.email, role: values.role },
      { method: 'post', action: '/dashboard/admin/users' },
    );
  });

  // Fecha sheet e reseta form quando action retornar sucesso
  const justSucceeded = actionData?.success && navigation.state === 'idle';
  if (justSucceeded && sheetOpen) {
    setSheetOpen(false);
    form.reset();
  }

  return {
    users,
    roleFilter,
    wantsMasterFilter,
    setRoleFilter,
    setWantsMasterFilter,
    sheetOpen,
    setSheetOpen,
    form,
    onSubmitCreate,
    isSubmitting,
    serverError: actionData?.error,
  };
}
