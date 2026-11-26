import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, randomInt } from "node:crypto";
import QRCode from "qrcode";
import { sameText, sha } from "./auth";
import { deleteSetting, getSetting, setSetting } from "./adminPassword";
import { alertChannels, maskedEmail, sendAlert } from "./adminEvents";
import { db, ensureSchema } from "./db";

/**
 * Two-step login: after the password, a 6-digit code - from an authenticator app (Google Authenticator, Microsoft
 * Authenticator, Authy, 1Password…; the standard TOTP of RFC 6238, 30-second codes, SHA-1), or sent by email to the
 * alert address (ALERT_EMAIL). Either or both can be on; with both, the admin picks one at each login.
 *
 * The app's secret is stored encrypted (AES-256-GCM) with a key made from SESSION_SECRET, which lives only in Vercel:
 * a copy of the database alone doesn't give the codes away. Ten one-time recovery codes (only their hashes are kept)
 * stand in for the app if the phone is lost.
 */
const STEP = 30;
const DIGITS = 6;
const RECOVERY_COUNT = 10;
const ISSUER = "RH Console";

/** SESSION_SECRET is set and long enough to protect the two-step login secret. */
export const secretReady = () => (process.env.SESSION_SECRET ?? "").length >= 32;

const key = () => createHash("sha256").update(`pf-2fa\u0000${process.env.SESSION_SECRET ?? ""}`).digest();

function seal(secret: Buffer) {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([c.update(secret), c.final()]);
  return [iv, c.getAuthTag(), enc].map((b) => b.toString("base64url")).join(".");
}

function open(sealed: string): Buffer | null {
  try {
    const [iv, tag, enc] = sealed.split(".").map((p) => Buffer.from(p, "base64url"));
    const d = createDecipheriv("aes-256-gcm", key(), iv!);
    d.setAuthTag(tag!);
    return Buffer.concat([d.update(enc!), d.final()]);
  } catch {
    return null; // SESSION_SECRET changed or missing
  }
}

const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function base32(buf: Buffer) {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}

function hotp(secret: Buffer, counter: number) {
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(counter));
  const h = createHmac("sha1", secret).update(msg).digest();
  const o = h[h.length - 1]! & 15;
  const n = (h.readUInt32BE(o) & 0x7fffffff) % 10 ** DIGITS;
  return n.toString().padStart(DIGITS, "0");
}

/** The time step a code was made in, allowing one step either side for a phone clock that is a little off; or -1. */
function matchStep(secret: Buffer, code: string, after: number) {
  const now = Math.floor(Date.now() / 1000 / STEP);
  for (const s of [now, now - 1, now + 1]) if (s > after && sameText(hotp(secret, s), code)) return s;
  return -1;
}

interface Stored {
  sealed: string;
  lastStep: number; // a code is never accepted twice
  on: string; // when it was turned on
}

const recoveryHash = (code: string) => sha(`pf-recovery:${code.toLowerCase().replace(/[^a-z0-9]/g, "")}`);
const newRecoveryCodes = () =>
  Array.from({ length: RECOVERY_COUNT }, () => {
    const s = base32(randomBytes(7)).toLowerCase().slice(0, 10);
    return `${s.slice(0, 5)}-${s.slice(5)}`;
  });

export async function twoFactorStatus() {
  const t = await getSetting<Stored>("totp");
  const e = await getSetting<{ on: string }>("email2fa");
  const r = await getSetting<{ hashes: string[] }>("recovery");
  return {
    on: !!t,
    since: t?.on ?? null,
    email: !!e,
    emailSince: e?.on ?? null,
    emailReady: alertChannels().email,
    emailTo: maskedEmail(),
    recoveryLeft: r?.hashes.length ?? 0,
    secretReady: secretReady(),
    secretWorks: t ? !!open(t.sealed) : true,
  };
}

/** The authenticator app is set up. */
export const twoFactorOn = async () => !!(await getSetting<Stored>("totp"));
/** Email codes are on. */
export const emailCodeOn = async () => !!(await getSetting<{ on: string }>("email2fa"));
/** Logging in needs a second step (an app code or an email code). */
export const secondStepOn = async () => (await twoFactorOn()) || (await emailCodeOn());

/** Starts turning it on: a new secret, shown as a QR code for the app (and as text, to type in by hand). */
export async function startSetup() {
  const secret = randomBytes(20);
  await setSetting("totp-pending", { sealed: seal(secret), at: new Date().toISOString() });
  const text = base32(secret);
  const uri = `otpauth://totp/${encodeURIComponent(`${ISSUER}:admin`)}?secret=${text}&issuer=${encodeURIComponent(ISSUER)}&algorithm=SHA1&digits=${DIGITS}&period=${STEP}`;
  return { secret: text.replace(/(.{4})/g, "$1 ").trim(), qr: await QRCode.toDataURL(uri, { margin: 1, width: 240 }) };
}

/** Finishes turning it on once the app shows the right code. Returns the recovery codes, shown only this once. */
export async function confirmSetup(code: string): Promise<string[] | null> {
  const p = await getSetting<{ sealed: string; at: string }>("totp-pending");
  if (!p || Date.now() - new Date(p.at).getTime() > 15 * 60_000) return null;
  const secret = open(p.sealed);
  if (!secret) return null;
  const step = matchStep(secret, code.replace(/\D/g, ""), 0);
  if (step < 0) return null;
  await setSetting("totp", { sealed: p.sealed, lastStep: step, on: new Date().toISOString() } satisfies Stored);
  await deleteSetting("totp-pending");
  return makeRecoveryCodes();
}

export async function makeRecoveryCodes() {
  const codes = newRecoveryCodes();
  await setSetting("recovery", { hashes: codes.map(recoveryHash) });
  return codes;
}

/** Turns the authenticator app off (the recovery codes stay while email codes are still on). */
export async function turnOff() {
  await deleteSetting("totp");
  await deleteSetting("totp-pending");
  if (!(await emailCodeOn())) await deleteSetting("recovery");
}

// ---------- email codes ----------

const EMAIL_CODE_MINUTES = 3;

/** A sent email code: only its hash is kept, with when it was sent. */
export interface EmailCode {
  hash: string;
  at: number;
}

const emailHash = (code: string) => sha(`pf-email-code:${code.replace(/\s/g, "")}`);

/** Emails a fresh 6-digit code to the alert address. Returns what to keep to check it, or null if it couldn't be sent. */
export async function sendEmailCode(why: string): Promise<EmailCode | null> {
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const sent = await sendAlert(
    `Login code ${code}`,
    [`Your RH Console code is: ${code}`, "", `It works for ${EMAIL_CODE_MINUTES} minutes, once. ${why}`, "", "If this wasn't you, someone knows your password: change it now."],
  );
  return sent ? { hash: emailHash(code), at: Date.now() } : null;
}

export const emailCodeMatches = (sent: EmailCode | null | undefined, code: string) =>
  !!sent && Date.now() - sent.at < EMAIL_CODE_MINUTES * 60_000 && /^\d{6}$/.test(code.replace(/\s/g, "")) && sameText(sent.hash, emailHash(code));

/** Email codes on. Returns new recovery codes when there weren't any yet (shown once), else null. */
export async function turnOnEmail(): Promise<string[] | null> {
  await setSetting("email2fa", { on: new Date().toISOString() });
  const r = await getSetting<{ hashes: string[] }>("recovery");
  return r?.hashes.length ? null : makeRecoveryCodes();
}

/** Email codes off (the recovery codes stay while the app is still on). */
export async function turnOffEmail() {
  await deleteSetting("email2fa");
  if (!(await twoFactorOn())) await deleteSetting("recovery");
}

/**
 * For the security settings: a code from the app, a recovery code, or the email code sent for this change (kept in
 * the settings as "email2fa-pending", used once).
 */
export async function checkSettingsCode(code: string): Promise<boolean> {
  const pending = await getSetting<EmailCode>("email2fa-pending");
  if (emailCodeMatches(pending, code)) {
    await deleteSetting("email2fa-pending");
    return true;
  }
  return !!(await checkCode(code));
}

/**
 * Checks a code from the app, or a recovery code (which then stops working). Returns which one matched, or null.
 * Changes are made in one transaction, so the same code sent twice at once can't be used twice.
 */
export async function checkCode(input: string): Promise<"app" | "recovery" | null> {
  const digits = input.replace(/\s/g, "");
  await ensureSchema();
  return db().begin(async (tx) => {
    if (/^\d{6}$/.test(digits)) {
      const [row] = await tx<{ v: Stored }[]>`select v from pf_admin_settings where k = 'totp' for update`;
      const secret = row && open(row.v.sealed);
      if (!row || !secret) return null;
      const step = matchStep(secret, digits, row.v.lastStep);
      if (step < 0) return null;
      await tx`update pf_admin_settings set v = ${tx.json({ ...row.v, lastStep: step } as never)}, updated_at = now() where k = 'totp'`;
      return "app";
    }
    const [row] = await tx<{ v: { hashes: string[] } }[]>`select v from pf_admin_settings where k = 'recovery' for update`;
    const h = recoveryHash(input);
    if (!row || input.length > 40 || !row.v.hashes.includes(h)) return null;
    await tx`update pf_admin_settings set v = ${tx.json({ hashes: row.v.hashes.filter((x) => x !== h) } as never)}, updated_at = now() where k = 'recovery'`;
    return "recovery";
  });
}
