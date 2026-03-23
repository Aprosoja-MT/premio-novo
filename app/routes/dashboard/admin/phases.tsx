import { data, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router';
import { z } from 'zod';
import { Role } from '~/lib/roles';
import { getSubFromToken, withSession } from '~/lib/session';
import { PhaseControlRepository } from '~/repositories/PhaseControlRepository';
import { UserRepository } from '~/repositories/UserRepository';

async function getAdminEmailFromToken(accessToken: string) {
  const externalId = getSubFromToken(accessToken);
  if (!externalId) { return null; }
  const user = await new UserRepository().findByExternalId(externalId);
  return user?.email ?? null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  return withSession(request, async ({ role }, headers) => {
    if (role !== Role.ADMIN) { return redirect('/dashboard'); }

    const repo = new PhaseControlRepository();
    const phases = await repo.getAll();

    return Response.json({ role, phases }, { headers });
  });
}

const actionSchema = z.object({
  intent: z.enum(['start', 'finish']),
  phase: z.coerce.number().int().min(1).max(3),
});

export async function action({ request }: ActionFunctionArgs) {
  return withSession(request, async ({ role, accessToken }) => {
    if (role !== Role.ADMIN) { return redirect('/dashboard'); }

    const adminEmail = await getAdminEmailFromToken(accessToken);
    if (!adminEmail) { return data({ error: 'Admin não encontrado.' }, { status: 404 }); }

    const formData = await request.formData();
    const parsed = actionSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return data({ error: 'Dados inválidos.' }, { status: 400 });
    }

    const { intent, phase } = parsed.data;
    const repo = new PhaseControlRepository();

    if (intent === 'start') {
      await repo.start(phase, adminEmail);
    } else {
      const isOpen = await repo.isOpen(phase);
      if (!isOpen) {
        return data({ error: 'Fase não está aberta.' }, { status: 400 });
      }
      await repo.finish(phase, adminEmail);
    }

    return data({ success: true });
  });
}

export { AdminPhasesPage as default } from '@/pages/dashboard/admin/phases';
