export const Role = {
  CANDIDATE: 'CANDIDATE',
  PHASE1_REVIEWER: 'PHASE1_REVIEWER',
  PHASE2_JUDGE: 'PHASE2_JUDGE',
  PHASE3_JUDGE: 'PHASE3_JUDGE',
  ADMIN: 'ADMIN',
} as const;

export type Role = (typeof Role)[keyof typeof Role];
