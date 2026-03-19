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
}

export namespace UserRepository {
  export type CreateParams = {
    externalId: string;
    email: string;
    role?: Role;
  };
}
