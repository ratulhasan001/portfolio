import { FILES_BASE } from "./site";
import { forceVisibleScript, themeInitScript } from "./inline-scripts";

/**
 * The admin panel's Content-Security-Policy, sent by src/proxy.ts with a fresh nonce for every page view: the browser
 * runs only the scripts this view's nonce allows (Next.js puts it on its own scripts), the ones they load, and the
 * two inline <head> scripts by their hashes. Script injected through saved content can't run.
 *
 * The public site keeps its own static policy (next.config.ts): it is fully static, so it can't carry nonces.
 */
let hashes: Promise<string[]> | null = null;
const inlineHashes = () =>
  (hashes ??= Promise.all(
    [themeInitScript, forceVisibleScript].map((s) =>
      crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)).then((b) => `'sha256-${btoa(String.fromCharCode(...new Uint8Array(b)))}'`),
    ),
  ));

/** A fresh, unguessable nonce for one page view. */
export function newNonce() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

const TURNSTILE = "https://challenges.cloudflare.com"; // Cloudflare's "verify you are human" box on the login page
const FILES = new URL(FILES_BASE).origin; // uploaded files: previews of images and PDFs

export async function adminPolicy(o: { nonce: string; dev: boolean }) {
  const rules: Record<string, (string | false)[]> = {
    "default-src": ["'self'"],
    // 'strict-dynamic': scripts the allowed ones add (page chunks, the Turnstile script) may run too; 'self' and the
    // Turnstile address are fallbacks for browsers without 'strict-dynamic'
    "script-src": ["'self'", `'nonce-${o.nonce}'`, ...(await inlineHashes()), "'strict-dynamic'", TURNSTILE, o.dev && "'unsafe-eval'"],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:", FILES],
    "font-src": ["'self'", "data:"],
    "connect-src": ["'self'", TURNSTILE],
    "frame-src": ["'self'", TURNSTILE, FILES],
    "object-src": ["'none'"],
    "base-uri": ["'none'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };
  return Object.entries(rules)
    .map(([k, v]) => [k, ...v.filter(Boolean)].join(" "))
    .join("; ");
}
