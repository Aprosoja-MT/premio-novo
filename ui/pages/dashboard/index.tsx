import { motion } from 'framer-motion';
import { useLoaderData } from 'react-router';
import { DashboardLayout, ROLE_LABELS, type Role } from './DashboardLayout';

const OVERVIEW_STATS = [
  { label: 'Inscrições', value: '—' },
  { label: 'Obras enviadas', value: '—' },
  { label: 'Em avaliação', value: '—' },
  { label: 'Habilitadas', value: '—' },
  { label: 'Finalistas', value: '—' },
  { label: 'Inabilitadas', value: '—' },
];

export function DashboardPage() {
  const { role } = useLoaderData<{ role: Role }>();

  return (
    <DashboardLayout role={role}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <PageContent role={role} />
      </motion.div>
    </DashboardLayout>
  );
}

function PageContent({ role }: { role: Role }) {
  if (role === 'ADMIN') return <AdminOverview />;

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
        {OVERVIEW_STATS.map((stat, i) => (
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
            <span className="font-heading-now text-[30px] sm:text-[36px] text-aprosoja-teal leading-none">
              {stat.value}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
