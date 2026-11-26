import { createHash } from "node:crypto";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
  type AuthenticationResponseJSON,
  type RegistrationResponseJSON,
} from "@simplewebauthn/server";
import { db, ensureSchema } from "./db";
import { issueToken, spendToken } from "./adminTokens";
import { HOSTS } from "@/lib/site";

/**
 * Passkeys: log in with the phone's or laptop's fingerprint, face or screen lock (WebAuthn). The device keeps the
 * private key; only the public key is stored here (pf_admin_passkeys). A passkey only works on the address it was
 * made on, so a look-alike site can't use it - it can't be phished. User verification (fingerprint, face or PIN) is
 * required, so a passkey stands in for both the password and the two-step code.
 */
const USER_ID = new Uint8Array(createHash("sha256").update("ratulhasan-portfolio-admin").digest().subarray(0, 16));

/** The address passkeys belong to: the admin address on the live site, or localhost while developing. */
export function relyingParty(req: Request): { rpID: string; origin: string } | null {
  const host = (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "").toLowerCase();
  const name = host.split(":")[0]!;
  if (name === HOSTS.admin) return { rpID: name, origin: `https://${host}` };
  if (name === "localhost" && process.env.NODE_ENV !== "production") return { rpID: "localhost", origin: `http://${host}` };
  return null;
}

export interface Passkey {
  id: string;
  name: string;
  created_at: string;
  last_used: string | null;
}

interface Row {
  id: string;
  public_key: Uint8Array;
  counter: string | number;
  transports: string[] | null;
}

export async function listPasskeys(): Promise<Passkey[]> {
  await ensureSchema();
  return db()<Passkey[]>`select id, name, created_at, last_used from pf_admin_passkeys order by created_at`;
}

export async function hasPasskeys() {
  await ensureSchema();
  const [{ n }] = await db()<{ n: number }[]>`select count(*)::int as n from pf_admin_passkeys`;
  return n > 0;
}

/** Step 1 of adding a passkey: what the browser needs to make one. */
export async function addOptions(rp: { rpID: string }) {
  await ensureSchema();
  const existing = await db()<{ id: string; transports: string[] | null }[]>`select id, transports from pf_admin_passkeys`;
  const options = await generateRegistrationOptions({
    rpName: "RH Console",
    rpID: rp.rpID,
    userID: USER_ID,
    userName: "admin",
    userDisplayName: "RH Console",
    attestationType: "none",
    excludeCredentials: existing.map((c) => ({ id: c.id, transports: c.transports ?? undefined })), // one passkey per device
    authenticatorSelection: { residentKey: "required", userVerification: "required" },
  });
  return { options, token: await issueToken("passkey-add", 5, { challenge: options.challenge }) };
}

/** Step 2 of adding a passkey: checks what the device made, and keeps its public key. */
export async function addVerify(rp: { rpID: string; origin: string }, token: unknown, response: RegistrationResponseJSON, name: string) {
  const t = await spendToken<{ challenge: string }>("passkey-add", token);
  if (!t) return false;
  const v = await verifyRegistrationResponse({ response, expectedChallenge: t.challenge, expectedOrigin: rp.origin, expectedRPID: rp.rpID, requireUserVerification: true }).catch(() => null);
  if (!v?.verified) return false;
  const c = v.registrationInfo.credential;
  await db()`
    insert into pf_admin_passkeys (id, public_key, counter, transports, name)
    values (${c.id}, ${Buffer.from(c.publicKey)}, ${c.counter}, ${db().json((c.transports ?? []) as never)}, ${name.slice(0, 60) || "Passkey"})`;
  return true;
}

/** Step 1 of logging in with a passkey. Any of the admin's passkeys may answer, so no list is sent. */
export async function loginOptions(rp: { rpID: string }) {
  const options = await generateAuthenticationOptions({ rpID: rp.rpID, userVerification: "required" });
  return { options, token: await issueToken("passkey-login", 5, { challenge: options.challenge }) };
}

/** Step 2: checks the device's signature. Returns the passkey's name when it is one of the admin's. */
export async function loginVerify(rp: { rpID: string; origin: string }, token: unknown, response: AuthenticationResponseJSON): Promise<string | null> {
  const t = await spendToken<{ challenge: string }>("passkey-login", token);
  if (!t || typeof response?.id !== "string") return null;
  await ensureSchema();
  const [row] = await db()<(Row & { name: string })[]>`select id, public_key, counter, transports, name from pf_admin_passkeys where id = ${response.id}`;
  if (!row) return null;
  const v = await verifyAuthenticationResponse({
    response,
    expectedChallenge: t.challenge,
    expectedOrigin: rp.origin,
    expectedRPID: rp.rpID,
    requireUserVerification: true,
    credential: { id: row.id, publicKey: new Uint8Array(row.public_key), counter: Number(row.counter), transports: row.transports ?? undefined },
  }).catch(() => null);
  if (!v?.verified) return null;
  await db()`update pf_admin_passkeys set counter = ${v.authenticationInfo.newCounter}, last_used = now() where id = ${row.id}`;
  return row.name;
}

export async function removePasskey(id: string) {
  const [row] = await db()<{ name: string }[]>`delete from pf_admin_passkeys where id = ${id} returning name`;
  return row?.name ?? null;
}

export async function renamePasskey(id: string, name: string) {
  await db()`update pf_admin_passkeys set name = ${name.slice(0, 60) || "Passkey"} where id = ${id}`;
}
