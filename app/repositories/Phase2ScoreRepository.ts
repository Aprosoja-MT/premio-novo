import type { Category } from '~/generated/prisma';
import prisma from '~/lib/prismaClient';

const PAGE_SIZE = 20;

export class Phase2ScoreRepository {
  async listForScoring(params: Phase2ScoreRepository.ListParams, judgeId: string) {
    const { page = 1, category, scored } = params;

    const where: {
      status: 'QUALIFIED';
      category?: Category;
      phase2Scores?: { some: { judgeId: string } } | { none: { judgeId: string } };
    } = { status: 'QUALIFIED' };
    if (category) { where.category = category; }
    if (scored === true) { where.phase2Scores = { some: { judgeId } }; }
    if (scored === false) { where.phase2Scores = { none: { judgeId } }; }

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
          phase2Scores: {
            where: { judgeId },
            select: {
              id: true,
              thematicRelevance: true,
              newsContent: true,
              textQuality: true,
              narrativeQuality: true,
              aestheticQuality: true,
              photoRelevance: true,
              publicBenefit: true,
              sources: true,
              originality: true,
              updatedAt: true,
            },
          },
        },
      }),
      prisma.work.count({ where }),
    ]);

    return { works, total, pageSize: PAGE_SIZE };
  }

  async upsert(params: Phase2ScoreRepository.UpsertParams) {
    const { workId, judgeId, scores } = params;
    return prisma.phase2Score.upsert({
      where: { workId_judgeId: { workId, judgeId } },
      create: { workId, judgeId, ...scores },
      update: { ...scores },
    });
  }

  async markFinalists() {
    const qualifiedWorks = await prisma.work.findMany({
      where: { status: 'QUALIFIED' },
      select: {
        id: true,
        category: true,
        region: true,
        phase2Scores: {
          select: {
            thematicRelevance: true,
            newsContent: true,
            publicBenefit: true,
            originality: true,
          },
        },
      },
    });

    function totalScore(scores: { thematicRelevance: number; newsContent: number; publicBenefit: number; originality: number }[]) {
      return scores.reduce((sum, s) => sum + s.thematicRelevance + s.newsContent + s.publicBenefit + s.originality, 0);
    }

    function tieBreakers(scores: { thematicRelevance: number; newsContent: number; publicBenefit: number; originality: number }[]) {
      return [
        scores.reduce((s, r) => s + r.thematicRelevance, 0),
        scores.reduce((s, r) => s + r.newsContent, 0),
        scores.reduce((s, r) => s + r.publicBenefit, 0),
        scores.reduce((s, r) => s + r.originality, 0),
      ];
    }

    function compareWorks(
      a: { phase2Scores: Parameters<typeof totalScore>[0] },
      b: { phase2Scores: Parameters<typeof totalScore>[0] },
    ) {
      const diff = totalScore(b.phase2Scores) - totalScore(a.phase2Scores);
      if (diff !== 0) { return diff; }
      const ta = tieBreakers(a.phase2Scores);
      const tb = tieBreakers(b.phase2Scores);
      for (let i = 0; i < ta.length; i++) {
        if (tb[i] !== ta[i]) { return tb[i] - ta[i]; }
      }
      return 0;
    }

    const byCategory: Record<string, typeof qualifiedWorks> = {};
    const byRegion: Record<string, typeof qualifiedWorks> = {};

    for (const w of qualifiedWorks) {
      if (!byCategory[w.category]) { byCategory[w.category] = []; }
      byCategory[w.category].push(w);
      if (w.region) {
        if (!byRegion[w.region]) { byRegion[w.region] = []; }
        byRegion[w.region].push(w);
      }
    }

    const finalistIds = new Set<string>();

    for (const works of Object.values(byCategory)) {
      works.sort(compareWorks);
      works.slice(0, 10).forEach(w => finalistIds.add(w.id));
    }

    for (const works of Object.values(byRegion)) {
      works.sort(compareWorks);
      works.slice(0, 5).forEach(w => finalistIds.add(w.id));
    }

    await prisma.$transaction([
      prisma.work.updateMany({
        where: { status: 'QUALIFIED', id: { notIn: [...finalistIds] } },
        data: { status: 'QUALIFIED' },
      }),
      prisma.work.updateMany({
        where: { id: { in: [...finalistIds] } },
        data: { status: 'FINALIST' },
      }),
    ]);

    return { finalistCount: finalistIds.size };
  }
}

export namespace Phase2ScoreRepository {
  export type Scores = {
    thematicRelevance: number;
    newsContent: number;
    textQuality: number;
    narrativeQuality: number;
    aestheticQuality: number;
    photoRelevance: number;
    publicBenefit: number;
    sources: number;
    originality: number;
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
