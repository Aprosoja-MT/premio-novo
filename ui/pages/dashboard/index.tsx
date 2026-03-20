import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Clock, FileCheck, Star, Trophy, XCircle } from 'lucide-react';
import { useLoaderData } from 'react-router';
import { CATEGORY_LABELS, WORK_STATUSES } from '~/lib/enums';
import type { Role } from '~/lib/roles';
import { DashboardLayout, ROLE_LABELS } from './DashboardLayout';

const ADMIN_STATS = [
  { label: 'Inscrições', value: '—' },
  { label: 'Obras enviadas', value: '—' },
  { label: 'Em avaliação', value: '—' },
  { label: 'Habilitadas', value: '—' },
  { label: 'Finalistas', value: '—' },
  { label: 'Inabilitadas', value: '—' },
];

type WorkStatus = typeof WORK_STATUSES[number];

type Work = {
  id: string;
  title: string;
  status: WorkStatus;
  category: string;
  createdAt: string;
};

type CandidateData = {
  name: string;
  category: string;
  wantsMaster: boolean;
  emailConfirmedAt: string | null;
  profilePhotoUrl: string | null;
};

type LoaderData =
  | { role: 'CANDIDATE'; candidate: CandidateData; works: Work[] }
  | { role: Exclude<Role, 'CANDIDATE'> };

const STATUS_CONFIG: Record<WorkStatus, { label: string; color: string; icon: React.ElementType }> = {
  SUBMITTED: { label: 'Aguardando avaliação', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Clock },
  QUALIFIED: { label: 'Habilitada', color: 'text-aprosoja-mint bg-aprosoja-mint/10 border-aprosoja-mint/30', icon: CheckCircle2 },
  DISQUALIFIED: { label: 'Inabilitada', color: 'text-destructive bg-destructive/5 border-destructive/20', icon: XCircle },
  FINALIST: { label: 'Finalista', color: 'text-amber-500 bg-amber-50 border-amber-200', icon: Star },
};

export function DashboardPage() {
  const data = useLoaderData<LoaderData>();

  return (
    <DashboardLayout role={data.role}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {data.role === 'CANDIDATE'
          ? <CandidateOverview candidate={data.candidate} works={data.works} />
          : data.role === 'ADMIN'
            ? <AdminOverview />
            : <StaffPlaceholder role={data.role} />}
      </motion.div>
    </DashboardLayout>
  );
}

// ---------------------------------------------------------------------------
// Candidate overview
// ---------------------------------------------------------------------------

function CandidateOverview({ candidate, works }: { candidate: CandidateData; works: Work[] }) {
  const submitted = works.filter(w => w.status === 'SUBMITTED').length;
  const qualified = works.filter(w => w.status === 'QUALIFIED').length;
  const finalist = works.filter(w => w.status === 'FINALIST').length;
  const disqualified = works.filter(w => w.status === 'DISQUALIFIED').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span className="inline-flex items-center px-3 py-1 border border-aprosoja-mint rounded-full text-[10px] font-bold font-sans text-aprosoja-teal uppercase tracking-widest">
            Candidato
          </span>
          <h1 className="mt-3 font-heading-now text-[28px] sm:text-[32px] leading-tight text-aprosoja-teal">
            Olá, {candidate.name.split(' ')[0]}
          </h1>
          <p className="mt-1 text-[13px] font-sans text-aprosoja-teal/50">
            Bem-vindo ao Prêmio Aprosoja MT de Jornalismo 2026.
          </p>
        </div>

        {/* Email warning */}
        {!candidate.emailConfirmedAt && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-[12px] font-sans text-amber-700">
            <XCircle size={14} strokeWidth={2} className="shrink-0" />
            E-mail ainda não verificado
          </div>
        )}
      </div>

      {/* Inscrição card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.05 }}
          className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-aprosoja-mint/20"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-aprosoja-teal/10 shrink-0">
            <BookOpen size={18} className="text-aprosoja-teal" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[10px] font-bold font-sans text-aprosoja-teal/40 uppercase tracking-widest mb-0.5">
              Categoria
            </p>
            <p className="text-[14px] font-sans font-semibold text-aprosoja-teal leading-tight">
              {CATEGORY_LABELS[candidate.category] ?? candidate.category}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
          className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-aprosoja-mint/20"
        >
          <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${candidate.wantsMaster ? 'bg-amber-50' : 'bg-aprosoja-teal/10'}`}>
            <Trophy size={18} className={candidate.wantsMaster ? 'text-amber-500' : 'text-aprosoja-teal/40'} strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[10px] font-bold font-sans text-aprosoja-teal/40 uppercase tracking-widest mb-0.5">
              Prêmio Master
            </p>
            <p className="text-[14px] font-sans font-semibold text-aprosoja-teal leading-tight">
              {candidate.wantsMaster ? 'Participando do sorteio' : 'Não participa'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Works stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Enviadas', value: works.length, icon: FileCheck, accent: 'bg-aprosoja-teal/10 text-aprosoja-teal' },
          { label: 'Em avaliação', value: submitted, icon: Clock, accent: 'bg-amber-50 text-amber-600' },
          { label: 'Habilitadas', value: qualified + finalist, icon: CheckCircle2, accent: 'bg-aprosoja-mint/10 text-aprosoja-mint' },
          { label: 'Inabilitadas', value: disqualified, icon: XCircle, accent: 'bg-destructive/5 text-destructive' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.15 + i * 0.05 }}
            className="flex flex-col gap-3 p-4 sm:p-5 rounded-2xl bg-white border border-aprosoja-mint/20"
          >
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${stat.accent.split(' ')[0]}`}>
              <stat.icon size={15} className={stat.accent.split(' ')[1]} strokeWidth={2} />
            </div>
            <div>
              <span className="font-sans text-[28px] sm:text-[32px] font-bold text-aprosoja-teal leading-none block">
                {stat.value}
              </span>
              <span className="text-[10px] font-bold font-sans text-aprosoja-teal/40 uppercase tracking-widest">
                {stat.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Works list */}
      {works.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-bold font-sans text-aprosoja-teal/40 uppercase tracking-widest">
            Minhas obras
          </p>
          <div className="flex flex-col gap-2">
            {works.map((work, i) => {
              const cfg = STATUS_CONFIG[work.status];
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={work.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut', delay: 0.3 + i * 0.04 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white border border-aprosoja-mint/20 hover:border-aprosoja-mint/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-sans font-semibold text-aprosoja-teal truncate">
                      {work.title}
                    </p>
                    <p className="text-[11px] font-sans text-aprosoja-teal/40 mt-0.5">
                      {CATEGORY_LABELS[work.category] ?? work.category}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 h-[22px] px-2.5 rounded-full border text-[10px] font-bold font-sans uppercase tracking-wide whitespace-nowrap ${cfg.color}`}>
                    <Icon size={10} strokeWidth={2.5} />
                    {cfg.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {works.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-2 py-12 rounded-2xl bg-white border border-aprosoja-mint/20 border-dashed"
        >
          <FileCheck size={28} className="text-aprosoja-teal/20" strokeWidth={1.5} />
          <p className="text-[13px] font-sans text-aprosoja-teal/40">Nenhuma obra enviada ainda.</p>
        </motion.div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Admin overview
// ---------------------------------------------------------------------------

function AdminOverview() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="inline-flex items-center px-3 py-1 border border-aprosoja-mint rounded-full text-[10px] font-bold font-sans text-aprosoja-teal uppercase tracking-widest">
          Administrador
        </span>
        <h1 className="mt-3 font-heading-now text-[28px] sm:text-[32px] leading-tight text-aprosoja-teal">
          Visão Geral
        </h1>
        <p className="mt-1 text-[13px] font-sans text-aprosoja-teal/50">
          Acompanhe o estado geral do Prêmio Aprosoja MT de Jornalismo 2026.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ADMIN_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: i * 0.05 }}
            className="flex flex-col gap-2 p-4 sm:p-5 rounded-xl bg-white border border-aprosoja-mint/20"
          >
            <span className="text-[10px] font-bold font-sans text-aprosoja-teal/40 uppercase tracking-widest">
              {stat.label}
            </span>
            <span className="font-sans text-[30px] sm:text-[36px] font-bold text-aprosoja-teal leading-none">
              {stat.value}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Staff placeholder
// ---------------------------------------------------------------------------

function StaffPlaceholder({ role }: { role: Role }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-2 text-center">
      <p className="text-[14px] font-sans text-aprosoja-teal/50">
        Bem-vindo, <span className="font-semibold text-aprosoja-teal">{ROLE_LABELS[role]}</span>.
      </p>
      <p className="text-[13px] font-sans text-aprosoja-teal/40">
        Seu painel estará disponível em breve.
      </p>
    </div>
  );
}
