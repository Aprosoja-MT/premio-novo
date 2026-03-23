import { data, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router';
import { z } from 'zod';
import { StorageGateway } from '~/gateways/StorageGateway';
import type { Category } from '~/generated/prisma';
import { CATEGORY_VALUES } from '~/lib/enums';
import { Role } from '~/lib/roles';
import { getSubFromToken, withSession } from '~/lib/session';
import { Phase2ScoreRepository } from '~/repositories/Phase2ScoreRepository';
import { PhaseControlRepository } from '~/repositories/PhaseControlRepository';
import { UserRepository } from '~/repositories/UserRepository';

async function getJudgeIdFromToken(accessToken: string) {
  const externalId = getSubFromToken(accessToken);
  if (!externalId) { return null; }
  const user = await new UserRepository().findByExternalId(externalId);
  return user?.id ?? null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  return withSession(request, async ({ role, accessToken }, headers) => {
    if (role !== Role.PHASE2_JUDGE && role !== Role.ADMIN) {
      return redirect('/dashboard');
    }

    const judgeId = await getJudgeIdFromToken(accessToken);
    if (!judgeId) { return redirect('/dashboard'); }

    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));
    const categoryParam = url.searchParams.get('category') as Category | null;
    const category = categoryParam && (CATEGORY_VALUES as readonly string[]).includes(categoryParam)
      ? categoryParam
      : undefined;
    const scoredParam = url.searchParams.get('scored');
    const scored = scoredParam === 'true' ? true : scoredParam === 'false' ? false : undefined;

    const phaseRepo = new PhaseControlRepository();
    const [result, phaseOpen, phaseRow] = await Promise.all([
      new Phase2ScoreRepository().listForScoring({ page, category, scored }, judgeId),
      phaseRepo.isOpen(2),
      phaseRepo.getAll().then(rows => rows.find(r => r.phase === 2)),
    ]);
    const { total, pageSize } = result;

    const storageGateway = new StorageGateway();
    const worksWithUrls = result.works.map(w => ({
      id: w.id,
      title: w.title,
      category: w.category,
      description: w.description,
      status: w.status,
      mediaFile: w.mediaFile,
      mediaUrl: w.mediaUrl,
      isPrinted: w.isPrinted,
      workFormat: w.workFormat,
      region: w.region,
      mediaFileUrl: w.mediaFile ? storageGateway.getFileUrl(w.mediaFile) : null,
      publishedAt: w.publishedAt.toISOString(),
      createdAt: w.createdAt.toISOString(),
      myScore: w.phase2Scores[0]
        ? { ...w.phase2Scores[0], updatedAt: w.phase2Scores[0].updatedAt.toISOString() }
        : null,
      candidate: {
        name: w.candidate.name,
        state: w.candidate.state,
        city: w.candidate.city,
        profilePhotoUrl: w.candidate.profilePhoto
          ? storageGateway.getFileUrl(w.candidate.profilePhoto)
          : null,
      },
    }));

    return Response.json(
      { role, works: worksWithUrls, total, pageSize, page, phaseOpen, phaseStarted: !!phaseRow?.startedAt },
      { headers },
    );
  });
}

const scoreSchema = z.object({
  workId: z.string().min(1),
  thematicRelevance: z.coerce.number().int().min(1).max(5),
  newsContent: z.coerce.number().int().min(1).max(5),
  textQuality: z.coerce.number().int().min(1).max(5),
  narrativeQuality: z.coerce.number().int().min(1).max(5),
  aestheticQuality: z.coerce.number().int().min(1).max(5),
  photoRelevance: z.coerce.number().int().min(1).max(5),
  publicBenefit: z.coerce.number().int().min(1).max(5),
  sources: z.coerce.number().int().min(1).max(5),
  originality: z.coerce.number().int().min(1).max(5),
});

export async function action({ request }: ActionFunctionArgs) {
  return withSession(request, async ({ role, accessToken }) => {
    if (role !== Role.PHASE2_JUDGE && role !== Role.ADMIN) {
      return redirect('/dashboard');
    }

    const judgeId = await getJudgeIdFromToken(accessToken);
    if (!judgeId) { return data({ error: 'Jurado não encontrado.' }, { status: 404 }); }

    const formData = await request.formData();
    const intent = formData.get('intent');

    if (intent === 'markFinalists') {
      if (role !== Role.ADMIN) {
        return data({ error: 'Apenas administradores podem marcar finalistas.' }, { status: 403 });
      }
      const repo = new Phase2ScoreRepository();
      const result = await repo.markFinalists();
      return data({ success: true, finalistCount: result.finalistCount });
    }

    const phaseOpen = await new PhaseControlRepository().isOpen(2);
    if (!phaseOpen && role !== Role.ADMIN) {
      return data({ error: 'A fase 2 não está aberta.' }, { status: 403 });
    }

    const parsed = scoreSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return data({ error: 'Dados inválidos.', fieldErrors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { workId, ...scores } = parsed.data;
    const repo = new Phase2ScoreRepository();
    await repo.upsert({ workId, judgeId, scores });

    return data({ success: true });
  });
}

export { Phase2WorksPage as default } from '@/pages/dashboard/phase2/works';
