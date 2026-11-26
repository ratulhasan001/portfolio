import { NextResponse } from "next/server";
import { adminAuthed } from "@/lib/server/auth";
import { alertChannels, sendAlert, whoLine } from "@/lib/server/adminEvents";

export const dynamic = "force-dynamic";

/** Which alert channels are set up in Vercel. */
export async function GET() {
  if (!(await adminAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(alertChannels());
}

/** Sends a test alert. */
export async function POST(req: Request) {
  if (!(await adminAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const c = alertChannels();
  if (!c.email) return NextResponse.json({ error: "none", message: "Email alerts aren't set up yet." }, { status: 400 });
  const ok = await sendAlert("Test alert", ["Security alerts from your admin panel will arrive here.", whoLine(req)]);
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "failed", message: "The alert couldn't be sent. Check the keys in Vercel." }, { status: 502 });
}
