import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { env } from '~/config/env';
import { s3Client } from '~/lib/s3Client';

const EXPIRES_IN_SECONDS = 5 * 60;

const ALLOWED_CONTENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png'] as const;
type AllowedContentType = (typeof ALLOWED_CONTENT_TYPES)[number];

export class StorageGateway {
  getFileUrl(key: string): string {
    return `https://${env.AWS_BUCKET_DOMAIN_NAME}/${key}`;
  }

  async createPresignedPost(params: StorageGateway.CreatePresignedPostParams): Promise<StorageGateway.PresignedPost> {
    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: env.AWS_BUCKET,
      Key: params.key,
      Expires: EXPIRES_IN_SECONDS,
      Conditions: [
        { bucket: env.AWS_BUCKET },
        ['eq', '$key', params.key],
        ['eq', '$Content-Type', params.contentType],
        ['content-length-range', 1, params.maxSizeBytes],
      ],
      Fields: {
        'Content-Type': params.contentType,
      },
    });

    return { url, fields };
  }
}

export namespace StorageGateway {
  export type CreatePresignedPostParams = {
    key: string;
    contentType: AllowedContentType;
    maxSizeBytes: number;
  };

  export type PresignedPost = {
    url: string;
    fields: Record<string, string>;
  };
}
