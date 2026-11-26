import type { Metadata } from "next";
import { connection } from "next/server";

export const metadata: Metadata = { title: "Sign in · RH Console", robots: { index: false, follow: false } };

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  await connection(); // per request, for the CSP nonce (see src/proxy.ts)
  return children;
}
