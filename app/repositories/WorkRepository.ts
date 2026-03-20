import type { Category, Region, WorkFormat } from '~/generated/prisma';
import prisma from '~/lib/prismaClient';

export class WorkRepository {
  async findByCandidateId(candidateId: string) {
    return prisma.work.findMany({
      where: { candidateId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(params: WorkRepository.CreateParams) {
    return prisma.work.create({ data: params });
  }

  async findDestaquesSourceWork(sourceWorkId: string) {
    return prisma.work.findUnique({ where: { id: sourceWorkId } });
  }

  async delete(id: string, candidateId: string) {
    return prisma.work.delete({ where: { id, candidateId } });
  }

  async findById(id: string) {
    return prisma.work.findUnique({ where: { id } });
  }
}

export namespace WorkRepository {
  export type CreateParams = {
    candidateId: string;
    title: string;
    category: Category;
    publishedAt: Date;
    description: string;
    mediaFile?: string;
    mediaUrl?: string;
    isPrinted?: boolean;
    workFormat?: WorkFormat;
    region?: Region;
    sourceWorkId?: string;
    declarationAuthor: boolean;
    declarationVehicle: boolean;
    declarationRules: boolean;
  };
}
