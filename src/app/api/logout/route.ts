import { NextResponse } from "next/server";
import { IDLE_MINUTES, adminAuthed, endSession } from "@/lib/server/auth";
import { logEvent } from "@/lib/server/adminEvents";

/** Logs this device out. The admin panel sends { reason: "idle" } when it logs itself out for lack of use. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { reason?: unknown } | null;
  if (await adminAuthed()) await logEvent(req, "logout", body?.reason === "idle" ? `after ${IDLE_MINUTES} minutes without use` : "");
  await endSession();
  return NextResponse.json({ ok: true });
}
