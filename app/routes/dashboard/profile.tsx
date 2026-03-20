import { data, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router';
import { z } from 'zod';
import { CandidateRepository } from '~/repositories/CandidateRepository';
import { UserRepository } from '~/repositories/UserRepository';
import { WorkRepository } from '~/repositories/WorkRepository';
import { withSession, getSubFromToken } from '~/lib/session';
import { Role } from '~/lib/roles';
import { StorageGateway } from '~/gateways/StorageGateway';
import { CATEGORY_VALUES } from '~/lib/enums';
import type { Category } from '~/generated/prisma';

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
  const candidate = await candidateRepository.findByUserId(user.id);
  return { user, candidate, candidateRepository };
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

    const works = await new WorkRepository().findByCandidateId(candidate.id);
    const worksCount = works.length;

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
          worksCount,
          hasDrt: !!candidate.drtFile,
          hasEnrollment: !!candidate.enrollmentFile,
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

    if (intent === 'changeCategory') {
      const works = await new WorkRepository().findByCandidateId(candidate.id);
      if (works.length > 0) {
        return data({ error: 'Exclua todas as suas obras antes de trocar de categoria.' }, { status: 422 });
      }

      const changeCategorySchema = z.object({
        category: z.enum(CATEGORY_VALUES as [Category, ...Category[]]),
        drtFile: z.string().optional(),
        enrollmentFile: z.string().optional(),
      });

      const parsed = changeCategorySchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return data({ error: 'Dados inválidos.' }, { status: 400 });
      }

      const { category, drtFile, enrollmentFile } = parsed.data;
      const isUniversity = category === 'UNIVERSITY';
      const needsDrt = !isUniversity && !candidate.drtFile && !drtFile;
      const needsEnrollment = isUniversity && !candidate.enrollmentFile && !enrollmentFile;

      if (needsDrt) {
        return data({ error: 'O arquivo DRT é obrigatório para categorias profissionais.' }, { status: 400 });
      }
      if (needsEnrollment) {
        return data({ error: 'O comprovante de matrícula é obrigatório para Jornalismo Universitário.' }, { status: 400 });
      }

      await candidateRepository.updateCategory(candidate.id, {
        category,
        drtFile: drtFile ?? candidate.drtFile ?? undefined,
        enrollmentFile: enrollmentFile ?? candidate.enrollmentFile ?? undefined,
      });

      return data({ success: true, intent: 'changeCategory' });
    }

    return data({ error: 'Ação inválida.' }, { status: 400 });
  });
}

export { ProfilePage as default } from '@/pages/dashboard/profile';
