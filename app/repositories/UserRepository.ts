import { Category, Role } from '~/generated/prisma';
import prisma from '~/lib/prismaClient';

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByExternalId(externalId: string) {
    return prisma.user.findUnique({ where: { externalId } });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async create({ externalId, email, role = Role.CANDIDATE }: UserRepository.CreateParams) {
    return prisma.user.create({ data: { externalId, email, role } });
  }

  async createWithCandidate(
    userParams: UserRepository.CreateParams,
    candidateParams: Omit<UserRepository.CandidateCreateParams, 'userId'>,
  ) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { externalId: userParams.externalId, email: userParams.email, role: Role.CANDIDATE },
      });
      const candidate = await tx.candidate.create({
        data: { userId: user.id, ...candidateParams },
      });
      return { user, candidate };
    });
  }

  async listWithStats(filters: UserRepository.ListFilters = {}) {
    const where: {
      role?: Role;
      candidate?: { wantsMaster: boolean };
    } = {};
    if (filters.role) { where.role = filters.role; }
    if (filters.wantsMaster !== undefined) {
      where.candidate = { wantsMaster: filters.wantsMaster };
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        candidate: {
          select: {
            name: true,
            category: true,
            state: true,
            wantsMaster: true,
            emailConfirmedAt: true,
            _count: { select: { works: true } },
          },
        },
      },
    });

    return users;
  }

  async updateRole(id: string, role: Role) {
    return prisma.user.update({ where: { id }, data: { role } });
  }
}

export namespace UserRepository {
  export type CreateParams = {
    externalId: string;
    email: string;
    role?: Role;
  };

  export type ListFilters = {
    role?: Role;
    wantsMaster?: boolean;
  };

  export type CandidateCreateParams = {
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
