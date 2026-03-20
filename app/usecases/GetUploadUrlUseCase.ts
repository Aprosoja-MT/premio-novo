import { randomUUID } from 'node:crypto';
import { StorageGateway } from '~/gateways/StorageGateway';

const MB = 1024 * 1024;

const MAX_SIZE_BY_MIME: Record<string, number> = {
  'application/pdf': 20 * MB,
  'image/jpeg': 20 * MB,
  'image/png': 20 * MB,
  'video/mp4': 500 * MB,
  'video/quicktime': 500 * MB,
  'audio/mpeg': 100 * MB,
  'audio/mp4': 100 * MB,
  'audio/wav': 100 * MB,
};

const DEFAULT_MAX_SIZE_BYTES = 20 * MB;

const MIME_TO_EXT: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
  'audio/mpeg': 'mp3',
  'audio/mp4': 'm4a',
  'audio/wav': 'wav',
};

export class GetUploadUrlUseCase {
  constructor(private readonly storageGateway: StorageGateway) {}

  async execute(params: GetUploadUrlUseCase.Input): Promise<GetUploadUrlUseCase.Output> {
    const ext = MIME_TO_EXT[params.contentType];
    const key = `uploads/${params.folder}/${randomUUID()}.${ext}`;

    const presignedPost = await this.storageGateway.createPresignedPost({
      key,
      contentType: params.contentType as Parameters<StorageGateway['createPresignedPost']>[0]['contentType'],
      maxSizeBytes: MAX_SIZE_BY_MIME[params.contentType] ?? DEFAULT_MAX_SIZE_BYTES,
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
