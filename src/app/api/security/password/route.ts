import { NextResponse } from "next/server";
import { adminAuthed, currentSessionId, endSessions } from "@/lib/server/auth";
import { passwordProblem, passwordStatus, setAdminPassword, verifyAdminPassword } from "@/lib/server/adminPassword";
import { dbEnabled } from "@/lib/server/db";
import { alertLater, logEvent, securityLink, whoLine } from "@/lib/server/adminEvents";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await adminAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!dbEnabled()) return NextResponse.json({ custom: false, changedAt: null, db: false });
  return NextResponse.json({ ...(await passwordStatus()), db: true });
}

/** Changes the admin password ({ current, next }); every other device is logged out. */
export async function POST(req: Request) {
  if (!(await adminAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!dbEnabled()) return NextResponse.json({ error: "nodb", message: "Needs the database." }, { status: 400 });
  const body = (await req.json().catch(() => null)) as { current?: unknown; next?: unknown } | null;
  const current = typeof body?.current === "string" ? body.current : "";
  const next = typeof body?.next === "string" ? body.next : "";
  if (!(await verifyAdminPassword(current))) {
    await logEvent(req, "wrong-password", "while changing the password");
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "current", message: "Your current password is wrong." }, { status: 400 });
  }
  const problem = passwordProblem(next);
  if (problem) return NextResponse.json({ error: "weak", message: problem }, { status: 400 });
  if (next === (process.env.APP_PASSWORD ?? "")) return NextResponse.json({ error: "same", message: "Choose a new password, not the starting one." }, { status: 400 });
  if (next === current) return NextResponse.json({ error: "same", message: "That's the password you have now. Choose a new one." }, { status: 400 });
  await setAdminPassword(next);
  await endSessions({ except: (await currentSessionId()) ?? "-" });
  await logEvent(req, "password-changed");
  alertLater("Admin password changed", [whoLine(req), "Every other device was logged out.", "If this wasn't you, change APP_PASSWORD in Vercel to get back in.", securityLink()]);
  return NextResponse.json({ ok: true });
}
