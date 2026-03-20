import { Category } from '~/generated/prisma';
import prisma from '~/lib/prismaClient';

export class CandidateRepository {
  async create(params: CandidateRepository.CreateParams) {
    return prisma.candidate.create({ data: params });
  }

  async findByVerificationToken(token: string) {
    return prisma.candidate.findUnique({ where: { emailVerificationToken: token } });
  }

  async confirmEmail(id: string) {
    return prisma.candidate.update({
      where: { id },
      data: { emailConfirmedAt: new Date(), emailVerificationToken: null },
    });
  }

  async findByUserId(userId: string) {
    return prisma.candidate.findUnique({ where: { userId } });
  }

  async updateProfilePhoto(id: string, profilePhoto: string | null) {
    return prisma.candidate.update({ where: { id }, data: { profilePhoto } });
  }

  async updateCategory(id: string, params: CandidateRepository.UpdateCategoryParams) {
    return prisma.candidate.update({ where: { id }, data: params });
  }
}

export namespace CandidateRepository {
  export type UpdateCategoryParams = {
    category: Category;
    drtFile?: string | null;
    enrollmentFile?: string | null;
  };

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
    emailVerificationToken: string;
  };
}
