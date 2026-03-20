import { data, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router';
import { z } from 'zod';
import { StorageGateway } from '~/gateways/StorageGateway';
import type { Category, WorkStatus } from '~/generated/prisma';
import { CATEGORY_VALUES } from '~/lib/enums';
import { Role } from '~/lib/roles';
import { getSubFromToken, withSession } from '~/lib/session';
import { Phase1ReviewRepository } from '~/repositories/Phase1ReviewRepository';
import { UserRepository } from '~/repositories/UserRepository';

const REVIEWABLE_STATUSES = ['SUBMITTED', 'QUALIFIED', 'DISQUALIFIED'] as const satisfies WorkStatus[];

async function getReviewerIdFromToken(accessToken: string) {
  const externalId = getSubFromToken(accessToken);
  if (!externalId) { return null; }
  const user = await new UserRepository().findByExternalId(externalId);
  return user?.id ?? null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  return withSession(request, async ({ role, accessToken }, headers) => {
    if (role !== Role.PHASE1_REVIEWER && role !== Role.ADMIN) {
      return redirect('/dashboard');
    }

    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));
    const statusParam = url.searchParams.get('status') as WorkStatus | null;
    const categoryParam = url.searchParams.get('category') as Category | null;

    const status = statusParam && (REVIEWABLE_STATUSES as readonly string[]).includes(statusParam)
      ? statusParam as 'SUBMITTED' | 'QUALIFIED' | 'DISQUALIFIED'
      : undefined;
    const category = categoryParam && (CATEGORY_VALUES as readonly string[]).includes(categoryParam)
      ? categoryParam
      : undefined;

    const repo = new Phase1ReviewRepository();
    const result = await repo.listForReview({ page, status, category });
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
      phase1Review: w.phase1Review
        ? { ...w.phase1Review, updatedAt: w.phase1Review.updatedAt.toISOString() }
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
      { role, works: worksWithUrls, total, pageSize, page },
      { headers },
    );
  });
}

const reviewSchema = z.object({
  workId: z.string().min(1),
  qualified: z.enum(['true', 'false']),
  justification: z.string().optional(),
});

export async function action({ request }: ActionFunctionArgs) {
  return withSession(request, async ({ role, accessToken }) => {
    if (role !== Role.PHASE1_REVIEWER && role !== Role.ADMIN) {
      return redirect('/dashboard');
    }

    const reviewerId = await getReviewerIdFromToken(accessToken);
    if (!reviewerId) { return data({ error: 'Revisor não encontrado.' }, { status: 404 }); }

    const formData = await request.formData();
    const parsed = reviewSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return data({ error: 'Dados inválidos.', fieldErrors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { workId, qualified: qualifiedRaw, justification } = parsed.data;
    const qualified = qualifiedRaw === 'true';

    if (!qualified && !justification?.trim()) {
      return data({ error: 'A justificativa é obrigatória ao inabilitar uma obra.' }, { status: 400 });
    }

    const repo = new Phase1ReviewRepository();
    await repo.upsert({ workId, reviewerId, qualified, justification: justification?.trim() });
    await repo.updateWorkStatus(workId, qualified);

    return data({ success: true });
  });
}

export { Phase1WorksPage as default } from '@/pages/dashboard/phase1/works';
