import { Role } from '~/generated/prisma';
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
}
