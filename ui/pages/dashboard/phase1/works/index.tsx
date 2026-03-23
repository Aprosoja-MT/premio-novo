import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Loader2,
  MapPin,
  User,
  XCircle,
} from 'lucide-react';
import { useLoaderData } from 'react-router';
import { Button } from '~/components/ui/Button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet';
import { CATEGORY_LABELS, REGION_LABELS } from '~/lib/enums';
import { WORK_STATUS_CONFIG } from '@/lib/workStatus';
import type { Role } from '~/lib/roles';
import { DashboardLayout } from '../../DashboardLayout';
import {
  CATEGORY_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  usePhase1Controller,
  type Phase1WorkRow,
} from './usePhase1Controller';


const SELECT_CLASS = 'h-[34px] rounded-[30px] border-[1.5px] border-aprosoja-mint bg-white px-3 pr-8 text-[12px] font-sans text-aprosoja-teal focus:outline-none focus:border-aprosoja-teal appearance-none';
const CHEVRON_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23024240' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`;

export function Phase1WorksPage() {
  const { role } = useLoaderData<{ role: Role }>();
  return (
    <DashboardLayout role={role}>
      <Phase1WorksContent />
    </DashboardLayout>
  );
}

function Phase1WorksContent() {
  const ctrl = usePhase1Controller();
  const {
    role,
    works,
    total,
    page,
    totalPages,
    phaseOpen,
    phaseStarted,
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
    serverError,
    formatDate,
  } = ctrl;

  const canEdit = phaseOpen || role === 'ADMIN';
  const phaseFinished = phaseStarted && !phaseOpen;
  const phaseNotStarted = !phaseStarted;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center px-3 py-1 border border-aprosoja-mint rounded-full text-[10px] font-bold font-sans text-aprosoja-teal uppercase tracking-widest">
            Comissão de Habilitação
          </span>
          <h1 className="mt-3 font-heading-now text-[28px] sm:text-[32px] leading-tight text-aprosoja-teal">
            Obras
          </h1>
          <p className="mt-1 text-[13px] font-sans text-aprosoja-teal/50">
            {total} obra{total !== 1 ? 's' : ''} encontrada{total !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {phaseFinished && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 text-[12px] font-sans text-amber-700">
          <span className="font-bold">Fase 1 encerrada.</span>
          {role === 'ADMIN' ? 'Você pode editar como administrador.' : 'Avaliações não são permitidas.'}
        </div>
      )}
      {phaseNotStarted && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-aprosoja-mint/30 bg-aprosoja-mint/5 text-[12px] font-sans text-aprosoja-teal/70">
          <span className="font-bold">Fase 1 ainda não iniciada.</span>
          {role !== 'ADMIN' && ' Aguarde o administrador iniciar esta fase.'}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <select
          value={statusFilter}
          onChange={e => setFilter('status', e.target.value)}
          className={SELECT_CLASS}
          style={{ backgroundImage: CHEVRON_BG, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
        >
          {STATUS_FILTER_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={e => setFilter('category', e.target.value)}
          className={SELECT_CLASS}
          style={{ backgroundImage: CHEVRON_BG, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
        >
          {CATEGORY_FILTER_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {works.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-[13px] font-sans text-aprosoja-teal/40">
          Nenhuma obra encontrada com esses filtros.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {works.map((work, i) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut', delay: i * 0.02 }}
            >
              <WorkCard work={work} onReview={() => openReview(work)} formatDate={formatDate} />
            </motion.div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-aprosoja-mint text-aprosoja-teal disabled:opacity-30 hover:bg-aprosoja-mint/10 transition-colors"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="text-[12px] font-sans text-aprosoja-teal/60">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-aprosoja-mint text-aprosoja-teal disabled:opacity-30 hover:bg-aprosoja-mint/10 transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}

      <Sheet open={selectedWork !== null} onOpenChange={open => { if (!open) { setSelectedWork(null); } }}>
        {selectedWork && (
          <ReviewSheet
            work={selectedWork}
            justification={justification}
            setJustification={setJustification}
            onSubmit={submitReview}
            isSubmitting={isSubmitting}
            canEdit={canEdit}
            serverError={serverError}
            formatDate={formatDate}
          />
        )}
      </Sheet>
    </div>
  );
}

function WorkCard({
  work,
  onReview,
  formatDate,
}: {
  work: Phase1WorkRow;
  onReview: () => void;
  formatDate: (iso: string) => string;
}) {
  const cfg = WORK_STATUS_CONFIG[work.status] ?? WORK_STATUS_CONFIG.SUBMITTED;
  const Icon = cfg.icon;
  const categoryLabel = CATEGORY_LABELS[work.category] ?? work.category;

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-xl bg-white border border-aprosoja-mint/20 hover:border-aprosoja-mint/50 transition-colors cursor-pointer"
      onClick={onReview}
    >
      <div className="w-9 h-9 rounded-full bg-aprosoja-mint/20 shrink-0 overflow-hidden flex items-center justify-center">
        {work.candidate.profilePhotoUrl ? (
          <img src={work.candidate.profilePhotoUrl} alt={work.candidate.name} className="w-full h-full object-cover" />
        ) : (
          <User size={16} className="text-aprosoja-teal/40" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-sans font-semibold text-aprosoja-teal truncate">{work.title}</p>
        <div className="flex items-center gap-2 flex-wrap mt-0.5">
          <span className="text-[11px] font-sans text-aprosoja-teal/50">{work.candidate.name}</span>
          <span className="text-aprosoja-teal/20">·</span>
          <span className="text-[11px] font-sans text-aprosoja-teal/50">{categoryLabel}</span>
          <span className="text-aprosoja-teal/20">·</span>
          <span className="text-[11px] font-sans text-aprosoja-teal/50">{formatDate(work.publishedAt)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className={`inline-flex items-center gap-1 h-[22px] px-2.5 rounded-full border text-[10px] font-bold font-sans uppercase tracking-wide whitespace-nowrap ${cfg.color}`}>
          <Icon size={10} strokeWidth={2.5} />
          {cfg.label}
        </span>
      </div>
    </div>
  );
}

function ReviewSheet({
  work,
  justification,
  setJustification,
  onSubmit,
  isSubmitting,
  canEdit,
  serverError,
  formatDate,
}: {
  work: Phase1WorkRow;
  justification: string;
  setJustification: (v: string) => void;
  onSubmit: (qualified: boolean) => void;
  isSubmitting: boolean;
  canEdit: boolean;
  serverError?: string;
  formatDate: (iso: string) => string;
}) {
  const categoryLabel = CATEGORY_LABELS[work.category] ?? work.category;

  return (
    <SheetContent
      side="right"
      className="w-full sm:max-w-[520px] bg-white p-0 gap-0 border-l border-aprosoja-mint/30 flex flex-col"
    >
      <SheetHeader className="px-6 pt-6 pb-5 border-b border-aprosoja-mint/20 shrink-0">
        <SheetTitle className="font-heading-now text-[20px] text-aprosoja-teal leading-tight">
          Avaliar obra
        </SheetTitle>
        <p className="text-[12px] font-sans text-aprosoja-teal/50 mt-0.5">
          Habilite ou inabilite a obra. Ao inabilitar, a justificativa é obrigatória.
        </p>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-aprosoja-mint/20 shrink-0 overflow-hidden flex items-center justify-center">
            {work.candidate.profilePhotoUrl ? (
              <img src={work.candidate.profilePhotoUrl} alt={work.candidate.name} className="w-full h-full object-cover" />
            ) : (
              <User size={18} className="text-aprosoja-teal/40" />
            )}
          </div>
          <div>
            <p className="text-[13px] font-sans font-semibold text-aprosoja-teal">{work.candidate.name}</p>
            <p className="text-[11px] font-sans text-aprosoja-teal/50 flex items-center gap-1">
              <MapPin size={10} strokeWidth={2} />
              {work.candidate.city}, {work.candidate.state}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-4 rounded-xl bg-aprosoja-mint/5 border border-aprosoja-mint/20">
          <div>
            <p className="text-[10px] font-bold font-sans text-aprosoja-teal/40 uppercase tracking-widest mb-0.5">Título</p>
            <p className="text-[13px] font-sans text-aprosoja-teal font-medium">{work.title}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-bold font-sans text-aprosoja-teal/40 uppercase tracking-widest mb-0.5">Categoria</p>
              <p className="text-[13px] font-sans text-aprosoja-teal">{categoryLabel}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold font-sans text-aprosoja-teal/40 uppercase tracking-widest mb-0.5">Publicação</p>
              <p className="text-[13px] font-sans text-aprosoja-teal">{formatDate(work.publishedAt)}</p>
            </div>
            {work.region && (
              <div>
                <p className="text-[10px] font-bold font-sans text-aprosoja-teal/40 uppercase tracking-widest mb-0.5">Região</p>
                <p className="text-[13px] font-sans text-aprosoja-teal">{REGION_LABELS[work.region as keyof typeof REGION_LABELS] ?? work.region}</p>
              </div>
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold font-sans text-aprosoja-teal/40 uppercase tracking-widest mb-0.5">Descrição</p>
            <p className="text-[13px] font-sans text-aprosoja-teal leading-relaxed">{work.description}</p>
          </div>
        </div>

        {(work.mediaUrl || work.mediaFileUrl) && (
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-bold font-sans text-aprosoja-teal/40 uppercase tracking-widest">Mídia</p>
            {work.mediaUrl && (
              <a
                href={work.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 h-[40px] px-4 rounded-[12px] border border-aprosoja-mint text-[12px] font-sans text-aprosoja-teal hover:bg-aprosoja-mint/10 transition-colors"
              >
                <ExternalLink size={13} strokeWidth={2} />
                Abrir link da obra
              </a>
            )}
            {work.mediaFileUrl && (
              <a
                href={work.mediaFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 h-[40px] px-4 rounded-[12px] border border-aprosoja-mint text-[12px] font-sans text-aprosoja-teal hover:bg-aprosoja-mint/10 transition-colors"
              >
                <FileText size={13} strokeWidth={2} />
                Abrir arquivo da obra
              </a>
            )}
          </div>
        )}

        {work.phase1Review && (
          <div className="p-3 rounded-xl border border-aprosoja-mint/20 bg-white">
            <p className="text-[10px] font-bold font-sans text-aprosoja-teal/40 uppercase tracking-widest mb-1">Avaliação anterior</p>
            <p className="text-[12px] font-sans text-aprosoja-teal/70">
              {work.phase1Review.qualified ? 'Habilitada' : 'Inabilitada'} por{' '}
              <span className="font-semibold">{work.phase1Review.reviewer.email}</span>
            </p>
            {work.phase1Review.justification && (
              <p className="text-[12px] font-sans text-aprosoja-teal/60 mt-1 italic">"{work.phase1Review.justification}"</p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold font-sans text-aprosoja-teal uppercase tracking-wide">
            Justificativa <span className="text-aprosoja-teal/40 normal-case font-normal">(obrigatória ao inabilitar)</span>
          </label>
          <textarea
            value={justification}
            onChange={e => setJustification(e.target.value)}
            rows={3}
            placeholder="Descreva o motivo da inabilitação..."
            className="rounded-[12px] border-[1.5px] border-aprosoja-mint bg-white text-[13px] text-aprosoja-teal placeholder:text-aprosoja-teal/30 focus:outline-none focus:border-aprosoja-teal px-3 py-2.5 resize-none"
          />
        </div>

        <AnimatePresence>
          {serverError && (
            <motion.p
              key="err"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="text-[12px] font-sans text-destructive font-medium"
            >
              {serverError}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="shrink-0 px-6 py-5 border-t border-aprosoja-mint/20 flex gap-3">
        <Button
          type="button"
          onClick={() => onSubmit(false)}
          disabled={isSubmitting || !canEdit}
          className="flex-1 h-[44px] rounded-[30px] text-[11px] font-bold uppercase tracking-wide cursor-pointer bg-destructive hover:bg-destructive/90 text-white"
        >
          {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
          Inabilitar
        </Button>
        <Button
          type="button"
          onClick={() => onSubmit(true)}
          disabled={isSubmitting || !canEdit}
          className="flex-1 h-[44px] rounded-[30px] text-[11px] font-bold uppercase tracking-wide cursor-pointer"
        >
          {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
          Habilitar
        </Button>
      </div>
    </SheetContent>
  );
}
