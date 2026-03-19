import { Category } from '~/generated/prisma';
import prisma from '~/lib/prismaClient';

export class CandidateRepository {
  async create(params: CandidateRepository.CreateParams) {
    return prisma.candidate.create({ data: params });
  }
}

export namespace CandidateRepository {
  export type CreateParams = {
    userId: string;
    name: string;
    socialName?: string;
    cpf: string;
    phone: string;
    state: string;
    city: string;
    category: Category;
    drtFile?: string;
    enrollmentFile?: string;
    wantsMaster: boolean;
    passport?: string;
    visaExpiry?: Date;
  };
}
