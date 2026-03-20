import { useRef, useState } from 'react';
import { useActionData, useLoaderData, useNavigation, useRevalidator, useSubmit } from 'react-router';
import { CATEGORIES } from '~/lib/enums';
import type { ProfileLoaderData } from './useProfileController';

export function useCategoryChangeController() {
  const { candidate } = useLoaderData<ProfileLoaderData & { candidate: { worksCount: number } }>();
  const actionData = useActionData<{ success?: boolean; intent?: string; error?: string }>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const revalidator = useRevalidator();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(candidate.category);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [docKey, setDocKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSubmitting = navigation.state !== 'idle';
  const hasWorks = candidate.worksCount > 0;
  const isUniversity = selectedCategory === 'UNIVERSITY';
  const docRequired = isUniversity ? !candidate.hasEnrollment : !candidate.hasDrt;

  const justSucceeded = actionData?.success && actionData?.intent === 'changeCategory' && navigation.state === 'idle';

  if (justSucceeded && sheetOpen) {
    setSheetOpen(false);
    setDocKey(null);
    setUploadError(null);
    revalidator.revalidate();
  }

  function openSheet() {
    setSelectedCategory(candidate.category);
    setDocKey(null);
    setUploadError(null);
    setSheetOpen(true);
  }

  async function handleDocChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {return;}

    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowed.includes(file.type)) {
      setUploadError('Apenas PDF, JPEG ou PNG são permitidos.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('O arquivo deve ter no máximo 10 MB.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const folder = isUniversity ? 'enrollment' : 'drt';
      const res = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder, contentType: file.type }),
      });
      if (!res.ok) {throw new Error('Erro ao obter URL de upload.');}
      const { presignedPost, key } = await res.json();

      const formData = new FormData();
      for (const [k, v] of Object.entries(presignedPost.fields as Record<string, string>)) {
        formData.append(k, v);
      }
      formData.append('file', file);

      const uploadRes = await fetch(presignedPost.url, { method: 'POST', body: formData });
      if (!uploadRes.ok) {throw new Error('Erro ao enviar o arquivo.');}

      setDocKey(key);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Erro desconhecido.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {fileInputRef.current.value = '';}
    }
  }

  function handleSubmit() {
    const form = new FormData();
    form.append('intent', 'changeCategory');
    form.append('category', selectedCategory);
    if (isUniversity && docKey) {form.append('enrollmentFile', docKey);}
    if (!isUniversity && docKey) {form.append('drtFile', docKey);}
    submit(form, { method: 'post', action: '/dashboard/profile' });
  }

  const availableCategories = CATEGORIES.filter(c => c.value !== candidate.category);
  const categoryChanged = selectedCategory !== candidate.category;
  const canSubmit = categoryChanged && (!docRequired || docKey !== null) && !isUploading;

  return {
    candidate,
    sheetOpen,
    setSheetOpen,
    openSheet,
    selectedCategory,
    setSelectedCategory,
    availableCategories,
    isUniversity,
    categoryChanged,
    docRequired,
    docKey,
    fileInputRef,
    handleDocChange,
    handleSubmit,
    isUploading,
    isSubmitting,
    uploadError: uploadError ?? (actionData?.intent !== 'changeCategory' ? undefined : actionData?.error),
    canSubmit,
    hasWorks,
  };
}
