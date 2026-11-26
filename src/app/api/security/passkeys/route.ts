import { NextResponse } from "next/server";
import type { RegistrationResponseJSON } from "@simplewebauthn/server";
import { adminAuthed, clientIp } from "@/lib/server/auth";
import { alertLater, logEvent, securityLink, whoLine } from "@/lib/server/adminEvents";
import { verifyAdminPassword } from "@/lib/server/adminPassword";
import { startAttempt, wrongMessage } from "@/lib/server/loginGuard";
import { addOptions, addVerify, listPasskeys, relyingParty, removePasskey, renamePasskey } from "@/lib/server/passkeys";
import { dbEnabled } from "@/lib/server/db";

export const dynamic = "force-dynamic";

const bad = (message: string, status = 400) => NextResponse.json({ error: "bad", message }, { status });

export async function GET(req: Request) {
  if (!(await adminAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!dbEnabled()) return NextResponse.json({ passkeys: [], supported: false });
  return NextResponse.json({ passkeys: await listPasskeys(), supported: !!relyingParty(req) });
}

/**
 * Adds a passkey for this device.
 * { step: "options", password } → what the browser needs to make one (the password is asked again first)
 * { step: "verify", token, response, name } → keeps it
 */
export async function POST(req: Request) {
  if (!(await adminAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!dbEnabled()) return bad("Needs the database.");
  const rp = relyingParty(req);
  if (!rp) return bad("Passkeys only work on the admin address.");
  const body = (await req.json().catch(() => null)) as { step?: unknown; password?: unknown; token?: unknown; response?: unknown; name?: unknown } | null;

  if (body?.step === "options") {
    const attempt = await startAttempt(clientIp(req));
    if (!attempt.ok) return bad(attempt.message, 429);
    if (!(await verifyAdminPassword(typeof body.password === "string" ? body.password : ""))) {
      const lockedFor = await attempt.failed();
      await logEvent(req, "wrong-password", "while adding a passkey");
      return bad(wrongMessage("Your password is wrong.", lockedFor));
    }
    await attempt.passed();
    return NextResponse.json({ ok: true, ...(await addOptions(rp)) });
  }
  if (body?.step === "verify" && body.response && typeof body.response === "object") {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!(await addVerify(rp, body.token, body.response as RegistrationResponseJSON, name))) return bad("The passkey couldn't be added. Try again.");
    await logEvent(req, "passkey-added", name);
    alertLater("Passkey added", [whoLine(req), `Name: ${name || "Passkey"}`, "It can log in to the admin panel on its own.", securityLink()]);
    return NextResponse.json({ ok: true });
  }
  return bad("Unknown step.");
}

/** Renames a passkey: { id, name }. */
export async function PATCH(req: Request) {
  if (!(await adminAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { id?: unknown; name?: unknown } | null;
  if (typeof body?.id !== "string" || typeof body.name !== "string") return bad("Bad request.");
  await renamePasskey(body.id, body.name.trim());
  return NextResponse.json({ ok: true });
}

/** Removes a passkey: { id }. */
export async function DELETE(req: Request) {
  if (!(await adminAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { id?: unknown } | null;
  if (typeof body?.id !== "string") return bad("Bad request.");
  const name = await removePasskey(body.id);
  if (name !== null) await logEvent(req, "passkey-removed", name);
  return NextResponse.json({ ok: true });
}
