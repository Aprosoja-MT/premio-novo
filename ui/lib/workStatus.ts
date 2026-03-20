import { CheckCircle2, Clock, Star, XCircle } from 'lucide-react';

export const WORK_STATUS_CONFIG = {
  SUBMITTED: { label: 'Em avaliação', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Clock },
  QUALIFIED: { label: 'Habilitada', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
  DISQUALIFIED: { label: 'Inabilitada', color: 'text-destructive bg-destructive/5 border-destructive/20', icon: XCircle },
  FINALIST: { label: 'Finalista', color: 'text-amber-500 bg-amber-50 border-amber-200', icon: Star },
} as const;
