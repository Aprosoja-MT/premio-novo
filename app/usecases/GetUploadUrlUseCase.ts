import { randomUUID } from 'node:crypto';
import { StorageGateway } from '~/gateways/StorageGateway';

const MB = 1024 * 1024;
const MAX_SIZE_BYTES = 10 * MB;

const MIME_TO_EXT: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

export class GetUploadUrlUseCase {
  constructor(private readonly storageGateway: StorageGateway) {}

  async execute(params: GetUploadUrlUseCase.Input): Promise<GetUploadUrlUseCase.Output> {
    const ext = MIME_TO_EXT[params.contentType];
    const key = `uploads/${params.folder}/${randomUUID()}.${ext}`;

    const presignedPost = await this.storageGateway.createPresignedPost({
      key,
      contentType: params.contentType as Parameters<StorageGateway['createPresignedPost']>[0]['contentType'],
      maxSizeBytes: MAX_SIZE_BYTES,
    });

    const fileUrl = this.storageGateway.getFileUrl(key);

    return { presignedPost, key, fileUrl };
  }
}

export namespace GetUploadUrlUseCase {
  export type Input = {
    folder: string;
    contentType: string;
  };

  export type Output = {
    presignedPost: StorageGateway.PresignedPost;
    key: string;
    fileUrl: string;
  };
}
