import type { Category, Region, WorkFormat } from '~/generated/prisma';
import type { WorkRepository } from '~/repositories/WorkRepository';

const WINDOW_START = new Date('2025-09-12T00:00:00.000Z');
const WINDOW_END = new Date('2026-08-07T23:59:59.999Z');

const MAX_WORKS_BASE = 2;

export class WorkLimitReached extends Error {
  constructor() { super('Limite de obras atingido.'); }
}

export class PublicationDateOutOfWindow extends Error {
  constructor() { super('Data de publicação fora da janela permitida.'); }
}

export class SubmitWorkUseCase {
  constructor(private readonly workRepository: WorkRepository) {}

  async execute(params: SubmitWorkUseCase.Input): Promise<void> {

    if (params.publishedAt < WINDOW_START || params.publishedAt > WINDOW_END) {
      throw new PublicationDateOutOfWindow();
    }

    const existing = await this.workRepository.findByCandidateId(params.candidateId);

    const mainWorks = existing.filter(w => !w.sourceWorkId && w.category === params.category);
    const destaquesWorks = existing.filter(w => w.region != null);

    const isDestaquesSubmission = params.region != null;

    if (isDestaquesSubmission) {
      if (destaquesWorks.length >= 1) {
        throw new WorkLimitReached();
      }
    } else {
      if (mainWorks.length >= MAX_WORKS_BASE) {
        throw new WorkLimitReached();
      }
    }

    await this.workRepository.create({
      candidateId: params.candidateId,
      title: params.title,
      category: params.category,
      publishedAt: params.publishedAt,
      description: params.description,
      workFormat: params.workFormat,
      mediaFile: params.mediaFile,
      mediaUrl: params.mediaUrl,
      isPrinted: params.isPrinted ?? false,
      region: params.region,
      sourceWorkId: params.sourceWorkId,
      declarationAuthor: true,
      declarationVehicle: true,
      declarationRules: true,
    });
  }
}

export namespace SubmitWorkUseCase {
  export type Input = {
    candidateId: string;
    title: string;
    category: Category;
    publishedAt: Date;
    description: string;
    workFormat?: WorkFormat;
    mediaFile?: string;
    mediaUrl?: string;
    isPrinted?: boolean;
    region?: Region;
    sourceWorkId?: string;
  };
}
