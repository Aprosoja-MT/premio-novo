import { data, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router';
import { z } from 'zod';
import { EmailAlreadyInUse } from '~/errors/EmailAlreadyInUse';
import { AuthGateway } from '~/gateways/AuthGateway';
import { Role } from '~/lib/roles';
import { withSession } from '~/lib/session';
import { UserRepository } from '~/repositories/UserRepository';
import { CreateStaffUserUseCase } from '~/usecases/CreateStaffUserUseCase';

const VALID_ROLES = Object.values(Role);

export async function loader({ request }: LoaderFunctionArgs) {
  return withSession(request, async ({ role }, headers) => {
    if (role !== Role.ADMIN) { return redirect('/dashboard'); }

    const url = new URL(request.url);
    const roleFilter = url.searchParams.get('role') as Role | null;
    const wantsMasterFilter = url.searchParams.get('wantsMaster');

    const userRepository = new UserRepository();
    const users = await userRepository.listWithStats({
      role: roleFilter && VALID_ROLES.includes(roleFilter) ? roleFilter : undefined,
      wantsMaster: wantsMasterFilter === 'true' ? true : wantsMasterFilter === 'false' ? false : undefined,
    });

    return Response.json({ role, users }, { headers });
  });
}

const createSchema = z.object({
  email: z.email(),
  role: z.enum([Role.PHASE1_REVIEWER, Role.PHASE2_JUDGE, Role.PHASE3_JUDGE, Role.ADMIN]),
});

export async function action({ request }: ActionFunctionArgs) {
  return withSession(request, async ({ role }) => {
    if (role !== Role.ADMIN) { return redirect('/dashboard'); }

    const formData = await request.formData();
    const intent = formData.get('intent');

    if (intent === 'create') {
      const parsed = createSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        return data({ error: 'Dados inválidos.' }, { status: 400 });
      }

      try {
        const authGateway = new AuthGateway();
        const userRepository = new UserRepository();
        const useCase = new CreateStaffUserUseCase(authGateway, userRepository);
        await useCase.execute(parsed.data);
        return data({ success: true });
      } catch (error) {
        if (error instanceof EmailAlreadyInUse) {
          return data({ error: 'Este e-mail já está em uso.' }, { status: 409 });
        }
        throw error;
      }
    }

    return data({ error: 'Ação inválida.' }, { status: 400 });
  });
}

export { AdminUsersPage as default } from '@/pages/dashboard/admin/users';
