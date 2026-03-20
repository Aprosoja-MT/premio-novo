import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Loader2,
  MapPin,
  Plus,
  Star,
  Trash2,
  Upload,
  XCircle,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { useLoaderData } from 'react-router';
import { Button } from '~/components/ui/Button';
import { DatePicker } from '~/components/ui/date-picker';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet';
import { CATEGORY_LABELS, REGION_LABELS, REGIONS, WORK_FORMATS } from '~/lib/enums';
import type { Role } from '~/lib/roles';
import { isoToBR } from '~/lib/utils';
import { DashboardLayout } from '../DashboardLayout';
import {
  useWorksController,
  type SheetMode,
  type SubmitWorkValues,
  type WorkFormat,
  type WorkRegion,
  type WorkRow,
} from './useWorksController';


const STATUS_CONFIG = {
  SUBMITTED: { label: 'Em avaliação', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Clock },
  QUALIFIED: { label: 'Habilitada', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
  DISQUALIFIED: { label: 'Inabilitada', color: 'text-destructive bg-destructive/5 border-destructive/20', icon: XCircle },
  FINALIST: { label: 'Finalista', color: 'text-amber-500 bg-amber-50 border-amber-200', icon: Star },
} as const;

const INPUT_CLASS = 'h-[44px] rounded-[12px] border-[1.5px] border-aprosoja-mint bg-white text-[13px] text-aprosoja-teal placeholder:text-aprosoja-teal/30 focus:outline-none focus:border-aprosoja-teal px-3 w-full';
const TEXTAREA_CLASS = 'rounded-[12px] border-[1.5px] border-aprosoja-mint bg-white text-[13px] text-aprosoja-teal placeholder:text-aprosoja-teal/30 focus:outline-none focus:border-aprosoja-teal px-3 py-2.5 w-full resize-none';
const LABEL_CLASS = 'text-[11px] font-bold font-sans text-aprosoja-teal uppercase tracking-wide';
const SELECT_CLASS = 'h-[44px] rounded-[12px] border-[1.5px] border-aprosoja-mint bg-white text-[13px] text-aprosoja-teal px-3 w-full outline-none focus:border-aprosoja-teal appearance-none';


export function WorksPage() {
  const { role } = useLoaderData<{ role: Role }>();
  return (
    <DashboardLayout role={role}>
      <WorksContent />
    </DashboardLayout>
  );
}


function WorksContent() {
  const ctrl = useWorksController();
  const {
    candidate,
    works,
    mainWorks,
    destaquesWork,
    remainingMain,
    canDestaques,
    hasDestaquesWork,
    sheetMode,
    setSheetMode,
    deleteConfirmId,
    setDeleteConfirmId,
    submitWork,
    deleteWork,
    busy,
    uploadError,
    serverError,
  } = ctrl;

  const categoryLabel = CATEGORY_LABELS[candidate.category] ?? candidate.category;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span className="inline-flex items-center px-3 py-1 border border-aprosoja-mint rounded-full text-[10px] font-bold font-sans text-aprosoja-teal uppercase tracking-widest">
            Candidato
          </span>
          <h1 className="mt-3 font-heading-now text-[28px] sm:text-[32px] leading-tight text-aprosoja-teal">
            Minhas Obras
          </h1>
          <p className="mt-1 text-[13px] font-sans text-aprosoja-teal/50">
            Categoria: <span className="font-semibold text-aprosoja-teal">{categoryLabel}</span>
          </p>
        </div>

        {remainingMain > 0 && (
          <Button
            onClick={() => setSheetMode({ type: 'new-main' })}
            className="shrink-0 h-[38px] rounded-[30px] text-[11px] font-bold uppercase tracking-wide cursor-pointer"
          >
            <Plus size={14} />
            Adicionar obra
          </Button>
        )}
      </div>

      {/* Slots indicator */}
      <div className="flex flex-wrap gap-2">
        {[0, 1].map(i => {
          const filled = mainWorks[i];
          return (
            <div
              key={i}
              className={`flex items-center gap-2 h-[30px] px-3 rounded-full border text-[11px] font-bold font-sans uppercase tracking-wide ${
                filled
                  ? 'border-aprosoja-teal bg-aprosoja-teal text-white'
                  : 'border-aprosoja-mint/50 bg-white text-aprosoja-teal/40'
              }`}
            >
              <span>Obra {i + 1}</span>
              {filled && <CheckCircle2 size={11} strokeWidth={2.5} />}
            </div>
          );
        })}
        <div
          className={`flex items-center gap-2 h-[30px] px-3 rounded-full border text-[11px] font-bold font-sans uppercase tracking-wide ${
            destaquesWork
              ? 'border-amber-400 bg-amber-400 text-white'
              : candidate.state !== 'MT'
              ? 'border-aprosoja-mint/20 bg-white text-aprosoja-teal/20'
              : 'border-amber-300/60 bg-white text-amber-600/60'
          }`}
        >
          <MapPin size={11} strokeWidth={2.5} />
          <span>Destaques MT</span>
          {destaquesWork && <CheckCircle2 size={11} strokeWidth={2.5} />}
        </div>
      </div>

      {/* Main works list */}
      {mainWorks.length === 0 ? (
        <EmptyState onAdd={() => setSheetMode({ type: 'new-main' })} />
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-bold font-sans text-aprosoja-teal/40 uppercase tracking-widest">
            Obras principais
          </p>
          {mainWorks.map((work, i) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut', delay: i * 0.04 }}
            >
              <WorkCard
                work={work}
                onDelete={() => setDeleteConfirmId(work.id)}
                deleteConfirm={deleteConfirmId === work.id}
                onDeleteConfirm={() => deleteWork(work.id)}
                onDeleteCancel={() => setDeleteConfirmId(null)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Destaques MT section */}
      {candidate.state === 'MT' && (
        <DestaquesSection
          destaquesWork={destaquesWork}
          canAdd={canDestaques}
          mainWorks={mainWorks}
          onAddSame={(sourceWorkId) => setSheetMode({ type: 'new-destaques-same', sourceWorkId })}
          onAddNew={() => setSheetMode({ type: 'new-destaques-new' })}
          onDelete={() => destaquesWork && setDeleteConfirmId(destaquesWork.id)}
          deleteConfirm={destaquesWork ? deleteConfirmId === destaquesWork.id : false}
          onDeleteConfirm={() => destaquesWork && deleteWork(destaquesWork.id)}
          onDeleteCancel={() => setDeleteConfirmId(null)}
        />
      )}

      {/* Submit sheet */}
      <Sheet open={sheetMode != null} onOpenChange={(open) => { if (!open) setSheetMode(null); }}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[480px] bg-white p-0 gap-0 border-l border-aprosoja-mint/30 overflow-y-auto"
        >
          {sheetMode && (
            <WorkForm
              mode={sheetMode}
              candidateCategory={candidate.category}
              publicationWindowStart="2025-09-12"
              publicationWindowEnd="2026-08-07"
              onSubmit={submitWork}
              busy={busy}
              uploadError={uploadError ?? serverError}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function DestaquesSection({
  destaquesWork,
  canAdd,
  mainWorks,
  onAddSame,
  onAddNew,
  onDelete,
  deleteConfirm,
  onDeleteConfirm,
  onDeleteCancel,
}: {
  destaquesWork: WorkRow | null;
  canAdd: boolean;
  mainWorks: WorkRow[];
  onAddSame: (sourceWorkId: string) => void;
  onAddNew: () => void;
  onDelete: () => void;
  deleteConfirm: boolean;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold font-sans text-aprosoja-teal/40 uppercase tracking-widest">
          Destaques Mato-Grossenses
        </p>
        {canAdd && !showOptions && (
          <button
            type="button"
            onClick={() => setShowOptions(true)}
            className="flex items-center gap-1.5 text-[11px] font-bold font-sans text-amber-600 uppercase tracking-wide hover:text-amber-700 transition-colors"
          >
            <Plus size={13} strokeWidth={2.5} />
            Participar
          </button>
        )}
      </div>

      {/* Option picker */}
      <AnimatePresence>
        {showOptions && canAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 p-5 rounded-2xl bg-amber-50 border border-amber-200">
              <p className="text-[12px] font-sans font-semibold text-amber-800">
                Como deseja participar dos Destaques MT?
              </p>
              <p className="text-[11px] font-sans text-amber-700/70">
                Você pode usar uma das obras já inscritas ou submeter uma obra diferente exclusivamente para Destaques MT.
              </p>
              <div className="flex flex-col gap-2">
                {mainWorks.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => { onAddSame(w.id); setShowOptions(false); }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-amber-200 hover:border-amber-400 transition-colors text-left"
                  >
                    <MapPin size={15} className="text-amber-500 shrink-0" strokeWidth={1.75} />
                    <div>
                      <p className="text-[12px] font-sans font-semibold text-aprosoja-teal">{w.title}</p>
                      <p className="text-[10px] font-sans text-aprosoja-teal/50">Usar esta obra</p>
                    </div>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => { onAddNew(); setShowOptions(false); }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white border border-amber-200 hover:border-amber-400 transition-colors text-left"
                >
                  <Plus size={15} className="text-amber-500 shrink-0" strokeWidth={1.75} />
                  <div>
                    <p className="text-[12px] font-sans font-semibold text-aprosoja-teal">Submeter obra diferente</p>
                    <p className="text-[10px] font-sans text-aprosoja-teal/50">Nova obra exclusiva para Destaques MT</p>
                  </div>
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowOptions(false)}
                className="text-[11px] font-sans text-amber-700/60 hover:text-amber-700 transition-colors self-start"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {destaquesWork ? (
        <WorkCard
          work={destaquesWork}
          isDestaques
          onDelete={onDelete}
          deleteConfirm={deleteConfirm}
          onDeleteConfirm={onDeleteConfirm}
          onDeleteCancel={onDeleteCancel}
        />
      ) : !canAdd && !showOptions ? (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50/50 border border-amber-100 border-dashed">
          <MapPin size={16} className="text-amber-400/60 shrink-0" strokeWidth={1.5} />
          <p className="text-[12px] font-sans text-amber-700/50">
            Adicione ao menos uma obra principal para participar dos Destaques MT.
          </p>
        </div>
      ) : null}
    </div>
  );
}

// ─── Work card ───────────────────────────────────────────────────────────────

function WorkCard({
  work,
  isDestaques = false,
  onDelete,
  deleteConfirm,
  onDeleteConfirm,
  onDeleteCancel,
}: {
  work: WorkRow;
  isDestaques?: boolean;
  onDelete: () => void;
  deleteConfirm: boolean;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}) {
  const cfg = STATUS_CONFIG[work.status];
  const Icon = cfg.icon;
  const canDelete = work.status === 'SUBMITTED';

  return (
    <div className={`flex flex-col gap-3 p-4 rounded-xl bg-white border transition-colors ${
      isDestaques ? 'border-amber-200 hover:border-amber-300' : 'border-aprosoja-mint/20 hover:border-aprosoja-mint/50'
    }`}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {isDestaques && (
              <span className="inline-flex items-center gap-1 h-[20px] px-2 rounded-full bg-amber-100 border border-amber-200 text-[10px] font-bold font-sans text-amber-700 uppercase tracking-wide">
                <MapPin size={9} strokeWidth={2.5} />
                {work.region ? REGION_LABELS[work.region] : 'Destaques MT'}
              </span>
            )}
            {work.sourceWorkId && (
              <span className="inline-flex items-center gap-1 h-[20px] px-2 rounded-full bg-aprosoja-mint/10 border border-aprosoja-mint/20 text-[10px] font-bold font-sans text-aprosoja-teal uppercase tracking-wide">
                Mesma obra
              </span>
            )}
          </div>
          <p className="mt-1 text-[13px] font-sans font-semibold text-aprosoja-teal leading-tight">
            {work.title}
          </p>
          <p className="mt-0.5 text-[11px] font-sans text-aprosoja-teal/40">
            Publicado em {new Date(work.publishedAt).toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex items-center gap-1.5 h-[22px] px-2.5 rounded-full border text-[10px] font-bold font-sans uppercase tracking-wide whitespace-nowrap ${cfg.color}`}>
            <Icon size={10} strokeWidth={2.5} />
            {cfg.label}
          </span>
          {canDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-aprosoja-teal/30 hover:text-destructive hover:bg-destructive/5 transition-colors"
              aria-label="Excluir obra"
            >
              <Trash2 size={14} strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>

      {work.mediaUrl && (
        <a
          href={work.mediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] font-sans text-aprosoja-teal/50 hover:text-aprosoja-teal transition-colors"
        >
          <ExternalLink size={11} strokeWidth={1.75} />
          Ver obra
        </a>
      )}
      {work.mediaFileUrl && (
        <a
          href={work.mediaFileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] font-sans text-aprosoja-teal/50 hover:text-aprosoja-teal transition-colors"
        >
          <FileText size={11} strokeWidth={1.75} />
          Ver arquivo
        </a>
      )}

      {/* Delete confirm inline */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 pt-2 border-t border-destructive/10">
              <p className="flex-1 text-[12px] font-sans text-destructive">Confirmar exclusão?</p>
              <button
                type="button"
                onClick={onDeleteConfirm}
                className="h-[28px] px-3 rounded-lg bg-destructive text-white text-[11px] font-bold font-sans uppercase tracking-wide hover:bg-destructive/80 transition-colors"
              >
                Excluir
              </button>
              <button
                type="button"
                onClick={onDeleteCancel}
                className="h-[28px] px-3 rounded-lg border border-aprosoja-mint/50 text-aprosoja-teal text-[11px] font-bold font-sans uppercase tracking-wide hover:bg-aprosoja-teal/5 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onAdd}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex flex-col items-center justify-center gap-3 py-14 w-full rounded-2xl bg-white border border-aprosoja-mint/20 border-dashed hover:border-aprosoja-mint hover:bg-aprosoja-mint/5 transition-colors group"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-aprosoja-teal/10 group-hover:bg-aprosoja-teal/20 transition-colors">
        <Plus size={18} className="text-aprosoja-teal" strokeWidth={2} />
      </div>
      <p className="text-[13px] font-sans font-semibold text-aprosoja-teal/60 group-hover:text-aprosoja-teal transition-colors">
        Adicionar primeira obra
      </p>
    </motion.button>
  );
}

// ─── Work form (inside sheet) ─────────────────────────────────────────────────

type WorkFormProps = {
  mode: SheetMode;
  candidateCategory: string;
  publicationWindowStart: string;
  publicationWindowEnd: string;
  onSubmit: (values: SubmitWorkValues) => void;
  busy: boolean;
  uploadError?: string | null;
};

function WorkForm({ mode, candidateCategory, publicationWindowStart, publicationWindowEnd, onSubmit, busy, uploadError }: WorkFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDestaques = mode.type !== 'new-main';
  const isSameWork = mode.type === 'new-destaques-same';

  const [title, setTitle] = useState('');
  const [publishedAt, setPublishedAt] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isPrinted, setIsPrinted] = useState(false);
  const [region, setRegion] = useState<WorkRegion | ''>('');
  const [declarations, setDeclarations] = useState({ author: false, vehicle: false, rules: false });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [useFileUpload, setUseFileUpload] = useState(false);
  const [workFormat, setWorkFormat] = useState<WorkFormat | ''>('');

  const effectiveFormat: WorkFormat | null =
    candidateCategory === 'UNIVERSITY'
      ? (workFormat || null)
      : candidateCategory === 'VIDEO' || candidateCategory === 'AUDIO' || candidateCategory === 'TEXT' || candidateCategory === 'PHOTO'
      ? (candidateCategory as WorkFormat)
      : null;

  const acceptedMimeTypes =
    effectiveFormat === 'VIDEO' ? 'video/mp4,video/quicktime'
    : effectiveFormat === 'AUDIO' ? 'audio/mpeg,audio/mp4,audio/wav'
    : 'application/pdf,image/jpeg,image/png';

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!isSameWork && !title.trim()) errs.title = 'Informe o título.';
    if (!isSameWork && !publishedAt) errs.publishedAt = 'Informe a data de publicação.';
    if (!isSameWork && publishedAt) {
      const start = new Date(publicationWindowStart);
      const end = new Date(publicationWindowEnd + 'T23:59:59');
      if (publishedAt < start || publishedAt > end) errs.publishedAt = `Data deve estar entre ${isoToBR(publicationWindowStart)} e ${isoToBR(publicationWindowEnd)}.`;
    }
    if (!isSameWork && !description.trim()) errs.description = 'Informe a descrição.';
    if (!isSameWork && description.length > 400) errs.description = 'Máximo 400 caracteres.';
    if (!isSameWork && candidateCategory === 'UNIVERSITY' && !workFormat) {
      errs.workFormat = 'Selecione o formato da obra.';
    }
    if (!isSameWork && effectiveFormat === 'TEXT' && isPrinted && !mediaFile) {
      errs.mediaFile = 'Envie o arquivo da obra impressa.';
    }
    if (!isSameWork && effectiveFormat === 'TEXT' && !isPrinted && !mediaUrl.trim()) {
      errs.mediaUrl = 'Informe o link da obra ou marque "Impresso".';
    }
    if (!isSameWork && (effectiveFormat === 'VIDEO' || effectiveFormat === 'AUDIO')) {
      if (useFileUpload && !mediaFile) errs.mediaFile = 'Envie o arquivo da obra.';
      if (!useFileUpload && !mediaUrl.trim()) errs.mediaUrl = 'Informe o link da obra ou selecione upload de arquivo.';
    }
    if (!isSameWork && effectiveFormat === 'PHOTO' && !mediaFile) {
      errs.mediaFile = 'Envie o arquivo da obra.';
    }
    if (isDestaques && !region) errs.region = 'Selecione uma região.';
    if (!declarations.author) errs.decl = 'Aceite todas as declarações.';
    if (!declarations.vehicle) errs.decl = 'Aceite todas as declarações.';
    if (!declarations.rules) errs.decl = 'Aceite todas as declarações.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      title: isSameWork ? '' : title,
      publishedAt: isSameWork ? '' : (publishedAt ? publishedAt.toISOString().slice(0, 10) : ''),
      description: isSameWork ? '' : description,
      workFormat: workFormat || undefined,
      mediaFile: mediaFile ?? undefined,
      mediaUrl: mediaUrl || undefined,
      isPrinted,
      region: region || undefined,
      sourceWorkId: mode.type === 'new-destaques-same' ? mode.sourceWorkId : undefined,
    });
  }

  const sheetTitle =
    mode.type === 'new-main' ? 'Nova obra'
    : mode.type === 'new-destaques-same' ? 'Destaques MT — mesma obra'
    : 'Nova obra para Destaques MT';

  const sheetDescription =
    mode.type === 'new-main'
      ? 'Preencha os dados da obra. Após submissão não é possível editar.'
      : mode.type === 'new-destaques-same'
      ? 'Sua obra existente será vinculada aos Destaques MT. Selecione a região.'
      : 'Preencha os dados da obra exclusiva para Destaques MT.';

  return (
    <>
      <SheetHeader className="px-6 pt-6 pb-5 border-b border-aprosoja-mint/20">
        <SheetTitle className="font-heading-now text-[20px] text-aprosoja-teal leading-tight">
          {sheetTitle}
        </SheetTitle>
        <p className="text-[12px] font-sans text-aprosoja-teal/50 mt-0.5">{sheetDescription}</p>
      </SheetHeader>

      <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-5">
        {/* Warn VIDEO/AUDIO duration */}
        {(effectiveFormat === 'VIDEO' || effectiveFormat === 'AUDIO') && !isDestaques && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
            <Clock size={14} className="text-amber-600 shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-[11px] font-sans text-amber-700">
              Duração máxima: <strong>10 minutos</strong> por obra.
            </p>
          </div>
        )}

        {/* Fields hidden when same work */}
        {!isSameWork && (
          <>
            {candidateCategory === 'UNIVERSITY' && (
              <Field label="Formato da obra" error={errors.workFormat}>
                <div className="relative">
                  <select
                    className={SELECT_CLASS}
                    value={workFormat}
                    onChange={e => { setWorkFormat(e.target.value as WorkFormat | ''); setMediaFile(null); setMediaUrl(''); setUseFileUpload(false); setIsPrinted(false); }}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23024240' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                    }}
                  >
                    <option value="">Selecione o formato</option>
                    {WORK_FORMATS.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </Field>
            )}

            <Field label="Título da obra" error={errors.title}>
              <input
                className={INPUT_CLASS}
                placeholder="Informe o título"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={200}
              />
            </Field>

            <Field label={`Data de publicação (${isoToBR(publicationWindowStart)} a ${isoToBR(publicationWindowEnd)})`} error={errors.publishedAt}>
              <DatePicker
                value={publishedAt}
                onChange={setPublishedAt}
                placeholder="Selecione a data de publicação"
                disabled={(date) => {
                  const start = new Date(publicationWindowStart);
                  const end = new Date(publicationWindowEnd + 'T23:59:59');
                  return date < start || date > end;
                }}
              />
            </Field>

            <Field label={`Descrição (${description.length}/400)`} error={errors.description}>
              <textarea
                className={TEXTAREA_CLASS}
                rows={4}
                placeholder="Descreva brevemente a obra"
                value={description}
                onChange={e => setDescription(e.target.value)}
                maxLength={400}
              />
            </Field>

            {effectiveFormat === 'TEXT' && (
              <>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrinted}
                    onChange={e => setIsPrinted(e.target.checked)}
                    className="w-4 h-4 accent-aprosoja-teal rounded"
                  />
                  <span className="text-[12px] font-sans text-aprosoja-teal">Obra impressa (sem link)</span>
                </label>

                {!isPrinted ? (
                  <Field label="Link da obra" error={errors.mediaUrl}>
                    <input
                      className={INPUT_CLASS}
                      type="url"
                      placeholder="https://..."
                      value={mediaUrl}
                      onChange={e => setMediaUrl(e.target.value)}
                    />
                  </Field>
                ) : (
                  <FileUploadField
                    label="Arquivo da obra (PDF)"
                    accept="application/pdf"
                    file={mediaFile}
                    onChange={setMediaFile}
                    error={errors.mediaFile}
                    fileInputRef={fileInputRef}
                  />
                )}
              </>
            )}

            {(effectiveFormat === 'VIDEO' || effectiveFormat === 'AUDIO') && (
              <>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useFileUpload}
                    onChange={e => { setUseFileUpload(e.target.checked); setMediaFile(null); setMediaUrl(''); }}
                    className="w-4 h-4 accent-aprosoja-teal rounded"
                  />
                  <span className="text-[12px] font-sans text-aprosoja-teal">Enviar arquivo (em vez de link)</span>
                </label>

                {useFileUpload ? (
                  <FileUploadField
                    label="Arquivo da obra"
                    accept={acceptedMimeTypes}
                    file={mediaFile}
                    onChange={setMediaFile}
                    error={errors.mediaFile}
                    fileInputRef={fileInputRef}
                  />
                ) : (
                  <Field label="Link da obra" error={errors.mediaUrl}>
                    <input
                      className={INPUT_CLASS}
                      type="url"
                      placeholder="https://..."
                      value={mediaUrl}
                      onChange={e => setMediaUrl(e.target.value)}
                    />
                  </Field>
                )}
              </>
            )}

            {effectiveFormat === 'PHOTO' && (
              <FileUploadField
                label="Arquivo da obra"
                accept={acceptedMimeTypes}
                file={mediaFile}
                onChange={setMediaFile}
                error={errors.mediaFile}
                fileInputRef={fileInputRef}
              />
            )}
          </>
        )}

        {/* Region (always shown for destaques) */}
        {isDestaques && (
          <Field label="Região (Destaques MT)" error={errors.region}>
            <div className="relative">
              <select
                className={SELECT_CLASS}
                value={region}
                onChange={e => setRegion(e.target.value as WorkRegion | '')}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23024240' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                }}
              >
                <option value="">Selecione uma região</option>
                {REGIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </Field>
        )}

        {/* Declarations */}
        <div className="flex flex-col gap-2.5">
          <p className={LABEL_CLASS}>Declarações obrigatórias</p>
          {[
            { key: 'author' as const, label: 'Declaro que sou autor ou coautor da obra' },
            { key: 'vehicle' as const, label: 'Declaro que possuo autorização do veículo' },
            { key: 'rules' as const, label: 'Declaro que li e aceito o regulamento' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={declarations[key]}
                onChange={e => setDeclarations(d => ({ ...d, [key]: e.target.checked }))}
                className="mt-0.5 w-4 h-4 accent-aprosoja-teal rounded shrink-0"
              />
              <span className="text-[12px] font-sans text-aprosoja-teal/70 leading-relaxed">{label}</span>
            </label>
          ))}
          {errors.decl && <p className="text-[11px] font-sans text-destructive">{errors.decl}</p>}
        </div>

        {/* Upload/server error */}
        <AnimatePresence>
          {uploadError && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-[12px] font-sans text-destructive font-medium"
            >
              {uploadError}
            </motion.p>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          disabled={busy}
          className="mt-1 h-[44px] w-full rounded-[30px] text-[11px] font-bold uppercase tracking-wide cursor-pointer"
        >
          {busy && <Loader2 size={14} className="animate-spin" />}
          {busy ? 'Enviando...' : 'Submeter obra'}
        </Button>
      </form>
    </>
  );
}


function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={LABEL_CLASS}>{label}</label>
      {children}
      {error && <p className="text-[11px] font-sans text-destructive">{error}</p>}
    </div>
  );
}


function FileUploadField({
  label,
  accept,
  file,
  onChange,
  error,
  fileInputRef,
}: {
  label: string;
  accept: string;
  file: File | null;
  onChange: (f: File | null) => void;
  error?: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={LABEL_CLASS}>{label}</label>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-3 h-[44px] px-3 rounded-[12px] border-[1.5px] border-dashed border-aprosoja-mint bg-white hover:border-aprosoja-teal hover:bg-aprosoja-teal/5 transition-colors text-left"
      >
        <Upload size={14} className="text-aprosoja-teal/50 shrink-0" strokeWidth={1.75} />
        <span className={`text-[13px] font-sans truncate ${file ? 'text-aprosoja-teal' : 'text-aprosoja-teal/30'}`}>
          {file ? file.name : 'Selecionar arquivo'}
        </span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={e => onChange(e.target.files?.[0] ?? null)}
      />
      {error && <p className="text-[11px] font-sans text-destructive">{error}</p>}
    </div>
  );
}
