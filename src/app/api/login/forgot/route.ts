import { NextResponse } from "next/server";
import { authEnabled, clientIp } from "@/lib/server/auth";
import { alertChannels, logEvent, sendAlert, whoLine } from "@/lib/server/adminEvents";
import { issueToken } from "@/lib/server/adminTokens";
import { humanCheck } from "@/lib/server/loginGuard";
import { db, dbEnabled, ensureSchema } from "@/lib/server/db";
import { HOSTS } from "@/lib/site";

export const dynamic = "force-dynamic";

const RESET_MINUTES = 20;

/**
 * "Forgot password": sends a one-time reset link (20 minutes) to the owner's own email - the alert
 * channels set in Vercel - never to an address typed on the page. At most one every 2 minutes and 5 a day.
 */
export async function POST(req: Request) {
  if (!authEnabled() || !dbEnabled()) return NextResponse.json({ error: "off", message: "The login needs the database." }, { status: 400 });
  const body = (await req.json().catch(() => null)) as { turnstile?: unknown } | null;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
  if (!(await humanCheck(body?.turnstile, clientIp(req), host, "admin-forgot")))
    return NextResponse.json({ error: "human", message: "Please tick “Verify you are human” first." }, { status: 400 });

  const c = alertChannels();
  if (!c.email) return NextResponse.json({ ok: false, error: "nochannel" }, { status: 400 });

  await ensureSchema();
  const [{ recent, today }] = await db()<{ recent: number; today: number }[]>`
    select count(*) filter (where at > now() - interval '2 minutes')::int as recent, count(*)::int as today
    from pf_admin_events where kind = 'reset-requested' and at > now() - interval '1 day'`;
  if (recent > 0 || today >= 5)
    return NextResponse.json({ error: "wait", message: today >= 5 ? "Too many reset links today. Try again tomorrow." : "A link was just sent. Wait 2 minutes before asking again." }, { status: 429 });

  await logEvent(req, "reset-requested");
  const token = await issueToken("reset", RESET_MINUTES);
  const base = host.split(":")[0] === HOSTS.admin ? `https://${HOSTS.admin}` : new URL(req.url).origin;
  const sent = await sendAlert("Password reset link", [
    `Someone asked to reset the admin password. ${whoLine(req)}`,
    "",
    `To choose a new password, open this link within ${RESET_MINUTES} minutes:`,
    `${base}/login/reset#${token}`,
    "",
    "If this wasn't you, ignore this message - your password stays the same.",
  ]);
  if (!sent) return NextResponse.json({ error: "failed", message: "The reset link couldn't be sent. Try again later." }, { status: 502 });
  return NextResponse.json({ ok: true, to: "email" });
}
