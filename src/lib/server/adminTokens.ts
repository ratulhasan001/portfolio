import { randomBytes } from "node:crypto";
import { sha } from "./auth";
import { db, ensureSchema } from "./db";

/**
 * Short-lived, one-time admin tokens (pf_admin_tokens): the step between a right password and the two-step code,
 * password-reset links, passkey challenges. Only a hash of each token is stored.
 */
export type TokenKind = "mfa" | "setpw" | "reset" | "passkey-login" | "passkey-add";

export async function issueToken(kind: TokenKind, minutes: number, data: Record<string, unknown> = {}) {
  const token = randomBytes(32).toString("base64url");
  await ensureSchema();
  await db()`
    insert into pf_admin_tokens (token_hash, kind, data, expires_at)
    values (${sha(token)}, ${kind}, ${db().json(data as never)}, now() + make_interval(mins => ${minutes}))`;
  await db()`delete from pf_admin_tokens where expires_at < now()`;
  return token;
}

/** The token's data while it is still valid, without using it up. */
export async function peekToken<T = Record<string, unknown>>(kind: TokenKind, token: unknown): Promise<T | null> {
  if (typeof token !== "string" || !token || token.length > 100) return null;
  await ensureSchema();
  const [row] = await db()<{ data: T }[]>`select data from pf_admin_tokens where token_hash = ${sha(token)} and kind = ${kind} and expires_at > now()`;
  return row?.data ?? null;
}

export async function updateToken(kind: TokenKind, token: string, data: Record<string, unknown>) {
  await db()`update pf_admin_tokens set data = ${db().json(data as never)} where token_hash = ${sha(token)} and kind = ${kind}`;
}

/** Uses the token up: returns its data if it was still valid (only one request ever gets it). */
export async function spendToken<T = Record<string, unknown>>(kind: TokenKind, token: unknown): Promise<T | null> {
  if (typeof token !== "string" || !token || token.length > 100) return null;
  await ensureSchema();
  const [row] = await db()<{ data: T }[]>`
    delete from pf_admin_tokens where token_hash = ${sha(token)} and kind = ${kind} and expires_at > now() returning data`;
  return row?.data ?? null;
}

/** Ends every token of a kind (all reset links, once the password has been reset). */
export async function dropTokens(kind: TokenKind) {
  await db()`delete from pf_admin_tokens where kind = ${kind}`;
}
