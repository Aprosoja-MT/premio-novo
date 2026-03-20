import type { Category } from '~/generated/prisma';
import prisma from '~/lib/prismaClient';

const PAGE_SIZE = 20;

export class Phase3ScoreRepository {
  async listForScoring(params: Phase3ScoreRepository.ListParams, judgeId: string) {
    const { page = 1, category, scored } = params;

    const where: {
      status: 'FINALIST';
      category?: Category;
      phase3Scores?: { some: { judgeId: string } } | { none: { judgeId: string } };
    } = { status: 'FINALIST' };
    if (category) { where.category = category; }
    if (scored === true) { where.phase3Scores = { some: { judgeId } }; }
    if (scored === false) { where.phase3Scores = { none: { judgeId } }; }

    const [works, total] = await Promise.all([
      prisma.work.findMany({
        where,
        orderBy: { createdAt: 'asc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: {
          id: true,
          title: true,
          category: true,
          publishedAt: true,
          description: true,
          status: true,
          mediaFile: true,
          mediaUrl: true,
          isPrinted: true,
          workFormat: true,
          region: true,
          createdAt: true,
          candidate: {
            select: {
              name: true,
              state: true,
              city: true,
              profilePhoto: true,
            },
          },
          phase3Scores: {
            where: { judgeId },
            select: {
              id: true,
              publicImpact: true,
              technicalAlignment: true,
              informationClarity: true,
              chainContribution: true,
              updatedAt: true,
            },
          },
        },
      }),
      prisma.work.count({ where }),
    ]);

    return { works, total, pageSize: PAGE_SIZE };
  }

  async upsert(params: Phase3ScoreRepository.UpsertParams) {
    const { workId, judgeId, scores } = params;
    return prisma.phase3Score.upsert({
      where: { workId_judgeId: { workId, judgeId } },
      create: { workId, judgeId, ...scores },
      update: { ...scores },
    });
  }

  async getRanking() {
    const finalistWorks = await prisma.work.findMany({
      where: { status: 'FINALIST' },
      select: {
        id: true,
        title: true,
        category: true,
        region: true,
        candidate: { select: { name: true, state: true, city: true, profilePhoto: true } },
        phase3Scores: {
          select: {
            publicImpact: true,
            technicalAlignment: true,
            informationClarity: true,
            chainContribution: true,
          },
        },
      },
    });

    const withScore = finalistWorks.map(w => ({
      ...w,
      totalScore: w.phase3Scores.reduce(
        (sum, s) => sum + s.publicImpact + s.technicalAlignment + s.informationClarity + s.chainContribution,
        0,
      ),
    }));

    const byCategory: Record<string, typeof withScore> = {};
    for (const w of withScore) {
      const key = w.category === 'DESTAQUES_MT' && w.region ? w.region : w.category;
      if (!byCategory[key]) { byCategory[key] = []; }
      byCategory[key].push(w);
    }

    for (const works of Object.values(byCategory)) {
      works.sort((a, b) => b.totalScore - a.totalScore);
      works.forEach((w, i) => Object.assign(w, { rank: i + 1 }));
    }

    return byCategory as Record<string, (typeof withScore[0] & { rank: number })[]>;
  }
}

export namespace Phase3ScoreRepository {
  export type Scores = {
    publicImpact: number;
    technicalAlignment: number;
    informationClarity: number;
    chainContribution: number;
  };

  export type ListParams = {
    page?: number;
    category?: Category;
    scored?: boolean;
  };

  export type UpsertParams = {
    workId: string;
    judgeId: string;
    scores: Scores;
  };
}
