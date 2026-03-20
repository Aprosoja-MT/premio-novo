import { useEffect, useState } from 'react';
import { useActionData, useLoaderData, useNavigation, useSearchParams, useSubmit } from 'react-router';
import { CATEGORIES, CATEGORY_LABELS } from '~/lib/enums';
import type { Role } from '~/lib/roles';
import { isoToBR } from '~/lib/utils';

export type Phase3ScoreValues = {
  publicImpact: number;
  technicalAlignment: number;
  informationClarity: number;
  chainContribution: number;
};

export type Phase3WorkRow = {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
  description: string;
  status: string;
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
  myScore: (Phase3ScoreValues & { id: string; updatedAt: string }) | null;
};

export const SCORED_FILTER_OPTIONS = [
  { value: '', label: 'Todas as situações' },
  { value: 'false', label: 'Pendente' },
  { value: 'true', label: 'Avaliada' },
] as const;

export const CATEGORY_FILTER_OPTIONS = [
  { value: '', label: 'Todas as categorias' },
  ...CATEGORIES.map(c => ({ value: c.value, label: c.label })),
];

export const PHASE3_CRITERIA: { key: keyof Phase3ScoreValues; label: string }[] = [
  { key: 'publicImpact', label: 'Impacto público' },
  { key: 'technicalAlignment', label: 'Alinhamento técnico' },
  { key: 'informationClarity', label: 'Clareza da informação' },
  { key: 'chainContribution', label: 'Contribuição para a compreensão da cadeia produtiva da soja e do milho' },
];

const EMPTY_SCORES: Phase3ScoreValues = {
  publicImpact: 0,
  technicalAlignment: 0,
  informationClarity: 0,
  chainContribution: 0,
};

export function usePhase3Controller() {
  const { works, total, pageSize, page, role } = useLoaderData<{
    role: Role;
    works: Phase3WorkRow[];
    total: number;
    pageSize: number;
    page: number;
  }>();
  const actionData = useActionData<{ success?: boolean; error?: string }>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedWork, setSelectedWork] = useState<Phase3WorkRow | null>(null);
  const [scores, setScores] = useState<Phase3ScoreValues>(EMPTY_SCORES);

  const categoryFilter = searchParams.get('category') ?? '';
  const scoredFilter = searchParams.get('scored') ?? '';
  const isSubmitting = navigation.state !== 'idle';
  const totalPages = Math.ceil(total / pageSize);

  const justSucceeded = actionData?.success && navigation.state === 'idle';
  const [lastSuccessTimestamp, setLastSuccessTimestamp] = useState<number>(0);

  useEffect(() => {
    if (justSucceeded) {
      const now = Date.now();
      if (now - lastSuccessTimestamp > 500) {
        setLastSuccessTimestamp(now);
        setSelectedWork(null);
        setScores(EMPTY_SCORES);
      }
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

  function openReview(work: Phase3WorkRow) {
    setSelectedWork(work);
    setScores(work.myScore
      ? {
          publicImpact: work.myScore.publicImpact,
          technicalAlignment: work.myScore.technicalAlignment,
          informationClarity: work.myScore.informationClarity,
          chainContribution: work.myScore.chainContribution,
        }
      : EMPTY_SCORES,
    );
  }

  function setScore(key: keyof Phase3ScoreValues, value: number) {
    setScores(prev => ({ ...prev, [key]: value }));
  }

  function submitScores() {
    if (!selectedWork) { return; }
    const form = new FormData();
    form.append('workId', selectedWork.id);
    for (const [key, val] of Object.entries(scores)) {
      form.append(key, String(val));
    }
    submit(form, { method: 'post', action: '/dashboard/phase3/works' });
  }

  const allScored = PHASE3_CRITERIA.every(c => scores[c.key] >= 1);

  function getCategoryLabel(cat: string) {
    return CATEGORY_LABELS[cat] ?? cat;
  }

  function formatDate(iso: string) {
    return isoToBR(iso.slice(0, 10));
  }

  return {
    role,
    works,
    total,
    pageSize,
    page,
    totalPages,
    categoryFilter,
    scoredFilter,
    setFilter,
    setPage,
    selectedWork,
    setSelectedWork,
    scores,
    setScore,
    openReview,
    submitScores,
    allScored,
    isSubmitting,
    serverError: actionData?.error,
    getCategoryLabel,
    formatDate,
  };
}
