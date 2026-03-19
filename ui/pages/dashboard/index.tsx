import { motion } from 'framer-motion';
import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useLoaderData } from 'react-router';
import type { Role } from '~/generated/prisma';

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Administrador',
  CANDIDATE: 'Candidato',
  PHASE1_REVIEWER: 'Comissão de Habilitação',
  PHASE2_JUDGE: 'Comissão Técnica',
  PHASE3_JUDGE: 'Comissão Institucional',
};

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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F0F0ED] flex">
      <DesktopSidebar role={role} />

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <MobileSidebar role={role} open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0">
        <Topbar role={role} onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-5xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <PageContent role={role} />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function DesktopSidebar({ role }: { role: Role }) {
  return (
    <aside className="hidden lg:flex flex-col w-[220px] shrink-0 bg-aprosoja-teal min-h-screen sticky top-0 h-screen">
      <SidebarContent role={role} />
    </aside>
  );
}

function MobileSidebar({ role, open, onClose }: { role: Role; open: boolean; onClose: () => void }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-[220px] bg-aprosoja-teal flex flex-col lg:hidden transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        aria-label="Fechar menu"
      >
        <X size={18} />
      </button>
      <SidebarContent role={role} />
    </aside>
  );
}

function SidebarContent({ role }: { role: Role }) {
  return (
    <>
      <div className="px-5 pt-6 pb-5 border-b border-white/10">
        <img src="/assets/logo-aprosoja-branca.svg" alt="Aprosoja MT" className="h-9 w-auto" />
      </div>

      <nav className="flex-1 px-3 py-4">
        <p className="px-3 mb-2 text-[10px] font-bold font-sans text-white/30 uppercase tracking-widest">
          Menu
        </p>
        <ul className="flex flex-col gap-0.5">
          <li>
            <a
              href="/dashboard"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-sans font-medium text-white bg-white/10"
            >
              <LayoutDashboard size={15} strokeWidth={1.75} />
              Visão Geral
            </a>
          </li>
        </ul>
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <p className="px-3 mb-1 text-[10px] font-sans text-white/30 uppercase tracking-widest font-bold">
          {ROLE_LABELS[role]}
        </p>
        <form method="post" action="/auth/sign-out">
          <button
            type="submit"
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-[13px] font-sans font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut size={15} strokeWidth={1.75} />
            Sair
          </button>
        </form>
      </div>
    </>
  );
}

function Topbar({ role, onMenuClick }: { role: Role; onMenuClick: () => void }) {
  return (
    <header className="flex items-center gap-4 h-[56px] px-4 sm:px-6 lg:px-8 bg-[#F0F0ED] border-b border-aprosoja-mint/20 lg:border-none">
      <button
        onClick={onMenuClick}
        aria-label="Abrir menu"
        className="flex lg:hidden items-center justify-center w-8 h-8 rounded-lg text-aprosoja-teal hover:bg-aprosoja-teal/10 transition-colors"
      >
        <Menu size={19} strokeWidth={1.75} />
      </button>

      <div className="flex items-center gap-2 lg:hidden">
        <img src="/assets/logo-aprosoja.png" alt="Aprosoja MT" className="h-6 w-auto" />
      </div>

      <div className="ml-auto hidden lg:block">
        <span className="text-[12px] font-sans font-semibold text-aprosoja-teal/60 uppercase tracking-wide">
          {ROLE_LABELS[role]}
        </span>
      </div>
    </header>
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
