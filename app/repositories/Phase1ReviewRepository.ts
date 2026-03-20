import type { Category, WorkStatus } from '~/generated/prisma';
import prisma from '~/lib/prismaClient';

const PAGE_SIZE = 20;

export class Phase1ReviewRepository {
  async listForReview(params: Phase1ReviewRepository.ListParams) {
    const { page = 1, status, category } = params;

    const where: {
      status?: WorkStatus | { in: WorkStatus[] };
      category?: Category;
    } = { status: { in: ['SUBMITTED', 'QUALIFIED', 'DISQUALIFIED'] } };
    if (status) { where.status = status; }
    if (category) { where.category = category; }

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
          phase1Review: {
            select: {
              id: true,
              qualified: true,
              justification: true,
              updatedAt: true,
              reviewer: { select: { email: true } },
            },
          },
        },
      }),
      prisma.work.count({ where }),
    ]);

    return { works, total, pageSize: PAGE_SIZE };
  }

  async upsert(params: Phase1ReviewRepository.UpsertParams) {
    return prisma.phase1Review.upsert({
      where: { workId: params.workId },
      create: {
        workId: params.workId,
        reviewerId: params.reviewerId,
        qualified: params.qualified,
        justification: params.justification ?? null,
      },
      update: {
        reviewerId: params.reviewerId,
        qualified: params.qualified,
        justification: params.justification ?? null,
      },
    });
  }

  async updateWorkStatus(workId: string, qualified: boolean) {
    return prisma.work.update({
      where: { id: workId, status: { in: ['SUBMITTED', 'QUALIFIED', 'DISQUALIFIED'] } },
      data: { status: qualified ? 'QUALIFIED' : 'DISQUALIFIED' },
    });
  }
}

export namespace Phase1ReviewRepository {
  export type ListParams = {
    page?: number;
    status?: 'SUBMITTED' | 'QUALIFIED' | 'DISQUALIFIED';
    category?: Category;
  };

  export type UpsertParams = {
    workId: string;
    reviewerId: string;
    qualified: boolean;
    justification?: string;
  };
}
