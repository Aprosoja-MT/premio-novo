import { motion } from 'framer-motion';
import { MapPin, Trophy, User } from 'lucide-react';
import { useState } from 'react';
import { useLoaderData } from 'react-router';
import { CATEGORIES, CATEGORY_LABELS, REGION_LABELS } from '~/lib/enums';
import type { Role } from '~/lib/roles';
import { DashboardLayout } from '../DashboardLayout';

const SELECT_CLASS = 'h-[34px] rounded-[30px] border-[1.5px] border-aprosoja-mint bg-white px-3 pr-8 text-[12px] font-sans text-aprosoja-teal focus:outline-none focus:border-aprosoja-teal appearance-none';
const CHEVRON_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23024240' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`;

const CATEGORY_FILTER_OPTIONS = [
  { value: '', label: 'Todas as categorias' },
  ...CATEGORIES.map(c => ({ value: c.value, label: c.label })),
];

type RankRow = {
  rank: number;
  id: string;
  title: string;
  category: string;
  region: string | null;
  totalScore: number;
  candidate: {
    name: string;
    state: string;
    city: string;
    profilePhotoUrl: string | null;
  };
};

type RankGroup = {
  key: string;
  works: RankRow[];
};

function groupLabel(key: string) {
  if (REGION_LABELS[key as keyof typeof REGION_LABELS]) {
    return `Destaques MT — ${REGION_LABELS[key as keyof typeof REGION_LABELS]}`;
  }
  return CATEGORY_LABELS[key] ?? key;
}

export function AdminRankingPage() {
  const { role, groups } = useLoaderData<{ role: Role; groups: RankGroup[] }>();
  const [categoryFilter, setCategoryFilter] = useState('');
  const total = groups.reduce((sum, g) => sum + g.works.length, 0);
  const filteredGroups = categoryFilter
    ? groups.filter(g => g.works.some(w => w.category === categoryFilter))
    : groups;

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className="inline-flex items-center px-3 py-1 border border-aprosoja-mint rounded-full text-[10px] font-bold font-sans text-aprosoja-teal uppercase tracking-widest">
              Administração
            </span>
            <h1 className="mt-3 font-heading-now text-[28px] sm:text-[32px] leading-tight text-aprosoja-teal">
              Ranking Final
            </h1>
            <p className="mt-1 text-[13px] font-sans text-aprosoja-teal/50">
              {total} obra{total !== 1 ? 's' : ''} finalista{total !== 1 ? 's' : ''} — ordenadas por pontuação da Fase 3
            </p>
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className={SELECT_CLASS}
            style={{ backgroundImage: CHEVRON_BG, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
          >
            {CATEGORY_FILTER_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {filteredGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-aprosoja-teal/40">
            <Trophy size={32} strokeWidth={1.5} />
            <p className="text-[13px] font-sans">Nenhuma obra finalista ainda.</p>
          </div>
        ) : (
          filteredGroups.map(group => (
            <div key={group.key} className="flex flex-col gap-3">
              <h2 className="text-[13px] font-bold font-sans text-aprosoja-teal uppercase tracking-widest border-b border-aprosoja-mint/30 pb-2">
                {groupLabel(group.key)}
              </h2>
              <div className="flex flex-col gap-2">
                {group.works.map((work, i) => (
                  <motion.div
                    key={work.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut', delay: i * 0.02 }}
                  >
                    <RankCard work={work} />
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}

function RankCard({ work }: { work: RankRow }) {
  const categoryLabel = CATEGORY_LABELS[work.category] ?? work.category;
  const regionLabel = work.region ? (REGION_LABELS[work.region as keyof typeof REGION_LABELS] ?? work.region) : null;

  const rankColor = work.rank === 1
    ? 'text-amber-500 bg-amber-50 border-amber-200'
    : work.rank === 2
      ? 'text-slate-500 bg-slate-50 border-slate-200'
      : work.rank === 3
        ? 'text-orange-600 bg-orange-50 border-orange-200'
        : 'text-aprosoja-teal/50 bg-aprosoja-mint/5 border-aprosoja-mint/20';

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-aprosoja-mint/20">
      <div className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 text-[13px] font-bold font-sans ${rankColor}`}>
        {work.rank <= 3 ? <Trophy size={15} strokeWidth={2} /> : work.rank}
      </div>

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
          {regionLabel && (
            <>
              <span className="text-aprosoja-teal/20">·</span>
              <span className="text-[11px] font-sans text-aprosoja-teal/50 flex items-center gap-0.5">
                <MapPin size={9} strokeWidth={2} />
                {regionLabel}
              </span>
            </>
          )}
          <span className="text-aprosoja-teal/20">·</span>
          <span className="text-[11px] font-sans text-aprosoja-teal/50">{work.candidate.city}, {work.candidate.state}</span>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-[18px] font-sans font-bold text-aprosoja-teal">{work.totalScore}</p>
        <p className="text-[10px] font-sans text-aprosoja-teal/40 uppercase tracking-wide">pts</p>
      </div>
    </div>
  );
}
