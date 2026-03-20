import { useEffect, useRef, useState } from 'react';
import { useActionData, useLoaderData, useNavigation, useSubmit } from 'react-router';
import { REGION_VALUES, WORK_FORMAT_VALUES, WORK_STATUSES } from '~/lib/enums';
import type { Role } from '~/lib/roles';

export type WorkStatus = typeof WORK_STATUSES[number];
export type WorkRegion = typeof REGION_VALUES[number];
export type WorkFormat = typeof WORK_FORMAT_VALUES[number];

export type WorkRow = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: WorkStatus;
  publishedAt: string;
  createdAt: string;
  mediaFile: string | null;
  mediaFileUrl: string | null;
  mediaUrl: string | null;
  isPrinted: boolean;
  workFormat: WorkFormat | null;
  region: WorkRegion | null;
  sourceWorkId: string | null;
};

export type CandidateInfo = {
  id: string;
  category: string;
  state: string;
  wantsMaster: boolean;
};

export type WorksLoaderData = {
  role: Role;
  candidate: CandidateInfo;
  works: WorkRow[];
  publicationWindow: { start: string; end: string };
};

export function remainingMainSlots(works: WorkRow[], category: string): number {
  const mainCount = works.filter(w => !w.region && w.category === category).length;
  return Math.max(0, 2 - mainCount);
}

export function canSubmitDestaques(works: WorkRow[], state: string): boolean {
  if (state !== 'MT') {return false;}
  const destaquesCount = works.filter(w => w.region != null).length;
  return destaquesCount < 1;
}

export type SheetMode =
  | { type: 'new-main' }
  | { type: 'new-destaques-same'; sourceWorkId: string }
  | { type: 'new-destaques-new' };

export function useWorksController() {
  const { candidate, works, publicationWindow } = useLoaderData<WorksLoaderData>();
  const actionData = useActionData<{ success?: boolean; error?: string }>();
  const navigation = useNavigation();
  const submit = useSubmit();

  const [sheetMode, setSheetMode] = useState<SheetMode | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isSubmitting = navigation.state !== 'idle';
  const busy = isSubmitting || isUploading;

  const mainWorks = works.filter(w => !w.region);
  const destaquesWork = works.find(w => w.region != null) ?? null;

  const remainingMain = remainingMainSlots(works, candidate.category);
  const canDestaques = canSubmitDestaques(works, candidate.state);
  const hasDestaquesWork = destaquesWork != null;

  const pendingSubmitRef = useRef(false);

  useEffect(() => {
    if (actionData?.success && pendingSubmitRef.current) {
      pendingSubmitRef.current = false;
      setSheetMode(null);
      setUploadError(null);
    }
  }, [actionData]);

  function getMediaDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const el = file.type.startsWith('video/') ? document.createElement('video') : document.createElement('audio');
      el.preload = 'metadata';
      el.onloadedmetadata = () => { URL.revokeObjectURL(url); resolve(el.duration); };
      el.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Não foi possível ler o arquivo.')); };
      el.src = url;
    });
  }

  async function uploadWorkFile(file: File): Promise<string> {
    const res = await fetch('/api/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: 'works', contentType: file.type }),
    });
    if (!res.ok) {throw new Error('Erro ao obter URL de upload.');}
    const { presignedPost, key } = await res.json();

    const fd = new FormData();
    for (const [k, v] of Object.entries(presignedPost.fields as Record<string, string>)) {
      fd.append(k, v);
    }
    fd.append('file', file);

    const uploadRes = await fetch(presignedPost.url, { method: 'POST', body: fd });
    if (!uploadRes.ok) {throw new Error('Erro ao fazer upload.');}
    return key;
  }

  async function submitWork(values: SubmitWorkValues) {
    setUploadError(null);
    setIsUploading(true);
    try {
      let mediaFileKey: string | undefined;
      if (values.mediaFile instanceof File) {
        const isVideoOrAudio = values.mediaFile.type.startsWith('video/') || values.mediaFile.type.startsWith('audio/');
        if (isVideoOrAudio) {
          const duration = await getMediaDuration(values.mediaFile);
          if (duration > 10 * 60 + 1) {
            throw new Error('A obra deve ter no máximo 10 minutos de duração.');
          }
        }
        mediaFileKey = await uploadWorkFile(values.mediaFile);
      }

      const fd = new FormData();
      fd.append('intent', 'submit');
      fd.append('title', values.title);
      fd.append('publishedAt', values.publishedAt);
      fd.append('description', values.description);
      if (mediaFileKey) {fd.append('mediaFile', mediaFileKey);}
      if (values.mediaUrl) {fd.append('mediaUrl', values.mediaUrl);}
      if (values.isPrinted) {fd.append('isPrinted', 'true');}
      if (values.workFormat) {fd.append('workFormat', values.workFormat);}
      if (values.region) {fd.append('region', values.region);}
      if (values.sourceWorkId) {fd.append('sourceWorkId', values.sourceWorkId);}
      fd.append('declarationAuthor', 'true');
      fd.append('declarationVehicle', 'true');
      fd.append('declarationRules', 'true');

      pendingSubmitRef.current = true;
      submit(fd, { method: 'post', action: '/dashboard/works' });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Erro ao enviar.');
    } finally {
      setIsUploading(false);
    }
  }

  function deleteWork(workId: string) {
    const fd = new FormData();
    fd.append('intent', 'delete');
    fd.append('workId', workId);
    submit(fd, { method: 'post', action: '/dashboard/works' });
    setDeleteConfirmId(null);
  }

  return {
    candidate,
    works,
    mainWorks,
    destaquesWork,
    remainingMain,
    canDestaques,
    hasDestaquesWork,
    publicationWindow,
    sheetMode,
    setSheetMode,
    deleteConfirmId,
    setDeleteConfirmId,
    submitWork,
    deleteWork,
    busy,
    isUploading,
    isSubmitting,
    uploadError,
    serverError: actionData?.error,
  };
}

export type SubmitWorkValues = {
  title: string;
  publishedAt: string;
  description: string;
  workFormat?: WorkFormat;
  mediaFile?: File;
  mediaUrl?: string;
  isPrinted?: boolean;
  region?: WorkRegion;
  sourceWorkId?: string;
};
