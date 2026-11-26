import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { adminAuthed } from "@/lib/server/auth";
import { logEvent } from "@/lib/server/adminEvents";
import { allow, tooMany } from "@/lib/server/rateLimit";
import { publicUrl, putFile, r2Enabled } from "@/lib/server/r2";

export const dynamic = "force-dynamic";

const MAX_BYTES = 10 * 1024 * 1024;
/** What may be uploaded, recognised by the file's first bytes (not by its name or the browser's word for it). */
const KINDS: { ext: string; type: string; magic: (b: Uint8Array) => boolean }[] = [
  { ext: "pdf", type: "application/pdf", magic: (b) => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46 },
  { ext: "png", type: "image/png", magic: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  { ext: "jpg", type: "image/jpeg", magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { ext: "webp", type: "image/webp", magic: (b) => b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50 },
  { ext: "gif", type: "image/gif", magic: (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 },
];

/** One file (multipart field "file") → its public address on files.ratulhasan.dev. */
export async function POST(req: Request) {
  if (!(await adminAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!r2Enabled()) return NextResponse.json({ error: "nor2", message: "Uploads need the R2 settings in Vercel (R2_ACCOUNT_ID, R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)." }, { status: 503 });
  if (!(await allow("upload", 60, 60))) return tooMany();
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "bad", message: "Choose a file." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "big", message: "Files can be up to 10 MB." }, { status: 413 });
  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = KINDS.find((k) => k.magic(bytes));
  if (!kind) return NextResponse.json({ error: "type", message: "Upload a PDF, PNG, JPG, WebP or GIF." }, { status: 400 });
  const key = `f/${randomBytes(12).toString("base64url")}.${kind.ext}`;
  await putFile(key, bytes, kind.type, file.name || `file.${kind.ext}`);
  await logEvent(req, "file-uploaded", `${file.name} → ${key}`);
  return NextResponse.json({ ok: true, url: publicUrl(key) });
}
