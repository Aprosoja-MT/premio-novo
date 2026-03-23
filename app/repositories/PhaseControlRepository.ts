import prisma from '~/lib/prismaClient';

export class PhaseControlRepository {
  async getAll() {
    const rows = await prisma.phaseControl.findMany({ orderBy: { phase: 'asc' } });
    return [1, 2, 3].map(phase => {
      const row = rows.find(r => r.phase === phase);
      return {
        phase,
        startedAt: row?.startedAt ?? null,
        finishedAt: row?.finishedAt ?? null,
        startedBy: row?.startedBy ?? null,
        finishedBy: row?.finishedBy ?? null,
      };
    });
  }

  async start(phase: number, adminEmail: string) {
    return prisma.phaseControl.upsert({
      where: { phase },
      create: { phase, startedAt: new Date(), startedBy: adminEmail, finishedAt: null, finishedBy: null },
      update: { startedAt: new Date(), startedBy: adminEmail, finishedAt: null, finishedBy: null },
    });
  }

  async finish(phase: number, adminEmail: string) {
    return prisma.phaseControl.update({
      where: { phase },
      data: { finishedAt: new Date(), finishedBy: adminEmail },
    });
  }

  async isOpen(phase: number): Promise<boolean> {
    const row = await prisma.phaseControl.findUnique({ where: { phase } });
    if (!row?.startedAt) { return false; }
    if (row.finishedAt) { return false; }
    return true;
  }
}
