import { data, type ActionFunctionArgs } from 'react-router';
import { z } from 'zod';
import { ALL_ALLOWED_CONTENT_TYPES, StorageGateway } from '~/gateways/StorageGateway';
import { GetUploadUrlUseCase } from '~/usecases/GetUploadUrlUseCase';

const schema = z.object({
  contentType: z.string().refine(
    (v) => (ALL_ALLOWED_CONTENT_TYPES as readonly string[]).includes(v),
    { message: 'Tipo de arquivo não permitido.' },
  ),
  folder: z.enum(['drt', 'enrollment', 'profile', 'works']),
});

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return data({ error: 'Dados inválidos.' }, { status: 400 });
  }

  const storageGateway = new StorageGateway();
  const useCase = new GetUploadUrlUseCase(storageGateway);
  const result = await useCase.execute(parsed.data);

  return data(result);
}
