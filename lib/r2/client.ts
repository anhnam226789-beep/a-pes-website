import "server-only";

import { S3Client } from "@aws-sdk/client-s3";

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  /** Public base URL of the bucket, without a trailing slash. */
  publicBaseUrl: string;
}

/** Returns the R2 config, or `null` when the bucket has not been set up. */
export function getR2Config(): R2Config | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;

  if (
    !accountId ||
    !accessKeyId ||
    !secretAccessKey ||
    !bucket ||
    !publicBaseUrl
  ) {
    return null;
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucket,
    publicBaseUrl: publicBaseUrl.replace(/\/+$/, ""),
  };
}

/** Upload UI is hidden when this is false; pasting a URL still works. */
export function isR2Configured(): boolean {
  return getR2Config() !== null;
}

interface R2ClientCache {
  client: S3Client;
  /** Detects an account switch during `next dev` hot reloads. */
  accountId: string;
}

const globalWithR2 = globalThis as typeof globalThis & {
  __r2ClientCache?: R2ClientCache;
};

/**
 * R2 speaks the S3 API. Region must be `auto`, and the endpoint is the
 * account-scoped one — not a bucket-scoped host.
 */
export function getR2Client(config: R2Config): S3Client {
  const cached = globalWithR2.__r2ClientCache;
  if (cached && cached.accountId === config.accountId) return cached.client;

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  globalWithR2.__r2ClientCache = { client, accountId: config.accountId };
  return client;
}
