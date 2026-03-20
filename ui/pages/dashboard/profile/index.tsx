import { motion } from 'framer-motion';
import { Camera, CheckCircle2, Loader2, Trash2, User, XCircle } from 'lucide-react';
import { useLoaderData } from 'react-router';
import { CATEGORY_LABELS } from '~/lib/enums';
import { formatCpf, formatPhone } from '~/lib/utils';
import { DashboardLayout } from '../DashboardLayout';
import type { Role } from '~/lib/roles';
import { useProfileController } from './useProfileController';

export function ProfilePage() {
  const { role } = useLoaderData<{ role: Role }>();

  return (
    <DashboardLayout role={role}>
      <ProfileContent />
    </DashboardLayout>
  );
}

function ProfileContent() {
  const {
    candidate,
    previewUrl,
    isUploading,
    isSubmitting,
    uploadError,
    fileInputRef,
    handleFileChange,
    handleRemove,
  } = useProfileController();

  const busy = isUploading || isSubmitting;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col gap-6 max-w-lg"
    >
      {/* Header */}
      <div>
        <span className="inline-flex items-center px-3 py-1 border border-aprosoja-mint rounded-full text-[10px] font-bold font-sans text-aprosoja-teal uppercase tracking-widest">
          Candidato
        </span>
        <h1 className="mt-3 font-heading-now text-[28px] sm:text-[32px] leading-tight text-aprosoja-teal">
          Meu Perfil
        </h1>
      </div>

      {/* Photo card */}
      <div className="flex flex-col gap-5 p-6 rounded-2xl bg-white border border-aprosoja-mint/20">
        <p className="text-[11px] font-bold font-sans text-aprosoja-teal uppercase tracking-widest">
          Foto de perfil
        </p>

        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-aprosoja-mint/20 flex items-center justify-center border-2 border-aprosoja-mint/30">
              {previewUrl ? (
                <img src={previewUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
              ) : (
                <User size={28} className="text-aprosoja-teal/30" strokeWidth={1.5} />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
              className="absolute -bottom-1 -right-1 flex items-center justify-center w-7 h-7 rounded-full bg-aprosoja-teal text-white shadow-md hover:bg-aprosoja-teal/80 transition-colors disabled:opacity-50"
              aria-label="Alterar foto"
            >
              {isUploading ? <Loader2 size={13} className="animate-spin" /> : <Camera size={13} strokeWidth={2} />}
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
              className="h-[36px] px-4 rounded-[30px] border-[1.5px] border-aprosoja-teal text-[11px] font-bold font-sans text-aprosoja-teal uppercase tracking-wide hover:bg-aprosoja-teal/5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isUploading ? 'Enviando...' : 'Alterar foto'}
            </button>
            {previewUrl && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={busy}
                className="flex items-center gap-1.5 h-[36px] px-4 rounded-[30px] border-[1.5px] border-destructive/40 text-[11px] font-bold font-sans text-destructive uppercase tracking-wide hover:bg-destructive/5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Trash2 size={12} strokeWidth={2} />
                Remover
              </button>
            )}
          </div>
        </div>

        <p className="text-[11px] font-sans text-aprosoja-teal/40">
          Formatos aceitos: JPEG, PNG. Tamanho máximo: 5 MB.
        </p>

        {uploadError && (
          <p className="text-[12px] font-sans text-destructive font-medium">{uploadError}</p>
        )}
      </div>

      {/* Info card */}
      <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white border border-aprosoja-mint/20">
        <p className="text-[11px] font-bold font-sans text-aprosoja-teal uppercase tracking-widest">
          Dados pessoais
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <InfoField label="Nome" value={candidate.name} />
          {candidate.socialName && (
            <InfoField label="Nome social" value={candidate.socialName} />
          )}
          <InfoField label="E-mail" value={candidate.email} wide>
            <span className={`ml-1.5 inline-flex items-center gap-1 text-[10px] font-bold font-sans uppercase tracking-wide ${candidate.emailConfirmedAt ? 'text-aprosoja-mint' : 'text-aprosoja-teal/30'}`}>
              {candidate.emailConfirmedAt
                ? <><CheckCircle2 size={11} strokeWidth={2.5} /> Verificado</>
                : <><XCircle size={11} strokeWidth={2.5} /> Não verificado</>}
            </span>
          </InfoField>
          <InfoField label="CPF" value={formatCpf(candidate.cpf)} />
          <InfoField label="Telefone" value={formatPhone(candidate.phone)} />
          <InfoField label="Estado" value={candidate.state} />
          <InfoField label="Cidade" value={candidate.city} />
        </div>
      </div>

      {/* Inscrição card */}
      <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white border border-aprosoja-mint/20">
        <p className="text-[11px] font-bold font-sans text-aprosoja-teal uppercase tracking-widest">
          Inscrição
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <InfoField
            label="Categoria"
            value={CATEGORY_LABELS[candidate.category] ?? candidate.category}
            wide
          />
          <InfoField
            label="Prêmio Master"
            value={candidate.wantsMaster ? 'Participando do sorteio' : 'Não participa'}
          />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleFileChange}
      />
    </motion.div>
  );
}

function InfoField({
  label,
  value,
  wide,
  children,
}: {
  label: string;
  value: string;
  wide?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <p className="text-[10px] font-bold font-sans text-aprosoja-teal/40 uppercase tracking-widest mb-0.5">
        {label}
      </p>
      <p className="text-[13px] font-sans text-aprosoja-teal font-medium flex items-center flex-wrap gap-x-1">
        {value}
        {children}
      </p>
    </div>
  );
}

