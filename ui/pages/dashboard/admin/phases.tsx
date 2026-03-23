import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, CircleDashed, Clock, Loader2, Lock, Play } from 'lucide-react';
import { Button } from '~/components/ui/Button';
import { DashboardLayout } from '../DashboardLayout';
import { PHASE_LABELS, type PhaseRow, useAdminPhasesController } from './useAdminPhasesController';

function PhaseStatus({ phase }: { phase: PhaseRow }) {
  if (phase.finishedAt) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-sans font-semibold text-emerald-600">
        <CheckCircle2 size={13} />
        Finalizada
      </span>
    );
  }
  if (phase.startedAt) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-sans font-semibold text-amber-600">
        <Clock size={13} />
        Em andamento
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-sans font-semibold text-muted-foreground">
      <CircleDashed size={13} />
      Não iniciada
    </span>
  );
}

function formatDate(iso: string | null) {
  if (!iso) { return '—'; }
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AdminPhasesPage() {
  const { role, phases, isSubmitting, serverError, startPhase, finishPhase } = useAdminPhasesController();

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-8">
        <div>
          <span className="inline-flex items-center px-3 py-1 border border-aprosoja-mint rounded-full text-[10px] font-bold font-sans text-aprosoja-teal uppercase tracking-widest">
            Administração
          </span>
          <h1 className="mt-3 font-heading-now text-[28px] sm:text-[32px] leading-tight text-aprosoja-teal">
            Controle de Fases
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground font-sans">
            Gerencie o ciclo de vida de cada fase do prêmio.
          </p>
        </div>

        <AnimatePresence>
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-[13px] text-destructive font-sans"
            >
              {serverError}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-4">
          {phases.map((phase, i) => {
            const isOpen = !!phase.startedAt && !phase.finishedAt;
            const notStarted = !phase.startedAt;
            const finished = !!phase.finishedAt;

            return (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-border bg-white p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-aprosoja-mint/30 text-aprosoja-teal font-bold font-sans text-[13px]">
                      {phase.phase}
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold font-sans text-aprosoja-teal leading-tight">
                        {PHASE_LABELS[phase.phase]}
                      </p>
                      <PhaseStatus phase={phase} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 pl-11">
                    <div>
                      <p className="text-[10px] font-sans font-bold text-aprosoja-teal/50 uppercase tracking-wider">Iniciada em</p>
                      <p className="text-[12px] font-sans font-medium text-aprosoja-teal">{formatDate(phase.startedAt)}</p>
                      {phase.startedBy && (
                        <p className="text-[11px] font-sans text-aprosoja-teal/60">{phase.startedBy}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-sans font-bold text-aprosoja-teal/50 uppercase tracking-wider">Finalizada em</p>
                      <p className="text-[12px] font-sans font-medium text-aprosoja-teal">{formatDate(phase.finishedAt)}</p>
                      {phase.finishedBy && (
                        <p className="text-[11px] font-sans text-aprosoja-teal/60">{phase.finishedBy}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 sm:flex-col sm:items-end">
                  {notStarted && (
                    <Button
                      size="sm"
                      onClick={() => startPhase(phase.phase)}
                      disabled={isSubmitting}
                      className="gap-1.5"
                    >
                      {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
                      Iniciar fase
                    </Button>
                  )}
                  {isOpen && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => finishPhase(phase.phase)}
                      disabled={isSubmitting}
                      className="gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/5"
                    >
                      {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Lock size={13} />}
                      Finalizar fase
                    </Button>
                  )}
                  {finished && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startPhase(phase.phase)}
                      disabled={isSubmitting}
                      className="gap-1.5 border-aprosoja-teal/30 text-aprosoja-teal hover:bg-aprosoja-teal/5"
                    >
                      {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
                      Reabrir fase
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
