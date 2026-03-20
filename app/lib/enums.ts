import type { Category, Region, WorkFormat, WorkStatus } from '~/generated/prisma';

export const CATEGORIES = [
  { value: 'VIDEO' as Category, label: 'Reportagem em Vídeo' },
  { value: 'TEXT' as Category, label: 'Reportagem em Texto' },
  { value: 'AUDIO' as Category, label: 'Reportagem em Áudio' },
  { value: 'PHOTO' as Category, label: 'Fotojornalismo' },
  { value: 'UNIVERSITY' as Category, label: 'Jornalismo Universitário' },
] as const;

export const CATEGORY_VALUES = CATEGORIES.map(c => c.value);

export const CATEGORY_LABELS: Record<string, string> = {
  VIDEO: 'Reportagem em Vídeo',
  TEXT: 'Reportagem em Texto',
  AUDIO: 'Reportagem em Áudio',
  PHOTO: 'Fotojornalismo',
  UNIVERSITY: 'Jornalismo Universitário',
  DESTAQUES_MT: 'Destaques MT',
};

export const REGIONS = [
  { value: 'NORTE' as Region, label: 'Norte' },
  { value: 'SUL' as Region, label: 'Sul' },
  { value: 'LESTE' as Region, label: 'Leste' },
  { value: 'OESTE' as Region, label: 'Oeste' },
  { value: 'BAIXADA_CUIABANA' as Region, label: 'Baixada Cuiabana' },
] as const;

export const REGION_VALUES = REGIONS.map(r => r.value);

export const REGION_LABELS: Record<Region, string> = Object.fromEntries(
  REGIONS.map(r => [r.value, r.label]),
) as Record<Region, string>;

export const WORK_STATUSES = ['SUBMITTED', 'QUALIFIED', 'DISQUALIFIED', 'FINALIST'] as const satisfies WorkStatus[];

export const WORK_FORMATS = [
  { value: 'VIDEO' as WorkFormat, label: 'Reportagem em Vídeo' },
  { value: 'TEXT' as WorkFormat, label: 'Reportagem em Texto' },
  { value: 'AUDIO' as WorkFormat, label: 'Reportagem em Áudio' },
  { value: 'PHOTO' as WorkFormat, label: 'Fotojornalismo' },
] as const;

export const WORK_FORMAT_VALUES = WORK_FORMATS.map(f => f.value);
