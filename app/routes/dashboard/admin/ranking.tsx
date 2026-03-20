import { redirect, type LoaderFunctionArgs } from 'react-router';
import { StorageGateway } from '~/gateways/StorageGateway';
import { Role } from '~/lib/roles';
import { withSession } from '~/lib/session';
import { Phase3ScoreRepository } from '~/repositories/Phase3ScoreRepository';

export async function loader({ request }: LoaderFunctionArgs) {
  return withSession(request, async ({ role }, headers) => {
    if (role !== Role.ADMIN) {
      return redirect('/dashboard');
    }

    const repo = new Phase3ScoreRepository();
    const byCategory = await repo.getRanking();
    const storageGateway = new StorageGateway();

    const groups = Object.entries(byCategory).map(([key, works]) => ({
      key,
      works: works.map(w => ({
        rank: w.rank,
        id: w.id,
        title: w.title,
        category: w.category,
        region: w.region,
        totalScore: w.totalScore,
        candidate: {
          name: w.candidate.name,
          state: w.candidate.state,
          city: w.candidate.city,
          profilePhotoUrl: w.candidate.profilePhoto
            ? storageGateway.getFileUrl(w.candidate.profilePhoto)
            : null,
        },
      })),
    }));

    return Response.json({ role, groups }, { headers });
  });
}

export { AdminRankingPage as default } from '@/pages/dashboard/admin/ranking';
