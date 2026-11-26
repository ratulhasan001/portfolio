import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { ADMIN_IDLE_MINUTES, HOSTS } from "@/lib/site";
import { db, dbEnabled, ensureSchema } from "./db";

/**
 * Admin login sessions. Each login gets its own random token, kept in an httpOnly cookie on that device; only a hash
 * of it is stored (pf_admin_sessions), so one device can be logged out on its own and a database copy can't be used
 * to log in. A session ends 2 hours after the login, however busy it is - or sooner, after IDLE_MINUTES without a single
 * request. It also only works in the browser and country it logged in from: a cookie copied elsewhere ends it.
 */
const PROD = process.env.NODE_ENV === "production";
/** `__Host-`: the browser only accepts it over https, for this exact address, from the whole site's root. */
export const SESSION_COOKIE = PROD ? "__Host-pf_admin" : "pf_admin";
/** The cookie of the old one-for-every-device login, cleared on the next login or logout. */
export const OLD_SESSION_COOKIE = "pf_session";
/** How long a login lasts, however busy it is (the user's choice, 2026-11-20: "keep it 2 hours", then log in again). */
export const SESSION_HOURS = 2;
/** A session ends after this long without any request from it (the admin panel also logs itself out after this long
 *  without the admin touching it - see src/components/admin/AdminShell.tsx). */
export const IDLE_MINUTES = ADMIN_IDLE_MINUTES;

/**
 * Login is on when APP_PASSWORD is set (Vercel → Settings → Environment Variables), and always on the live site: if
 * the variable ever goes missing there, nobody gets in rather than everybody.
 */
export const authEnabled = () => !!process.env.APP_PASSWORD || PROD;

export const sha = (s: string) => createHash("sha256").update(s).digest("hex");
export const sameText = (a: string, b: string) => timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());

export const clientIp = (req: Request) => req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

/** "Chrome on Mac", "Safari on iPhone"… for the devices list and login history. */
export function deviceName(ua: string) {
  const os = /iPhone/.test(ua) ? "iPhone" : /iPad/.test(ua) ? "iPad" : /Android/.test(ua) ? "Android" : /Mac OS X|Macintosh/.test(ua) ? "Mac" : /Windows/.test(ua) ? "Windows" : /CrOS/.test(ua) ? "Chromebook" : /Linux/.test(ua) ? "Linux" : "";
  const browser = /Edg\//.test(ua) ? "Edge" : /OPR\/|Opera/.test(ua) ? "Opera" : /SamsungBrowser/.test(ua) ? "Samsung Internet" : /Firefox\/|FxiOS/.test(ua) ? "Firefox" : /Chrome\/|CriOS/.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "";
  return [browser || "Browser", os && `on ${os}`].filter(Boolean).join(" ");
}

/** Where a request comes from: its browser, country (from Vercel; "" elsewhere) and address. */
export interface RequestFrom {
  ua: string;
  country: string;
  ip: string;
}
export const requestFrom = (h: Headers): RequestFrom => ({
  ua: h.get("user-agent") ?? "",
  country: (h.get("x-vercel-ip-country") ?? "").toUpperCase().slice(0, 2),
  ip: h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown",
});

interface Seen {
  until: number;
  checked: number;
  device: string; // "Chrome on Mac": the browser and system it logged in from
  country: string; // where it logged in from ("" when unknown)
}
// A page load asks for several files at once; a session checked a moment ago isn't looked up again for 15 seconds
// (its browser and country are still checked every time). Logging a device out clears it here at once, and on other
// server instances within those 15 seconds.
const g = globalThis as unknown as { __pfSessions?: Map<string, Seen> };
const seen = (g.__pfSessions ??= new Map());
const RECHECK_MS = 15_000;

/**
 * A different browser or system, or another country, than the session logged in from: its cookie has been copied
 * (malware, a stolen laptop's files…). Normal changes of internet address, as on mobile data, don't count.
 */
const moved = (s: Seen, from: RequestFrom) => (!!s.device && deviceName(from.ua) !== s.device) || (!!s.country && !!from.country && s.country !== from.country);

/** Ends a session whose cookie turned up somewhere else, writes it in the login history and tells the owner. */
async function endMovedSession(key: string, s: Seen, from: RequestFrom) {
  seen.delete(key);
  const where = (device: string, country: string) => `${device}${country ? ` in ${country}` : ""}`;
  const detail = `logged in on ${where(s.device, s.country)}, used from ${where(deviceName(from.ua), from.country)}`;
  try {
    await db()`delete from pf_admin_sessions where token_hash = ${key}`;
    await db()`insert into pf_admin_events (kind, ip, device, detail) values ('session-blocked', ${from.ip}, ${deviceName(from.ua)}, ${detail})`;
    const { sendAlert } = await import("./adminEvents"); // (adminEvents imports this file)
    await sendAlert("Login used from another browser or country", [
      `A logged-in admin session was used from somewhere else, so it was logged out at once.`,
      `Logged in on: ${where(s.device, s.country)}`,
      `Used from: ${where(deviceName(from.ua), from.country)}, IP ${from.ip}`,
      "If that was you (a VPN, or another browser), just log in again. If not, someone copied your login: change your password.",
      `Check it: https://${HOSTS.admin}/admin/security`,
    ]);
  } catch (e) {
    console.error("ending a moved session failed", e);
  }
  return false;
}

/** Whether this cookie value belongs to a session that is still open, and is used where it logged in. */
export async function isAuthed(token: string | undefined, from: RequestFrom): Promise<boolean> {
  if (!authEnabled()) return true;
  if (!token || token.length > 100 || !dbEnabled()) return false;
  const key = sha(token);
  const now = Date.now();
  const hit = seen.get(key);
  if (hit && now < hit.until && now - hit.checked < RECHECK_MS) return moved(hit, from) ? endMovedSession(key, hit, from) : true;
  try {
    await ensureSchema();
    const [row] = await db()<{ expires_at: Date; device: string; country: string }[]>`
      update pf_admin_sessions set last_seen = now()
      where token_hash = ${key} and expires_at > now() and last_seen > now() - make_interval(mins => ${IDLE_MINUTES})
      returning expires_at, device, country`;
    if (!row) {
      seen.delete(key);
      return false;
    }
    const s: Seen = { until: row.expires_at.getTime(), checked: now, device: row.device, country: row.country };
    if (moved(s, from)) return endMovedSession(key, s, from);
    if (seen.size > 500) seen.clear();
    seen.set(key, s);
    return true;
  } catch (e) {
    console.error("session check failed", e);
    return false;
  }
}

/** For API routes: is the request from a logged-in admin? */
export async function adminAuthed() {
  return isAuthed((await cookies()).get(SESSION_COOKIE)?.value, requestFrom(await headers()));
}

/** The session behind this request's cookie (its id, for "this device" in the devices list). */
export async function currentSessionId(): Promise<string | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !dbEnabled()) return null;
  const [row] = await db()<{ id: string }[]>`
    select id from pf_admin_sessions
    where token_hash = ${sha(token)} and expires_at > now() and last_seen > now() - make_interval(mins => ${IDLE_MINUTES})`;
  return row?.id ?? null;
}

export interface SessionInfo {
  id: string;
  device: string;
  ip: string;
  how: string;
  created_at: string;
  last_seen: string;
  expires_at: string;
}

/** Opens a session for this device and sets its cookie. `how` says how it logged in (password, passkey…). */
export async function startSession(req: Request, how: string) {
  const token = randomBytes(32).toString("base64url");
  const ua = req.headers.get("user-agent") ?? "";
  await ensureSchema();
  await db()`
    insert into pf_admin_sessions (token_hash, id, device, ip, ua, how, country, expires_at)
    values (${sha(token)}, ${randomBytes(9).toString("base64url")}, ${deviceName(ua)}, ${clientIp(req)}, ${ua.slice(0, 300)}, ${how},
            ${requestFrom(req.headers).country}, now() + make_interval(hours => ${SESSION_HOURS}))`;
  await db()`delete from pf_admin_sessions where expires_at < now() - interval '1 day'`;
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, { httpOnly: true, secure: PROD, sameSite: "strict", path: "/", maxAge: SESSION_HOURS * 60 * 60 });
  jar.delete(OLD_SESSION_COOKIE);
}

/** Logs this device out. */
export async function endSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    seen.delete(sha(token));
    if (dbEnabled()) await db()`delete from pf_admin_sessions where token_hash = ${sha(token)}`.catch(() => null);
  }
  jar.delete(SESSION_COOKIE);
  jar.delete(OLD_SESSION_COOKIE);
}

/** The devices logged in right now, newest first. */
export async function listSessions(): Promise<SessionInfo[]> {
  return db()<SessionInfo[]>`
    select id, device, ip, how, created_at, last_seen, expires_at from pf_admin_sessions
    where expires_at > now() and last_seen > now() - make_interval(mins => ${IDLE_MINUTES}) order by created_at desc`;
}

/** Logs out one device by its id, or every device but this one (`except`), or every device. */
export async function endSessions(opts: { id?: string; except?: string | null }) {
  if (opts.id) await db()`delete from pf_admin_sessions where id = ${opts.id}`;
  else if (opts.except) await db()`delete from pf_admin_sessions where id <> ${opts.except}`;
  else await db()`delete from pf_admin_sessions`;
  seen.clear();
}
