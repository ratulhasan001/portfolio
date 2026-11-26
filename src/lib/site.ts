/**
 * The site's addresses. One Next.js app serves both:
 *   ratulhasan.dev        → the public portfolio
 *   admin.ratulhasan.dev  → the admin panel (behind the admin login)
 * Any other address (localhost, a *.vercel.app preview) is "dev" and serves both: the portfolio at /, the admin
 * panel at /admin, /login and /settings/security.
 */
export const DOMAIN = "ratulhasan.dev";
export const HOSTS = { site: DOMAIN, admin: `admin.${DOMAIN}` } as const;
/** Uploaded files (certificates, logos, photos) in Cloudflare R2, served through this public custom domain. */
export const FILES_BASE = process.env.NEXT_PUBLIC_FILES_BASE || `https://files.${DOMAIN}`;

/** The admin panel logs itself out after this long without use (the server ends the session too). */
export const ADMIN_IDLE_MINUTES = 30;

export type Area = "site" | "admin" | "dev";

export function areaOf(host: string | null | undefined): Area {
  const h = (host ?? "").split(":")[0]!.toLowerCase();
  if (h === HOSTS.admin) return "admin";
  if (h === HOSTS.site || h === `www.${HOSTS.site}`) return "site";
  return "dev";
}

/** Paths that belong to the admin panel; the public address answers 404 for them. */
export const isAdminPath = (p: string) =>
  p === "/admin" ||
  p.startsWith("/admin/") ||
  p === "/login" ||
  p.startsWith("/login/") ||
  p === "/settings" ||
  p.startsWith("/settings/") ||
  p.startsWith("/api/admin/") ||
  p.startsWith("/api/login") ||
  p === "/api/logout" ||
  p.startsWith("/api/security/");
