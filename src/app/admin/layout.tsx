import type { Metadata } from "next";
import { connection } from "next/server";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = { title: "RH Console", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // rendered per request, so Next.js can put this page view's CSP nonce on its scripts (see src/proxy.ts)
  await connection();
  return <AdminShell>{children}</AdminShell>;
}
