import { NextResponse } from "next/server";
import type { AuthenticationResponseJSON } from "@simplewebauthn/server";
import { authEnabled } from "@/lib/server/auth";
import { loggedIn, logEvent } from "@/lib/server/adminEvents";
import { loginOptions, loginVerify, relyingParty } from "@/lib/server/passkeys";
import { dbEnabled } from "@/lib/server/db";

export const dynamic = "force-dynamic";

/**
 * Logs in with a passkey. { step: "options" } → the challenge for the device to sign; { step: "verify", token,
 * response } → logs in. A passkey can't be guessed, so it isn't held back by the password lockouts: the owner can
 * still get in while someone is hammering the password box.
 */
export async function POST(req: Request) {
  if (!authEnabled() || !dbEnabled()) return NextResponse.json({ error: "off", message: "Passkeys need the database." }, { status: 400 });
  const rp = relyingParty(req);
  if (!rp) return NextResponse.json({ error: "host", message: "Passkeys only work on the admin address." }, { status: 400 });
  const body = (await req.json().catch(() => null)) as { step?: unknown; token?: unknown; response?: unknown } | null;

  if (body?.step === "options") return NextResponse.json({ ok: true, ...(await loginOptions(rp)) });
  if (body?.step === "verify" && body.response && typeof body.response === "object") {
    const name = await loginVerify(rp, body.token, body.response as AuthenticationResponseJSON);
    if (!name) {
      await logEvent(req, "wrong-password", "passkey not accepted");
      return NextResponse.json({ error: "wrong", message: "That passkey didn't work. Try again, or log in with your password." }, { status: 401 });
    }
    await loggedIn(req, "passkey");
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "bad", message: "Unknown step." }, { status: 400 });
}
