import { useRef } from 'react';
import { useActionData, useLoaderData, useNavigation, useSubmit } from 'react-router';
import type { Role } from '~/lib/roles';

export type PhaseRow = {
  phase: number;
  startedAt: string | null;
  finishedAt: string | null;
  startedBy: string | null;
  finishedBy: string | null;
};

export const PHASE_LABELS: Record<number, string> = {
  1: 'Fase 1 — Comissão de Habilitação',
  2: 'Fase 2 — Comissão Técnica',
  3: 'Fase 3 — Comissão Institucional',
};

export function useAdminPhasesController() {
  const { role, phases } = useLoaderData<{ role: Role; phases: PhaseRow[] }>();
  const actionData = useActionData<{ error?: string; success?: boolean }>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const lastActionTimestamp = useRef<number>(0);

  const isSubmitting = navigation.state !== 'idle';

  const justSucceeded = actionData?.success && navigation.state === 'idle';
  if (justSucceeded && lastActionTimestamp.current === 0) {
    lastActionTimestamp.current = Date.now();
  }

  function startPhase(phase: number) {
    lastActionTimestamp.current = 0;
    submit({ intent: 'start', phase: String(phase) }, { method: 'post', action: '/dashboard/admin/phases' });
  }

  function finishPhase(phase: number) {
    lastActionTimestamp.current = 0;
    submit({ intent: 'finish', phase: String(phase) }, { method: 'post', action: '/dashboard/admin/phases' });
  }

  return {
    role,
    phases,
    isSubmitting,
    serverError: actionData?.error,
    startPhase,
    finishPhase,
  };
}
