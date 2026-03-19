import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet';
import type { Role } from '~/generated/prisma';
import {
  OVERVIEW_STATS,
  ROLE_LABELS,
  useDashboardController,
  type NavItem,
} from './useDashboardController';

export function DashboardPage() {
  const { role, navItems, sidebarOpen, setSidebarOpen } = useDashboardController();

  return (
    <div className="min-h-screen bg-[#F0F0ED]">
      <Topbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} navItems={navItems} />

      <main className="pt-[64px] px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <PageContent role={role} />
        </motion.div>
      </main>
    </div>
  );
}

function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header
      className="fixed top-0 inset-x-0 z-40 h-[64px] flex items-center px-4 sm:px-6 lg:px-8"
      style={{
        backdropFilter: 'blur(4.5px)',
        backgroundColor: 'rgba(255,255,255,0.82)',
        borderBottom: '1px solid rgba(148,210,185,0.25)',
      }}
    >
      <div className="w-full max-w-[1280px] mx-auto flex items-center gap-4">
        <button
          onClick={onMenuClick}
          aria-label="Abrir menu"
          className="flex items-center justify-center w-[38px] h-[38px] rounded-[10px] text-[#024240] hover:bg-[#94d2b9]/15 transition-colors"
        >
          <Menu size={20} strokeWidth={1.75} />
        </button>

        <a href="/" className="shrink-0">
          <img src="/assets/logo-aprosoja.png" alt="Aprosoja MT" className="h-[30px] w-auto" />
        </a>

        <div className="ml-auto">
          <form method="post" action="/auth/sign-out">
            <button
              type="submit"
              className="h-[30px] px-4 border-[1.5px] border-[#94d2b9] rounded-[30px] text-[10px] font-bold font-sans text-[#024240] uppercase tracking-wide hover:bg-[#94d2b9]/10 transition-colors"
            >
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

function Sidebar({
  open,
  onOpenChange,
  navItems,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  navItems: NavItem[];
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[260px] sm:max-w-[260px] bg-[#024240] border-r-0 p-0 gap-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-white/10">
          <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
          <img src="/assets/logo-aprosoja-branca.svg" alt="Aprosoja MT" className="h-[44px] w-auto" />
        </SheetHeader>

        <nav className="flex-1 px-3 py-4">
          {navItems.length === 0 ? (
            <p className="px-3 text-[12px] font-sans text-white/30 uppercase tracking-wide">
              Sem itens disponíveis
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] font-sans font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <item.icon size={16} strokeWidth={1.75} />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </nav>

        <div className="px-6 py-5 border-t border-white/10">
          <p className="text-[11px] font-sans text-white/25">© 2026 Aprosoja MT</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function PageContent({ role }: { role: Role }) {
  if (role === 'ADMIN') {
    return <AdminOverview />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
      <p className="text-[14px] font-sans text-[#024240]/50">
        Bem-vindo, <span className="font-semibold text-[#024240]">{ROLE_LABELS[role]}</span>.
      </p>
      <p className="text-[13px] font-sans text-[#024240]/40">
        Seu painel estará disponível em breve.
      </p>
    </div>
  );
}

function AdminOverview() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="inline-flex items-center px-3 py-1.5 border-[1.5px] border-[#94d2b9] rounded-[30px] text-[10px] font-bold font-sans text-[#024240] uppercase tracking-wide whitespace-nowrap">
          ADMINISTRADOR
        </span>
        <h1 className="mt-3 font-heading-now text-[28px] sm:text-[34px] leading-[1.1] text-[#024240]">
          Visão Geral
        </h1>
        <p className="mt-1 text-[13px] font-sans text-[#024240]/50">
          Acompanhe o estado geral do Prêmio Aprosoja MT de Jornalismo 2026.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {OVERVIEW_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: i * 0.06 }}
            className="flex flex-col gap-1 p-5 rounded-[16px] bg-white border border-[#94d2b9]/30"
          >
            <span className="text-[11px] font-bold font-sans text-[#024240]/50 uppercase tracking-wide">
              {stat.label}
            </span>
            <span className="font-heading-now text-[32px] text-[#024240] leading-none">
              {stat.value}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
