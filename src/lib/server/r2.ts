import { AwsClient } from "aws4fetch";
import { FILES_BASE } from "@/lib/site";

/**
 * Files uploaded from the admin panel (certificates, logos, photos) in Cloudflare R2: free up to 10 GB, no charge for
 * downloads. The bucket is public only through its custom domain (FILES_BASE, files.ratulhasan.dev), where
 * Cloudflare caches each file; writing needs the R2 API token in these Vercel variables.
 */
export const r2Enabled = () =>
  !!(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET);

const g = globalThis as unknown as { __pfR2?: AwsClient };
const client = () =>
  (g.__pfR2 ??= new AwsClient({
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    service: "s3",
    region: "auto",
  }));

/** File keys are "f/<random id>.<ext>": nothing else is ever written. */
const KEY = /^f\/[A-Za-z0-9_-]{8,80}\.(pdf|png|jpg|webp|gif)$/;
const objectUrl = (key: string) => {
  if (!KEY.test(key)) throw new Error("bad file key");
  const endpoint = process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  return `${endpoint}/${process.env.R2_BUCKET}/${key}`;
};

export const publicUrl = (key: string) => `${FILES_BASE}/${key}`;

/** Stores one file under a new key (so it can be cached for good). */
export async function putFile(key: string, bytes: Uint8Array<ArrayBuffer>, type: string, filename: string) {
  const headers = {
    "content-type": type,
    "cache-control": "public, max-age=31536000, immutable",
    "content-disposition": `inline; filename="${filename.replace(/[^A-Za-z0-9._ -]/g, "_").slice(0, 120)}"`,
  };
  // signed by aws4fetch, but sent with the bytes themselves: its own fetch streams the body without the
  // Content-Length that R2 requires (it answers 411)
  const signed = await client().sign(objectUrl(key), { method: "PUT", body: bytes, headers });
  const res = await fetch(signed.url, { method: "PUT", headers: signed.headers, body: bytes });
  if (!res.ok) throw new Error(`R2 upload of ${key} failed: ${res.status}`);
}
