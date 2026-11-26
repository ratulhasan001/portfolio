import { NextResponse } from "next/server";
import { adminAuthed } from "@/lib/server/auth";
import { logEvent } from "@/lib/server/adminEvents";
import { allow, tooMany } from "@/lib/server/rateLimit";
import { publish, publishReady, publishStatus } from "@/lib/server/content";

export const dynamic = "force-dynamic";

/** Starts a new build of the site, so saved sections go live (about a minute later). */
export async function POST(req: Request) {
  if (!(await adminAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!publishReady()) return NextResponse.json({ error: "nohook", message: "Publishing needs VERCEL_DEPLOY_HOOK_URL in Vercel." }, { status: 503 });
  if (!(await allow("publish", 20, 60))) return tooMany("That's a lot of publishing. Wait a while and try again.");
  if (!(await publish())) return NextResponse.json({ error: "failed", message: "Vercel didn't accept the build request. Try again in a minute." }, { status: 502 });
  await logEvent(req, "published");
  return NextResponse.json({ ok: true, publish: await publishStatus() });
}
