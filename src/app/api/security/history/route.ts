import { NextResponse } from "next/server";
import { adminAuthed } from "@/lib/server/auth";
import { listEvents } from "@/lib/server/adminEvents";
import { dbEnabled } from "@/lib/server/db";

export const dynamic = "force-dynamic";

/** The latest admin logins, wrong passwords, lockouts and security changes. */
export async function GET() {
  if (!(await adminAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ events: dbEnabled() ? await listEvents() : [] });
}
