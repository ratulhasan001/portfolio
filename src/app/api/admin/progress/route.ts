import { NextResponse } from "next/server";
import { adminAuthed } from "@/lib/server/auth";
import { dbEnabled } from "@/lib/server/db";
import { adminProgress, updateProgress } from "@/lib/server/content";
import type { TaskStatus } from "@/lib/admin-sections";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await adminAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ progress: await adminProgress(), db: dbEnabled() });
}

/** { changes: [{ id, status, note?, evidence? }] }: the public Folionix page shows the change at once. */
export async function POST(req: Request) {
  if (!(await adminAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!dbEnabled()) return NextResponse.json({ error: "nodb", message: "Saving needs the database (DATABASE_URL)." }, { status: 503 });
  const body = (await req.json().catch(() => null)) as { changes?: unknown } | null;
  const raw = Array.isArray(body?.changes) ? body.changes.slice(0, 300) : [];
  const changes = raw
    .filter((c): c is { id: string; status: TaskStatus; note?: string; evidence?: unknown } => !!c && typeof c === "object" && typeof (c as { id?: unknown }).id === "string" && typeof (c as { status?: unknown }).status === "string")
    .map((c) => ({ id: c.id, status: c.status, note: typeof c.note === "string" ? c.note : undefined, evidence: c.evidence }));
  if (!changes.length) return NextResponse.json({ error: "bad", message: "Nothing to change." }, { status: 400 });
  const bad = await updateProgress(changes);
  return NextResponse.json({ ok: true, bad, progress: await adminProgress() });
}
