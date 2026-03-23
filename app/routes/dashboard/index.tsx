import type { LoaderFunctionArgs } from 'react-router';
import { Role } from '~/lib/roles';
import { withSession, getSubFromToken } from '~/lib/session';
import { UserRepository } from '~/repositories/UserRepository';
import { CandidateRepository } from '~/repositories/CandidateRepository';
import { PhaseControlRepository } from '~/repositories/PhaseControlRepository';
import prisma from '~/lib/prismaClient';
import { StorageGateway } from '~/gateways/StorageGateway';

export async function loader({ request }: LoaderFunctionArgs) {
  return withSession(request, async ({ role, accessToken }, headers) => {
    if (role === Role.ADMIN) {
      const [workCounts, candidateCount, phases] = await Promise.all([
        prisma.work.groupBy({ by: ['status'], _count: { _all: true } }),
        prisma.candidate.count(),
        new PhaseControlRepository().getAll(),
      ]);

      const countByStatus = Object.fromEntries(workCounts.map(r => [r.status, r._count._all]));

      return Response.json({
        role,
        stats: {
          candidates: candidateCount,
          submitted: countByStatus['SUBMITTED'] ?? 0,
          qualified: countByStatus['QUALIFIED'] ?? 0,
          disqualified: countByStatus['DISQUALIFIED'] ?? 0,
          finalist: countByStatus['FINALIST'] ?? 0,
          total: Object.values(countByStatus).reduce((a, b) => a + b, 0),
        },
        phases,
      }, { headers });
    }

    if (role !== Role.CANDIDATE) {
      return Response.json({ role }, { headers });
    }

    const externalId = getSubFromToken(accessToken);
    const userRepository = new UserRepository();
    const user = externalId ? await userRepository.findByExternalId(externalId) : null;

    if (!user) return Response.json({ role }, { headers });

    const candidateRepository = new CandidateRepository();
    const candidate = await candidateRepository.findByUserId(user.id);

    if (!candidate) return Response.json({ role }, { headers });

    const works = await prisma.work.findMany({
      where: { candidateId: candidate.id },
      select: { id: true, title: true, status: true, category: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    const storageGateway = new StorageGateway();
    const profilePhotoUrl = candidate.profilePhoto
      ? storageGateway.getFileUrl(candidate.profilePhoto)
      : null;

    return Response.json(
      {
        role,
        candidate: {
          name: candidate.name,
          category: candidate.category,
          wantsMaster: candidate.wantsMaster,
          emailConfirmedAt: candidate.emailConfirmedAt?.toISOString() ?? null,
          profilePhotoUrl,
        },
        works,
      },
      { headers },
    );
  });
}

export { DashboardPage as default } from '@/pages/dashboard/index';
