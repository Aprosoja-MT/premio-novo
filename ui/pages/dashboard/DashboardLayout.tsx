import { FileText, LayoutDashboard, LogOut, Menu, UserCircle, Users, X } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router';
import { Role } from '~/lib/roles';

export { Role };

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Administrador',
  CANDIDATE: 'Candidato',
  PHASE1_REVIEWER: 'Comissão de Habilitação',
  PHASE2_JUDGE: 'Comissão Técnica',
  PHASE3_JUDGE: 'Comissão Institucional',
};

export function DashboardLayout({ role, children }: { role: Role; children: React.ReactNode }) {
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
          {children}
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
  const { pathname } = useLocation();

  function navClass(href: string) {
    const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
    return `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-sans font-medium transition-colors ${
      active ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'
    }`;
  }

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
            <a href="/dashboard" className={navClass('/dashboard')}>
              <LayoutDashboard size={15} strokeWidth={1.75} />
              Visão Geral
            </a>
          </li>
          {role === 'CANDIDATE' && (
            <li>
              <a href="/dashboard/works" className={navClass('/dashboard/works')}>
                <FileText size={15} strokeWidth={1.75} />
                Obras
              </a>
            </li>
          )}
          {role === 'CANDIDATE' && (
            <li>
              <a href="/dashboard/profile" className={navClass('/dashboard/profile')}>
                <UserCircle size={15} strokeWidth={1.75} />
                Meu Perfil
              </a>
            </li>
          )}
          {(role === 'PHASE1_REVIEWER' || role === 'ADMIN') && (
            <li>
              <a href="/dashboard/phase1/works" className={navClass('/dashboard/phase1/works')}>
                <FileText size={15} strokeWidth={1.75} />
                Habilitação
              </a>
            </li>
          )}
          {(role === 'PHASE2_JUDGE' || role === 'ADMIN') && (
            <li>
              <a href="/dashboard/phase2/works" className={navClass('/dashboard/phase2/works')}>
                <FileText size={15} strokeWidth={1.75} />
                Avaliação Técnica
              </a>
            </li>
          )}
          {role === 'ADMIN' && (
            <li>
              <a href="/dashboard/admin/users" className={navClass('/dashboard/admin/users')}>
                <Users size={15} strokeWidth={1.75} />
                Usuários
              </a>
            </li>
          )}
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
