import { NextResponse } from "next/server";
import { authEnabled, clientIp, endSessions } from "@/lib/server/auth";
import { alertLater, logEvent, loggedIn, securityLink, whoLine } from "@/lib/server/adminEvents";
import { passwordProblem, setAdminPassword } from "@/lib/server/adminPassword";
import { dropTokens, peekToken, spendToken } from "@/lib/server/adminTokens";
import { startAttempt, wrongMessage } from "@/lib/server/loginGuard";
import { checkCode, twoFactorOn } from "@/lib/server/twoFactor";
import { dbEnabled } from "@/lib/server/db";

export const dynamic = "force-dynamic";

const bad = (error: string, message: string, status = 400) => NextResponse.json({ error, message }, { status });

/**
 * The page a reset link opens.
 * { step: "check", token } → whether the link still works, and whether a two-step code is needed
 * { step: "set", token, password, code? } → sets the new password, logs every device out, and logs this one in
 * With two-step login on, the code from the app (or a recovery code) is needed too: the reset link alone isn't enough.
 */
export async function POST(req: Request) {
  if (!authEnabled() || !dbEnabled()) return bad("off", "The login needs the database.");
  const body = (await req.json().catch(() => null)) as { step?: unknown; token?: unknown; password?: unknown; code?: unknown } | null;
  const valid = await peekToken("reset", body?.token);
  if (!valid) return bad("expired", "This reset link has expired or was already used. Ask for a new one from the login page.");
  const needsCode = await twoFactorOn();
  if (body?.step === "check") return NextResponse.json({ ok: true, needsCode });
  if (body?.step !== "set") return bad("bad", "Unknown step.");

  const password = typeof body.password === "string" ? body.password : "";
  const problem = passwordProblem(password);
  if (problem) return bad("weak", problem);

  if (needsCode) {
    const attempt = await startAttempt(clientIp(req));
    if (!attempt.ok) return bad("locked", attempt.message, 429);
    if (!(await checkCode(typeof body.code === "string" ? body.code.trim() : ""))) {
      const lockedFor = await attempt.failed();
      await logEvent(req, "wrong-code", "during a password reset");
      return bad("code", wrongMessage("That code isn't right.", lockedFor));
    }
    await attempt.passed();
  }
  if (!(await spendToken("reset", body.token))) return bad("expired", "This reset link was already used.");
  await dropTokens("reset");
  await setAdminPassword(password);
  await endSessions({});
  await logEvent(req, "password-reset");
  alertLater("Admin password was reset", [whoLine(req), "Every device was logged out.", "If this wasn't you, change APP_PASSWORD in Vercel to get back in.", securityLink()]);
  await loggedIn(req, "reset");
  return NextResponse.json({ ok: true });
}
