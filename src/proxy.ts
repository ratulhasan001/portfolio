import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, isAuthed, requestFrom } from "@/lib/server/auth";
import { HOSTS, areaOf, isAdminPath } from "@/lib/site";
import { adminPolicy, newNonce } from "@/lib/csp";

/**
 * One app, two addresses (see src/lib/site.ts):
 *   ratulhasan.dev        → the public portfolio; every admin path answers 404 there
 *   admin.ratulhasan.dev  → the admin panel: "/" shows /admin, and everything but the login needs an admin session
 * Other addresses (localhost, *.vercel.app previews) serve both, with the same login gate on the admin paths.
 *
 * Admin pages get a Content-Security-Policy with a fresh nonce (src/lib/csp.ts).
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const area = areaOf(host);
  const api = pathname.startsWith("/api/");

  if (area === "site") {
    if (/^www\./i.test(host)) return NextResponse.redirect(`https://${HOSTS.site}${pathname}${search}`, 308);
    if (isAdminPath(pathname)) return new NextResponse("Not found", { status: 404 });
    return NextResponse.next();
  }

  if (area === "admin") {
    // the admin address shows nothing of the public site
    if (pathname === "/") {
      if (await isAuthed(request.cookies.get(SESSION_COOKIE)?.value, requestFrom(request.headers)))
        return page(request, new URL(`/admin${search}`, request.url));
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (!isAdminPath(pathname)) return NextResponse.redirect(`https://${HOSTS.site}${pathname}${search}`, 308);
  } else if (!isAdminPath(pathname)) {
    return NextResponse.next(); // dev: the public site
  }

  // the login itself
  if (pathname === "/login" || pathname.startsWith("/login/") || pathname.startsWith("/api/login") || pathname === "/api/logout")
    return api ? NextResponse.next() : page(request);

  // changes may only come from the admin's own pages
  if (api && request.method !== "GET" && request.method !== "HEAD") {
    const origin = request.headers.get("origin");
    if (origin) {
      let from = "";
      try {
        from = new URL(origin).host.toLowerCase();
      } catch {
        /* not a URL */
      }
      if (from !== host.toLowerCase()) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
  }
  if (await isAuthed(request.cookies.get(SESSION_COOKIE)?.value, requestFrom(request.headers))) return api ? NextResponse.next() : page(request);

  if (api) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const url = new URL("/login", request.url);
  if (pathname !== "/admin") url.searchParams.set("next", pathname + search);
  return NextResponse.redirect(url);
}

/** An admin page, with its Content-Security-Policy (Next.js reads the nonce from the request's copy of the header). */
async function page(request: NextRequest, rewrite?: URL) {
  const policy = await adminPolicy({ nonce: newNonce(), dev: process.env.NODE_ENV === "development" });
  const headers = new Headers(request.headers);
  headers.set("content-security-policy", policy);
  const init = { request: { headers } };
  const res = rewrite ? NextResponse.rewrite(rewrite, init) : NextResponse.next(init);
  res.headers.set("Content-Security-Policy", policy);
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = {
  // skip static files, so the login page can still load them
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|webp|gif|svg|pdf|txt|ico)$).*)"],
};
