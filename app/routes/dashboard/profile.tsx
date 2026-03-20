import { data, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router';
import { z } from 'zod';
import { CandidateRepository } from '~/repositories/CandidateRepository';
import { UserRepository } from '~/repositories/UserRepository';
import { withSession, getSubFromToken } from '~/lib/session';
import { Role } from '~/lib/roles';
import { StorageGateway } from '~/gateways/StorageGateway';

const updatePhotoSchema = z.object({
  profilePhoto: z.string().min(1),
});

async function getCandidateForSession(accessToken: string) {
  const externalId = getSubFromToken(accessToken);
  if (!externalId) return null;
  const userRepository = new UserRepository();
  const user = await userRepository.findByExternalId(externalId);
  if (!user) return null;
  const candidateRepository = new CandidateRepository();
  return { user, candidate: await candidateRepository.findByUserId(user.id), candidateRepository };
}

export async function loader({ request }: LoaderFunctionArgs) {
  return withSession(request, async ({ accessToken, role }, headers) => {
    if (role !== Role.CANDIDATE) return redirect('/dashboard');

    const result = await getCandidateForSession(accessToken);
    if (!result?.candidate) return redirect('/dashboard');
    const { candidate } = result;

    const storageGateway = new StorageGateway();
    const profilePhotoUrl = candidate.profilePhoto
      ? storageGateway.getFileUrl(candidate.profilePhoto)
      : null;

    return Response.json(
      {
        role,
        candidate: {
          name: candidate.name,
          socialName: candidate.socialName,
          email: result.user.email,
          cpf: candidate.cpf,
          phone: candidate.phone,
          state: candidate.state,
          city: candidate.city,
          category: candidate.category,
          wantsMaster: candidate.wantsMaster,
          emailConfirmedAt: candidate.emailConfirmedAt?.toISOString() ?? null,
          profilePhotoUrl,
        },
      },
      { headers },
    );
  });
}

export async function action({ request }: ActionFunctionArgs) {
  return withSession(request, async ({ accessToken, role }) => {
    if (role !== Role.CANDIDATE) return redirect('/dashboard');

    const result = await getCandidateForSession(accessToken);
    if (!result?.candidate) return data({ error: 'Candidato não encontrado.' }, { status: 404 });
    const { candidate, candidateRepository } = result;

    const formData = await request.formData();
    const intent = formData.get('intent');

    if (intent === 'updatePhoto') {
      const parsed = updatePhotoSchema.safeParse({ profilePhoto: formData.get('profilePhoto') });
      if (!parsed.success) return data({ error: 'Dados inválidos.' }, { status: 400 });
      await candidateRepository.updateProfilePhoto(candidate.id, parsed.data.profilePhoto);
      return data({ success: true });
    }

    if (intent === 'removePhoto') {
      await candidateRepository.updateProfilePhoto(candidate.id, null);
      return data({ success: true });
    }

    return data({ error: 'Ação inválida.' }, { status: 400 });
  });
}

export { ProfilePage as default } from '@/pages/dashboard/profile';
