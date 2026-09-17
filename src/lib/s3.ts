import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Credentials come from the EC2 instance's IAM role (the default AWS SDK credential
// chain) - nothing is stored in env vars. See AWS_DEPLOYMENT.md §10 for the IAM
// policy and instance-profile setup. Only the region + bucket name are configured here.
const REGION = process.env.AWS_REGION ?? "ap-south-1";
const BUCKET = process.env.S3_UPLOADS_BUCKET;

let client: S3Client | null = null;
function s3() {
  if (!BUCKET) throw new Error("S3_UPLOADS_BUCKET is not set.");
  if (!client) client = new S3Client({ region: REGION });
  return client;
}

function extFromContentType(contentType: string) {
  if (contentType === "application/pdf") return "pdf";
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return "jpg";
}

/** Uploads a file and returns the S3 object key (not a public URL — the bucket is private). */
export async function uploadObject(params: {
  buffer: Buffer;
  contentType: string;
  keyPrefix: string; // e.g. "contracts/<vendorId>" or "vendor-logos/<vendorId>"
}): Promise<string> {
  const key = `${params.keyPrefix}/${Date.now()}.${extFromContentType(params.contentType)}`;
  await s3().send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: params.buffer,
      ContentType: params.contentType,
    })
  );
  return key;
}

/** Short-lived signed URL so a private bucket object can be viewed/downloaded. */
export async function getSignedDownloadUrl(key: string, expiresInSeconds = 600): Promise<string> {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(s3(), command, { expiresIn: expiresInSeconds });
}

export async function deleteObject(key: string): Promise<void> {
  await s3().send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

export function isS3Configured() {
  return Boolean(BUCKET);
}
