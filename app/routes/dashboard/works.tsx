import { data, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router';
import { z } from 'zod';
import { StorageGateway } from '~/gateways/StorageGateway';
import type { Category, Region, WorkFormat } from '~/generated/prisma';
import { REGION_VALUES, WORK_FORMAT_VALUES } from '~/lib/enums';
import { Role } from '~/lib/roles';
import { getSubFromToken, withSession } from '~/lib/session';
import { isoToBR } from '~/lib/utils';
import { CandidateRepository } from '~/repositories/CandidateRepository';
import { UserRepository } from '~/repositories/UserRepository';
import { WorkRepository } from '~/repositories/WorkRepository';
import { PublicationDateOutOfWindow, SubmitWorkUseCase, WorkLimitReached } from '~/usecases/SubmitWorkUseCase';

const PUBLICATION_WINDOW_START = '2025-09-12';
const PUBLICATION_WINDOW_END = '2026-08-07';

const emptyToUndefined = z.string().transform(v => v || undefined);

const submitSchema = z.object({
  title: emptyToUndefined.pipe(z.string().max(200).optional()),
  publishedAt: emptyToUndefined.pipe(z.string().date().optional()),
  description: emptyToUndefined.pipe(z.string().max(400).optional()),
  mediaFile: emptyToUndefined.pipe(z.string().optional()),
  mediaUrl: z.string().url().optional().or(z.literal('')),
  isPrinted: z.enum(['true', 'false']).optional(),
  workFormat: z.enum(WORK_FORMAT_VALUES as [WorkFormat, ...WorkFormat[]]).optional(),
  region: z.enum(REGION_VALUES as [Region, ...Region[]]).optional(),
  sourceWorkId: emptyToUndefined.pipe(z.string().optional()),
  declarationAuthor: z.literal('true'),
  declarationVehicle: z.literal('true'),
  declarationRules: z.literal('true'),
});

async function resolveCandidate(accessToken: string) {
  const externalId = getSubFromToken(accessToken);
  if (!externalId) return null;
  const user = await new UserRepository().findByExternalId(externalId);
  if (!user) return null;
  const candidate = await new CandidateRepository().findByUserId(user.id);
  if (!candidate) return null;
  return { user, candidate };
}

export async function loader({ request }: LoaderFunctionArgs) {
  return withSession(request, async ({ accessToken, role }, headers) => {
    if (role !== Role.CANDIDATE) return redirect('/dashboard');

    const resolved = await resolveCandidate(accessToken);
    if (!resolved) return redirect('/dashboard');
    const { candidate } = resolved;

    const workRepository = new WorkRepository();
    const works = await workRepository.findByCandidateId(candidate.id);

    const storageGateway = new StorageGateway();
    const worksWithUrls = works.map(w => ({
      ...w,
      mediaFileUrl: w.mediaFile ? storageGateway.getFileUrl(w.mediaFile) : null,
      createdAt: w.createdAt.toISOString(),
      publishedAt: w.publishedAt.toISOString(),
    }));

    return Response.json(
      {
        role,
        candidate: {
          id: candidate.id,
          category: candidate.category,
          state: candidate.state,
          wantsMaster: candidate.wantsMaster,
        },
        works: worksWithUrls,
        publicationWindow: { start: PUBLICATION_WINDOW_START, end: PUBLICATION_WINDOW_END },
      },
      { headers },
    );
  });
}

export async function action({ request }: ActionFunctionArgs) {
  return withSession(request, async ({ accessToken, role }) => {
    if (role !== Role.CANDIDATE) return redirect('/dashboard');

    const resolved = await resolveCandidate(accessToken);
    if (!resolved) return data({ error: 'Candidato não encontrado.' }, { status: 404 });
    const { candidate } = resolved;

    const formData = await request.formData();
    const intent = formData.get('intent');

    if (intent === 'submit') {
      const raw = Object.fromEntries(formData);
      const parsed = submitSchema.safeParse(raw);
      if (!parsed.success) {
        return data({ error: 'Dados inválidos.', fieldErrors: parsed.error.flatten().fieldErrors }, { status: 400 });
      }

      const workRepository = new WorkRepository();
      const useCase = new SubmitWorkUseCase(workRepository);

      const sourceWorkId = parsed.data.sourceWorkId || undefined;
      let title = parsed.data.title ?? '';
      let publishedAt = parsed.data.publishedAt ?? '';
      let description = parsed.data.description ?? '';
      let mediaFile = parsed.data.mediaFile || undefined;
      let mediaUrl = parsed.data.mediaUrl || undefined;
      let isPrinted = parsed.data.isPrinted === 'true';

      if (sourceWorkId) {
        const source = await workRepository.findById(sourceWorkId);
        if (!source || source.candidateId !== candidate.id) {
          return data({ error: 'Obra de origem não encontrada.' }, { status: 404 });
        }
        title = source.title;
        publishedAt = source.publishedAt.toISOString().slice(0, 10);
        description = source.description;
        mediaFile = source.mediaFile ?? undefined;
        mediaUrl = source.mediaUrl ?? undefined;
        isPrinted = source.isPrinted;
      }

      if (!title || !publishedAt || !description) {
        return data({ error: 'Dados inválidos.' }, { status: 400 });
      }

      const isDestaquesSubmission = parsed.data.region != null;
      const category: Category = isDestaquesSubmission ? 'DESTAQUES_MT' : candidate.category as Category;

      try {
        await useCase.execute({
          candidateId: candidate.id,
          title,
          category,
          publishedAt: new Date(publishedAt),
          description,
          workFormat: parsed.data.workFormat as WorkFormat | undefined,
          mediaFile,
          mediaUrl,
          isPrinted,
          region: parsed.data.region as Region | undefined,
          sourceWorkId,
        });
        return data({ success: true });
      } catch (err) {
        if (err instanceof WorkLimitReached) {
          return data({ error: 'Você já atingiu o limite de obras para esta categoria.' }, { status: 422 });
        }
        if (err instanceof PublicationDateOutOfWindow) {
          return data({ error: `A data de publicação deve estar entre ${isoToBR(PUBLICATION_WINDOW_START)} e ${isoToBR(PUBLICATION_WINDOW_END)}.` }, { status: 422 });
        }
        throw err;
      }
    }

    if (intent === 'delete') {
      const workId = String(formData.get('workId') ?? '');
      if (!workId) return data({ error: 'ID da obra não informado.' }, { status: 400 });
      const workRepository = new WorkRepository();
      await workRepository.delete(workId, candidate.id);
      return data({ success: true });
    }

    return data({ error: 'Ação inválida.' }, { status: 400 });
  });
}

export { WorksPage as default } from '@/pages/dashboard/works';
