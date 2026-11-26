import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { after } from "next/server";
import { clientIp, deviceName, sha, startSession } from "./auth";
import { db, dbEnabled, ensureSchema } from "./db";
import { HOSTS } from "@/lib/site";

/**
 * The admin login history (pf_admin_events), and alerts sent to the owner when something important happens - a login
 * from a device that never logged in before, a lockout, a password change.
 *
 * Alerts go by email through Resend (RESEND_API_KEY + ALERT_EMAIL, optionally ALERT_FROM, set in Vercel). ALERT_EMAIL
 * may list several addresses, separated by commas - each one also gets the "Forgot password" reset links.
 */
const PROD = process.env.NODE_ENV === "production";
const DEVICE_COOKIE = PROD ? "__Host-pf_device" : "pf_device";

export type EventKind =
  | "login"
  | "wrong-password"
  | "wrong-code"
  | "locked"
  | "logout"
  | "device-logged-out"
  | "password-changed"
  | "2fa-on"
  | "2fa-off"
  | "recovery-codes"
  | "passkey-added"
  | "passkey-removed"
  | "reset-requested"
  | "password-reset"
  | "session-blocked" // a session's cookie was used from another browser or country, and was ended
  | "content-changed" // a portfolio section was saved or reset
  | "published" // a new build of the site was started
  | "file-uploaded";

/** This browser's own id: a random value kept in a cookie for a year, to tell a new device from a known one. */
async function deviceId() {
  const jar = await cookies();
  let id = jar.get(DEVICE_COOKIE)?.value;
  if (!id || id.length > 64) {
    id = randomBytes(18).toString("base64url");
    jar.set(DEVICE_COOKIE, id, { httpOnly: true, secure: PROD, sameSite: "lax", path: "/", maxAge: 400 * 24 * 60 * 60 });
  }
  return sha(`device:${id}`);
}

/** Writes one line in the login history. */
export async function logEvent(req: Request, kind: EventKind, detail = "") {
  if (!dbEnabled()) return;
  try {
    await ensureSchema();
    await db()`
      insert into pf_admin_events (kind, ip, device, device_id, detail)
      values (${kind}, ${clientIp(req)}, ${deviceName(req.headers.get("user-agent") ?? "")}, ${await deviceId()}, ${detail.slice(0, 300)})`;
    await db()`delete from pf_admin_events where at < now() - interval '180 days'`;
  } catch (e) {
    console.error("couldn't log admin event", e);
  }
}

export interface AdminEvent {
  id: string;
  at: string;
  kind: EventKind;
  ip: string;
  device: string;
  detail: string;
}

export async function listEvents(limit = 60): Promise<AdminEvent[]> {
  await ensureSchema();
  return db()<AdminEvent[]>`select id, at, kind, ip, device, detail from pf_admin_events order by at desc limit ${limit}`;
}

// ---------- alerts ----------

/** The addresses in ALERT_EMAIL ("a@x.com, b@y.com"). */
const alertEmails = () =>
  (process.env.ALERT_EMAIL ?? "")
    .split(/[,;\s]+/)
    .map((e) => e.trim())
    .filter((e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e))
    .slice(0, 10);

/** "f•••••@gmail.com", to say where an email code went without showing the whole address. */
export const maskedEmail = () => {
  const e = alertEmails()[0] ?? "";
  const [name = "", domain = ""] = e.split("@");
  return e ? `${name.slice(0, 1)}${"•".repeat(Math.max(3, Math.min(8, name.length - 1)))}@${domain}` : "";
};

export const alertChannels = () => ({
  email: !!(process.env.RESEND_API_KEY && alertEmails().length),
});

const dhaka = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

/** Emails an alert to the alert address(es). Returns whether it was sent. */
export async function sendAlert(title: string, lines: string[]): Promise<boolean> {
  if (!alertChannels().email) return false;
  const text = [`🔐 ${title}`, "", ...lines, "", `Time: ${dhaka.format(new Date())} (Dhaka)`].join("\n");
  // while developing, DEV_PRINT_ALERTS=1 prints alerts in the terminal instead of sending them (never on the live site)
  if (process.env.NODE_ENV !== "production" && process.env.DEV_PRINT_ALERTS === "1") {
    console.log(`\n[alert]\n${text}\n`);
    return true;
  }
  const sent = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    body: JSON.stringify({ from: process.env.ALERT_FROM || "RH Console <onboarding@resend.dev>", to: alertEmails(), subject: `RH Console: ${title}`, text }),
    signal: AbortSignal.timeout(8000),
  })
    .then((r) => r.ok)
    .catch((e) => {
      console.error("alert failed", e);
      return false;
    });
  if (!sent) console.error(`alert "${title}" wasn't delivered - check RESEND_API_KEY, ALERT_EMAIL and the domain in Resend`);
  return sent;
}

/** Sends the alert once the response has gone, so the page isn't kept waiting. */
export function alertLater(title: string, lines: string[]) {
  after(() => sendAlert(title, lines).then(() => undefined));
}

export const whoLine = (req: Request) => `Device: ${deviceName(req.headers.get("user-agent") ?? "")}, IP ${clientIp(req)}`;
export const securityLink = () => `Check it: https://${HOSTS.admin}/admin/security`;

/**
 * Logs this device in: opens its session, writes the login in the history, and alerts the owner when this device has
 * never logged in before.
 */
export async function loggedIn(req: Request, how: string) {
  await startSession(req, how);
  const id = await deviceId();
  let known = true;
  try {
    await ensureSchema();
    [{ known }] = await db()<{ known: boolean }[]>`select exists (select 1 from pf_admin_events where kind = 'login' and device_id = ${id}) as known`;
  } catch {
    /* treat as known: no alert rather than no login */
  }
  await logEvent(req, "login", how);
  if (!known) alertLater("New device logged in", [whoLine(req), `How: ${how}`, "If this wasn't you, log it out and change your password.", securityLink()]);
}
