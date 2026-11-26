import { db, dbEnabled, ensureSchema } from "./db";

/**
 * Stops password guessing at the RH Console login.
 *
 * - Cloudflare Turnstile ("Verify you are human") on every login attempt, once TURNSTILE_SITE_KEY and
 *   TURNSTILE_SECRET_KEY are set in Vercel.
 * - Lockouts that grow: a device that gets 5 wrong in a row (within a day) waits 15 minutes, then every further wrong
 *   try doubles the wait (30 min, 1 h, 2 h…, at most a day). A right password clears its count.
 * - Everyone together gets 30 wrong tries an hour, so many devices guessing at once are stopped too.
 */
const FREE_TRIES = 5;
const FIRST_LOCK_MIN = 15;
const MAX_LOCK_MIN = 24 * 60;

/** Only the admin login is guarded here; everyone together gets 30 wrong tries an hour. */
export type GuardScope = "admin";
const ALL_PER_HOUR: Record<GuardScope, number> = { admin: 30 };

export const turnstileSiteKey = () => (process.env.TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY ? process.env.TURNSTILE_SITE_KEY : "");

/** Asks Cloudflare whether the "Verify you are human" check on the login page was passed (true when it isn't set up). */
export async function humanCheck(token: unknown, ip: string, host: string, action: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!turnstileSiteKey() || !secret) return true;
  if (typeof token !== "string" || !token || token.length > 2048) return false;
  const form = new URLSearchParams({ secret, response: token });
  if (ip !== "unknown") form.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form, signal: AbortSignal.timeout(8000) });
    const b = (await res.json()) as { success?: boolean; hostname?: string; action?: string; metadata?: { result_with_testing_key?: boolean } };
    if (!b.success) return false;
    if (b.metadata?.result_with_testing_key) return true; // Cloudflare's test keys, for trying it out
    return b.hostname === host.split(":")[0] && b.action === action; // a token made for this page, on this address
  } catch (e) {
    console.error("Turnstile check failed", e);
    return false;
  }
}

/** Minutes a device must wait after `n` wrong tries in a row. */
const lockMinutes = (n: number) => (n < FREE_TRIES ? 0 : Math.min(MAX_LOCK_MIN, FIRST_LOCK_MIN * 2 ** (n - FREE_TRIES)));

const waitText = (min: number) => (min >= 120 ? `${Math.ceil(min / 60)} hours` : min >= 60 ? "an hour" : `${Math.max(1, Math.ceil(min))} minutes`);

export type Attempt =
  | { ok: false; status: number; message: string; lockedFor: number }
  | {
      ok: true;
      /** The password (or code) was right: this device's wrong tries are forgiven. */
      passed: () => Promise<void>;
      /** It was wrong. Returns how long the device is now locked for, in minutes (0 = not locked). */
      failed: () => Promise<number>;
      /** Neither (the request was refused before checking): the try doesn't count. */
      cancel: () => Promise<void>;
    };

/**
 * Call before checking a password or code. The try is written down first (as if wrong), so many guesses sent at once
 * can't all slip under the limit; `passed` or `cancel` take it back.
 */
export async function startAttempt(ip: string, scope: GuardScope = "admin"): Promise<Attempt> {
  const noop = async () => {};
  if (!dbEnabled()) return { ok: true, passed: noop, failed: async () => 0, cancel: noop };
  try {
    await ensureSchema();
    const [{ id }] = await db()<{ id: string }[]>`insert into pf_login_fails (ip, scope) values (${ip}, ${scope}) returning id`;
    const [{ mine, last, total }] = await db()<{ mine: number; last: Date | null; total: number }[]>`
      select count(*) filter (where ip = ${ip} and id <> ${id} and at > now() - interval '1 day')::int as mine,
             max(at) filter (where ip = ${ip} and id <> ${id} and at > now() - interval '1 day') as last,
             count(*) filter (where at > now() - interval '1 hour')::int as total
      from pf_login_fails where scope = ${scope}`;
    const cancel = async () => void (await db()`delete from pf_login_fails where id = ${id}`.catch(() => null));
    const left = last ? lockMinutes(mine) - (Date.now() - last.getTime()) / 60_000 : 0;
    if (left > 0) {
      await cancel(); // waiting it out mustn't make the wait longer
      return { ok: false, status: 429, lockedFor: left, message: `Too many wrong tries. Try again in ${waitText(left)}.` };
    }
    if (total > ALL_PER_HOUR[scope]) {
      await cancel();
      return { ok: false, status: 429, lockedFor: 60, message: "Login is paused for a while after many wrong tries. Try again later, or use a passkey." };
    }
    return {
      ok: true,
      cancel,
      passed: async () => void (await db()`delete from pf_login_fails where (ip = ${ip} and scope = ${scope}) or at < now() - interval '2 days'`.catch(() => null)),
      failed: async () => lockMinutes(mine + 1),
    };
  } catch (e) {
    console.error("login limit check failed", e); // never lock the owner out because the database blinked
    return { ok: true, passed: noop, failed: async () => 0, cancel: noop };
  }
}

/** The message after a wrong try: how many are left before a lockout, or how long the lockout is. */
export function wrongMessage(what: string, lockedFor: number, triesLeft?: number) {
  if (lockedFor > 0) return `${what} Too many wrong tries - wait ${waitText(lockedFor)} before trying again.`;
  return triesLeft !== undefined && triesLeft <= 2 ? `${what} ${triesLeft} ${triesLeft === 1 ? "try" : "tries"} left before a lockout.` : what;
}

/** How many wrong tries this device has left before it is locked out. */
export async function triesLeft(ip: string, scope: GuardScope = "admin") {
  if (!dbEnabled()) return FREE_TRIES;
  const [{ n }] = await db()<{ n: number }[]>`select count(*)::int as n from pf_login_fails where ip = ${ip} and scope = ${scope} and at > now() - interval '1 day'`;
  return Math.max(0, FREE_TRIES - n);
}
