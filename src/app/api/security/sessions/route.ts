import { NextResponse } from "next/server";
import { adminAuthed, currentSessionId, endSessions, listSessions } from "@/lib/server/auth";
import { dbEnabled, ensureSchema } from "@/lib/server/db";
import { logEvent } from "@/lib/server/adminEvents";

export const dynamic = "force-dynamic";

/** The devices logged in to the admin panel. */
export async function GET() {
  if (!(await adminAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!dbEnabled()) return NextResponse.json({ sessions: [], current: null });
  await ensureSchema();
  return NextResponse.json({ sessions: await listSessions(), current: await currentSessionId() });
}

/** Logs out one device ({ id }) or every other device ({ others: true }). */
export async function DELETE(req: Request) {
  if (!(await adminAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!dbEnabled()) return NextResponse.json({ error: "no database" }, { status: 400 });
  const body = (await req.json().catch(() => null)) as { id?: unknown; others?: unknown } | null;
  const current = await currentSessionId();
  if (body?.others === true) {
    await endSessions({ except: current ?? "-" });
    await logEvent(req, "device-logged-out", "every other device");
  } else if (typeof body?.id === "string" && body.id && body.id !== current) {
    await endSessions({ id: body.id });
    await logEvent(req, "device-logged-out");
  } else return NextResponse.json({ error: "bad request" }, { status: 400 });
  return NextResponse.json({ ok: true });
}
