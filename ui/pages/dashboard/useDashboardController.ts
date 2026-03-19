import { LayoutDashboard, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { useLoaderData } from 'react-router';
import type { Role } from '~/generated/prisma';

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
}

const NAV_ITEMS: Record<Role, NavItem[]> = {
  ADMIN: [{ label: 'Visão Geral', href: '/dashboard', icon: LayoutDashboard }],
  CANDIDATE: [],
  PHASE1_REVIEWER: [],
  PHASE2_JUDGE: [],
  PHASE3_JUDGE: [],
};

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Administrador',
  CANDIDATE: 'Candidato',
  PHASE1_REVIEWER: 'Comissão de Habilitação',
  PHASE2_JUDGE: 'Comissão Técnica',
  PHASE3_JUDGE: 'Comissão Institucional',
};

export const OVERVIEW_STATS = [
  { label: 'Inscrições', value: '—' },
  { label: 'Obras enviadas', value: '—' },
  { label: 'Em avaliação', value: '—' },
  { label: 'Habilitadas', value: '—' },
  { label: 'Finalistas', value: '—' },
  { label: 'Inabilitadas', value: '—' },
];

export function useDashboardController() {
  const { role } = useLoaderData<{ role: Role }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return {
    role,
    navItems: NAV_ITEMS[role] ?? [],
    sidebarOpen,
    setSidebarOpen,
  };
}
