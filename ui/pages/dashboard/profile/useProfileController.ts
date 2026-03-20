import { useRef, useState } from 'react';
import { useActionData, useLoaderData, useNavigation, useSubmit } from 'react-router';
import type { Role } from '~/lib/roles';

export type ProfileLoaderData = {
  role: Role;
  candidate: {
    name: string;
    socialName: string | null;
    email: string;
    cpf: string;
    phone: string;
    state: string;
    city: string;
    category: string;
    wantsMaster: boolean;
    emailConfirmedAt: string | null;
    profilePhotoUrl: string | null;
    worksCount: number;
    hasDrt: boolean;
    hasEnrollment: boolean;
  };
};

export function useProfileController() {
  const { candidate } = useLoaderData<ProfileLoaderData>();
  const actionData = useActionData<{ success?: boolean; error?: string }>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(candidate.profilePhotoUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isSubmitting = navigation.state !== 'idle';

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setUploadError('Apenas imagens JPEG ou PNG são permitidas.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('A imagem deve ter no máximo 5 MB.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      // 1. Get presigned URL
      const res = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: 'profile', contentType: file.type }),
      });
      if (!res.ok) throw new Error('Erro ao obter URL de upload.');
      const { presignedPost, key, fileUrl } = await res.json();

      // 2. Upload to S3
      const formData = new FormData();
      for (const [k, v] of Object.entries(presignedPost.fields as Record<string, string>)) {
        formData.append(k, v);
      }
      formData.append('file', file);

      const uploadRes = await fetch(presignedPost.url, { method: 'POST', body: formData });
      if (!uploadRes.ok) throw new Error('Erro ao fazer upload da imagem.');

      // 3. Show preview immediately
      setPreviewUrl(fileUrl);

      // 4. Save key to DB via action
      const actionForm = new FormData();
      actionForm.append('intent', 'updatePhoto');
      actionForm.append('profilePhoto', key);
      submit(actionForm, { method: 'post', action: '/dashboard/profile' });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Erro desconhecido.');
    } finally {
      setIsUploading(false);
      // reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function handleRemove() {
    setPreviewUrl(null);
    const actionForm = new FormData();
    actionForm.append('intent', 'removePhoto');
    submit(actionForm, { method: 'post', action: '/dashboard/profile' });
  }

  return {
    candidate,
    previewUrl,
    isUploading,
    isSubmitting,
    uploadError: uploadError ?? actionData?.error,
    fileInputRef,
    handleFileChange,
    handleRemove,
  };
}
