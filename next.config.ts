import type { NextConfig } from "next";

const ADMIN_HOST = "admin.ratulhasan.dev";
// Files uploaded from the admin panel (Cloudflare R2), shown as images, PDFs and links on the site.
const FILES = new URL(process.env.NEXT_PUBLIC_FILES_BASE || "https://files.ratulhasan.dev").origin;

const isDev = process.env.NODE_ENV === "development";

// The site is fully static, so the policy uses no nonces: Next's inline
// hydration scripts and the theme and JSON-LD scripts need 'unsafe-inline',
// and nothing on the site takes user input that could be injected. Framing is
// limited to the site itself because /cv embeds the CV PDF in an iframe.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${FILES}`,
  "font-src 'self'",
  `connect-src 'self' ${FILES}`,
  `frame-src 'self' ${FILES}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // logos and photos uploaded from the admin panel are served from R2's public domain
  images: {
    remotePatterns: [{ protocol: "https", hostname: new URL(FILES).hostname, pathname: "/**" }],
  },
  turbopack: {
    root: __dirname,
  },
  // the files moved to R2: links shared before the move keep working
  async redirects() {
    return [
      { source: "/Ratul_Hasan_CV.pdf", destination: `${FILES}/Ratul_Hasan_CV.pdf`, permanent: true },
      { source: "/ratul-hasan.jpg", destination: `${FILES}/ratul-hasan.jpg`, permanent: true },
      { source: "/certificates/:file", destination: `${FILES}/certificates/:file`, permanent: true },
      { source: "/logo/:file", destination: `${FILES}/logo/:file`, permanent: true },
    ];
  },
  async headers() {
    return [
      // The admin panel (admin.ratulhasan.dev, or /admin, /login and the APIs on other addresses) gets its own,
      // stricter policy with nonces from src/proxy.ts, so this one stays off it.
      {
        source: "/((?!admin(?:/|$)|login(?:/|$)|api/).*)",
        missing: [{ type: "host", value: ADMIN_HOST }],
        headers: securityHeaders,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: ADMIN_HOST }],
        headers: securityHeaders.filter((h) => h.key !== "Content-Security-Policy"),
      },
      // Chrome's PDF viewer counts as a plugin, so `object-src 'none'` leaves
      // the CV and certificates blank. PDFs keep only the framing rule.
      {
        source: "/(.*)\\.pdf",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
