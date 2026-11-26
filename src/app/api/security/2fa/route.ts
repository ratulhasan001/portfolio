import { NextResponse } from "next/server";
import { adminAuthed, clientIp } from "@/lib/server/auth";
import { alertChannels, alertLater, logEvent, securityLink, whoLine } from "@/lib/server/adminEvents";
import { getSetting, setSetting, verifyAdminPassword } from "@/lib/server/adminPassword";
import { startAttempt, wrongMessage } from "@/lib/server/loginGuard";
import {
  checkSettingsCode,
  confirmSetup,
  emailCodeMatches,
  emailCodeOn,
  makeRecoveryCodes,
  secondStepOn,
  secretReady,
  sendEmailCode,
  startSetup,
  turnOff,
  turnOffEmail,
  turnOnEmail,
  twoFactorOn,
  twoFactorStatus,
  type EmailCode,
} from "@/lib/server/twoFactor";
import { dbEnabled } from "@/lib/server/db";

export const dynamic = "force-dynamic";

const bad = (message: string, status = 400) => NextResponse.json({ error: "bad", message }, { status });

export async function GET() {
  if (!(await adminAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!dbEnabled()) return NextResponse.json({ on: false, email: false, recoveryLeft: 0, secretReady: secretReady(), secretWorks: true, db: false });
  return NextResponse.json({ ...(await twoFactorStatus()), db: true });
}

/**
 * Authenticator app:
 *   { action: "start", password }          → a new secret as a QR code
 *   { action: "confirm", code }            → turns it on; answers recovery codes
 *   { action: "off", password, code }      → turns it off
 * Email codes:
 *   { action: "email-send" }               → emails a code, to confirm the next change with
 *   { action: "email-on", password, code } → turns them on (the emailed code shows the address works)
 *   { action: "email-off", password, code }→ turns them off
 * Both:
 *   { action: "recovery", password, code } → new recovery codes (the old ones stop working)
 * The password is asked again so that a device left logged in can't change how the login works. "code" may be from
 * the app, a recovery code, or the email code just sent.
 */
export async function POST(req: Request) {
  if (!(await adminAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!dbEnabled()) return bad("Needs the database.");
  const body = (await req.json().catch(() => null)) as { action?: unknown; password?: unknown; code?: unknown } | null;
  const action = body?.action;
  const password = typeof body?.password === "string" ? body.password : "";
  const code = typeof body?.code === "string" ? body.code.trim() : "";

  if (action === "confirm") {
    const codes = await confirmSetup(code);
    if (!codes) return bad("That code isn't right. Check the time on your phone is set automatically, and type the newest code.");
    await logEvent(req, "2fa-on", "authenticator app");
    alertLater("Two-step login turned on (authenticator app)", [whoLine(req), securityLink()]);
    return NextResponse.json({ ok: true, codes });
  }

  if (action === "email-send") {
    if (!alertChannels().email) return bad("Email isn't set up yet (RESEND_API_KEY and ALERT_EMAIL in Vercel).");
    const last = await getSetting<EmailCode>("email2fa-pending");
    if (last && Date.now() - last.at < 30_000) return bad("A code was just sent. Wait half a minute before asking again.");
    const sent = await sendEmailCode("You asked for it to change your login settings.");
    if (!sent) return bad("The email couldn't be sent. Try again in a minute.", 502);
    await setSetting("email2fa-pending", sent);
    return NextResponse.json({ ok: true });
  }

  const known = ["start", "off", "recovery", "email-on", "email-off"];
  if (typeof action !== "string" || !known.includes(action)) return bad("Unknown action.");
  if (action === "start" && !secretReady()) return bad("First add SESSION_SECRET in Vercel (see the steps on this page), then try again.");
  if (action === "start" && (await twoFactorOn())) return bad("The authenticator app is already on.");
  if (action === "email-on" && (await emailCodeOn())) return bad("Email codes are already on.");
  if (action === "off" && !(await twoFactorOn())) return bad("The authenticator app is off.");
  if (action === "email-off" && !(await emailCodeOn())) return bad("Email codes are off.");
  if (action === "recovery" && !(await secondStepOn())) return bad("Two-step login is off.");

  const attempt = await startAttempt(clientIp(req));
  if (!attempt.ok) return bad(attempt.message, 429);
  if (!(await verifyAdminPassword(password))) {
    const lockedFor = await attempt.failed();
    await logEvent(req, "wrong-password", "in two-step login settings");
    return bad(wrongMessage("Your password is wrong.", lockedFor));
  }
  if (action === "email-on") {
    // the code emailed just now proves the address gets the codes
    const pending = await getSetting<EmailCode>("email2fa-pending");
    if (!emailCodeMatches(pending, code)) {
      const lockedFor = await attempt.failed();
      return bad(wrongMessage("That code isn't right. Use the newest code from the email.", lockedFor));
    }
  } else if (action !== "start" && !(await checkSettingsCode(code))) {
    const lockedFor = await attempt.failed();
    await logEvent(req, "wrong-code", "in two-step login settings");
    return bad(wrongMessage("That code isn't right.", lockedFor));
  }
  await attempt.passed();

  switch (action) {
    case "start":
      return NextResponse.json({ ok: true, ...(await startSetup()) });
    case "recovery":
      await logEvent(req, "recovery-codes");
      return NextResponse.json({ ok: true, codes: await makeRecoveryCodes() });
    case "email-on": {
      await setSetting("email2fa-pending", { hash: "", at: 0 });
      const codes = await turnOnEmail();
      await logEvent(req, "2fa-on", "email codes");
      alertLater("Two-step login turned on (email codes)", [whoLine(req), securityLink()]);
      return NextResponse.json({ ok: true, codes });
    }
    case "email-off":
      await turnOffEmail();
      await logEvent(req, "2fa-off", "email codes");
      alertLater("Email login codes turned OFF", [whoLine(req), (await secondStepOn()) ? "The authenticator app is still on." : "Logging in now needs only the password.", securityLink()]);
      return NextResponse.json({ ok: true });
    default:
      await turnOff();
      await logEvent(req, "2fa-off", "authenticator app");
      alertLater("Authenticator app turned OFF", [whoLine(req), (await secondStepOn()) ? "Email codes are still on." : "Logging in now needs only the password.", securityLink()]);
      return NextResponse.json({ ok: true });
  }
}
