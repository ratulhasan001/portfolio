import { checkPassword as matchesHash, hashPassword } from "./password";
import { sameText } from "./auth";
import { db, dbEnabled, ensureSchema } from "./db";

/**
 * The admin password. Until one is set in Access & security, it is APP_PASSWORD from Vercel. Once set, only its scrypt
 * hash is kept (pf_admin_settings, never sent to a browser), together with a hash of the APP_PASSWORD it replaced:
 * changing APP_PASSWORD in Vercel later puts the login back on that password - the way back in for whoever runs the
 * site if the admin password is forgotten and no reset message can be sent.
 */
export const PASSWORD_MIN = 12;

/** The one address that can log in (ADMIN_EMAIL in Vercel, or the owner's address). */
export const adminEmail = () => (process.env.ADMIN_EMAIL || "ratul@ratulhasan.dev").trim().toLowerCase();

/** Whether this is the admin's email, compared in constant time (any case, surrounding spaces ignored). */
export function adminEmailMatches(input: unknown) {
  if (typeof input !== "string" || input.length > 200) return false;
  return sameText(input.trim().toLowerCase(), adminEmail());
}

export async function getSetting<T>(k: string): Promise<T | null> {
  if (!dbEnabled()) return null;
  await ensureSchema();
  const [row] = await db()<{ v: T }[]>`select v from pf_admin_settings where k = ${k}`;
  return row?.v ?? null;
}

export async function setSetting(k: string, v: unknown) {
  await ensureSchema();
  await db()`
    insert into pf_admin_settings (k, v, updated_at) values (${k}, ${db().json(v as never)}, now())
    on conflict (k) do update set v = excluded.v, updated_at = now()`;
}

export async function deleteSetting(k: string) {
  await ensureSchema();
  await db()`delete from pf_admin_settings where k = ${k}`;
}

interface StoredPassword {
  hash: string;
  env: string; // hash of APP_PASSWORD when this one was set
  at: string;
}

const g = globalThis as unknown as { __pfEnvMark?: Map<string, boolean> };
const envChecks = (g.__pfEnvMark ??= new Map());

/** The password set in Access & security, unless APP_PASSWORD has been changed in Vercel since. */
async function stored(): Promise<StoredPassword | null> {
  const p = await getSetting<StoredPassword>("password");
  if (!p?.hash) return null;
  let same = envChecks.get(p.env);
  if (same === undefined) {
    same = await matchesHash(process.env.APP_PASSWORD ?? "", p.env);
    envChecks.set(p.env, same);
  }
  return same ? p : null;
}

export async function verifyAdminPassword(input: string) {
  if (!input || input.length > 200) return false;
  const p = await stored();
  if (p) return matchesHash(input, p.hash);
  const env = process.env.APP_PASSWORD ?? "";
  return !!env && sameText(input, env);
}

/** Whether a password of the admin's own is in use, and since when. */
export async function passwordStatus() {
  const p = await stored();
  return { custom: !!p, changedAt: p?.at ?? null, minLength: PASSWORD_MIN };
}

/** Why this password can't be used, or null when it is fine. */
export function passwordProblem(pw: string) {
  if (pw.length < PASSWORD_MIN) return `Use at least ${PASSWORD_MIN} characters. A short sentence of 4 or 5 words works well.`;
  if (pw.length > 200) return "That's too long. Use 200 characters or fewer.";
  if (/^(.)\1+$/.test(pw) || /^(0123456789|1234567890|abcdefghij)/i.test(pw)) return "That's too easy to guess. Try a short sentence instead.";
  if (new Set(pw).size < 5) return "Use more different characters - a short sentence works well.";
  return null;
}

export async function setAdminPassword(pw: string) {
  await setSetting("password", { hash: await hashPassword(pw), env: await hashPassword(process.env.APP_PASSWORD ?? ""), at: new Date().toISOString() } satisfies StoredPassword);
  envChecks.clear();
}
