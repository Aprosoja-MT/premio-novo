import { useEffect, useState } from 'react';
import { useActionData, useLoaderData, useNavigation, useSearchParams, useSubmit } from 'react-router';
import { CATEGORIES, CATEGORY_LABELS } from '~/lib/enums';
import type { Role } from '~/lib/roles';
import { isoToBR } from '~/lib/utils';

export type Phase1WorkRow = {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
  description: string;
  status: 'SUBMITTED' | 'QUALIFIED' | 'DISQUALIFIED' | 'FINALIST';
  mediaFile: string | null;
  mediaFileUrl: string | null;
  mediaUrl: string | null;
  isPrinted: boolean;
  workFormat: string | null;
  region: string | null;
  createdAt: string;
  candidate: {
    name: string;
    state: string;
    city: string;
    profilePhotoUrl: string | null;
  };
  phase1Review: {
    id: string;
    qualified: boolean;
    justification: string | null;
    updatedAt: string;
    reviewer: { email: string };
  } | null;
};

export const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Todos os status' },
  { value: 'SUBMITTED', label: 'Em avaliação' },
  { value: 'QUALIFIED', label: 'Habilitada' },
  { value: 'DISQUALIFIED', label: 'Inabilitada' },
] as const;

export const CATEGORY_FILTER_OPTIONS = [
  { value: '', label: 'Todas as categorias' },
  ...CATEGORIES.map(c => ({ value: c.value, label: c.label })),
];

export function usePhase1Controller() {
  const { works, total, pageSize, page } = useLoaderData<{
    role: Role;
    works: Phase1WorkRow[];
    total: number;
    pageSize: number;
    page: number;
  }>();
  const actionData = useActionData<{ success?: boolean; error?: string }>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedWork, setSelectedWork] = useState<Phase1WorkRow | null>(null);
  const [justification, setJustification] = useState('');

  const statusFilter = searchParams.get('status') ?? '';
  const categoryFilter = searchParams.get('category') ?? '';
  const isSubmitting = navigation.state !== 'idle';
  const totalPages = Math.ceil(total / pageSize);

  const justSucceeded = actionData?.success && navigation.state === 'idle';
  useEffect(() => {
    if (justSucceeded) {
      setSelectedWork(null);
      setJustification('');
    }
  }, [justSucceeded]);

  function setFilter(key: string, value: string) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value) { next.set(key, value); } else { next.delete(key); }
      next.delete('page');
      return next;
    });
  }

  function setPage(p: number) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('page', String(p));
      return next;
    });
  }

  function openReview(work: Phase1WorkRow) {
    setSelectedWork(work);
    setJustification(work.phase1Review?.justification ?? '');
  }

  function submitReview(qualified: boolean) {
    if (!selectedWork) { return; }
    const form = new FormData();
    form.append('workId', selectedWork.id);
    form.append('qualified', String(qualified));
    form.append('justification', justification);
    submit(form, { method: 'post', action: '/dashboard/phase1/works' });
  }

  function getCategoryLabel(cat: string) {
    return CATEGORY_LABELS[cat] ?? cat;
  }

  function formatDate(iso: string) {
    return isoToBR(iso.slice(0, 10));
  }

  return {
    works,
    total,
    pageSize,
    page,
    totalPages,
    statusFilter,
    categoryFilter,
    setFilter,
    setPage,
    selectedWork,
    setSelectedWork,
    justification,
    setJustification,
    openReview,
    submitReview,
    isSubmitting,
    serverError: actionData?.error,
    getCategoryLabel,
    formatDate,
  };
}
