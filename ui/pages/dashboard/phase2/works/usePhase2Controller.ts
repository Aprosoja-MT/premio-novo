import { useEffect, useState } from 'react';
import { useActionData, useLoaderData, useNavigation, useSearchParams, useSubmit } from 'react-router';
import { CATEGORIES, CATEGORY_LABELS } from '~/lib/enums';
import type { Role } from '~/lib/roles';
import { isoToBR } from '~/lib/utils';

export type Phase2ScoreValues = {
  thematicRelevance: number;
  newsContent: number;
  textQuality: number;
  narrativeQuality: number;
  aestheticQuality: number;
  photoRelevance: number;
  publicBenefit: number;
  sources: number;
  originality: number;
};

export type Phase2WorkRow = {
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
  myScore: (Phase2ScoreValues & { id: string; updatedAt: string }) | null;
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

export const PHASE2_CRITERIA: { key: keyof Phase2ScoreValues; label: string }[] = [
  { key: 'thematicRelevance', label: 'Pertinência temática' },
  { key: 'newsContent', label: 'Conteúdo da notícia' },
  { key: 'textQuality', label: 'Qualidade de texto' },
  { key: 'narrativeQuality', label: 'Qualidade da narrativa' },
  { key: 'aestheticQuality', label: 'Qualidade estética' },
  { key: 'photoRelevance', label: 'Relevância da fotografia' },
  { key: 'publicBenefit', label: 'Benefício público' },
  { key: 'sources', label: 'Fontes de informação' },
  { key: 'originality', label: 'Originalidade, inovação e criatividade' },
];

const EMPTY_SCORES: Phase2ScoreValues = {
  thematicRelevance: 0,
  newsContent: 0,
  textQuality: 0,
  narrativeQuality: 0,
  aestheticQuality: 0,
  photoRelevance: 0,
  publicBenefit: 0,
  sources: 0,
  originality: 0,
};

export function usePhase2Controller() {
  const { works, total, pageSize, page, role, phaseOpen, phaseStarted } = useLoaderData<{
    role: Role;
    works: Phase2WorkRow[];
    total: number;
    pageSize: number;
    page: number;
    phaseOpen: boolean;
    phaseStarted: boolean;
  }>();
  const actionData = useActionData<{ success?: boolean; error?: string; finalistCount?: number }>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedWork, setSelectedWork] = useState<Phase2WorkRow | null>(null);
  const [scores, setScores] = useState<Phase2ScoreValues>(EMPTY_SCORES);

  const categoryFilter = searchParams.get('category') ?? '';
  const scoredFilter = searchParams.get('scored') ?? '';
  const isSubmitting = navigation.state !== 'idle';
  const totalPages = Math.ceil(total / pageSize);

  const justSucceeded = actionData?.success && !actionData?.finalistCount && navigation.state === 'idle';
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

  function openReview(work: Phase2WorkRow) {
    setSelectedWork(work);
    setScores(work.myScore
      ? {
          thematicRelevance: work.myScore.thematicRelevance,
          newsContent: work.myScore.newsContent,
          textQuality: work.myScore.textQuality,
          narrativeQuality: work.myScore.narrativeQuality,
          aestheticQuality: work.myScore.aestheticQuality,
          photoRelevance: work.myScore.photoRelevance,
          publicBenefit: work.myScore.publicBenefit,
          sources: work.myScore.sources,
          originality: work.myScore.originality,
        }
      : EMPTY_SCORES,
    );
  }

  function setScore(key: keyof Phase2ScoreValues, value: number) {
    setScores(prev => ({ ...prev, [key]: value }));
  }

  function submitScores() {
    if (!selectedWork) { return; }
    const form = new FormData();
    form.append('workId', selectedWork.id);
    for (const [key, val] of Object.entries(scores)) {
      form.append(key, String(val));
    }
    submit(form, { method: 'post', action: '/dashboard/phase2/works' });
  }

  function submitMarkFinalists() {
    const form = new FormData();
    form.append('intent', 'markFinalists');
    submit(form, { method: 'post', action: '/dashboard/phase2/works' });
  }

  const allScored = PHASE2_CRITERIA.every(c => scores[c.key] >= 1);

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
    phaseOpen,
    phaseStarted,
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
    submitMarkFinalists,
    allScored,
    isSubmitting,
    serverError: actionData?.error,
    finalistCount: actionData?.finalistCount,
    getCategoryLabel,
    formatDate,
  };
}
