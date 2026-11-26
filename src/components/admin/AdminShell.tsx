"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLink, KanbanSquare, LayoutDashboard, LogOut, ShieldCheck, TriangleAlert } from "lucide-react";
import { ADMIN_IDLE_MINUTES } from "@/lib/site";
import { ToastProvider, cx } from "./kit";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/folionix", label: "Folionix progress", icon: KanbanSquare },
  { href: "/admin/security", label: "Access & security", icon: ShieldCheck },
];

const ACTIVE_KEY = "pf-admin-active";

/** Logs out after ADMIN_IDLE_MINUTES without input, counted across tabs (the server ends the session too). */
function useIdleLogout() {
  useEffect(() => {
    const limit = ADMIN_IDLE_MINUTES * 60_000;
    const last = () => Number(localStorage.getItem(ACTIVE_KEY) || Date.now());
    const logout = () => {
      fetch("/api/logout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ reason: "idle" }) })
        .catch(() => null)
        .finally(() => window.location.replace("/login?idle=1"));
    };
    // waking a laptop after a long sleep counts as idle, before the new input is counted
    if (Date.now() - last() > limit) return logout();
    let stamped = 0;
    const touch = () => {
      if (Date.now() - last() > limit) return logout();
      if (Date.now() - stamped > 5000) {
        stamped = Date.now();
        localStorage.setItem(ACTIVE_KEY, String(stamped));
      }
    };
    touch();
    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, touch, { passive: true }));
    const timer = setInterval(() => Date.now() - last() > limit && logout(), 30_000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, touch));
      clearInterval(timer);
    };
  }, []);
}

/** Shown until the starting password from Vercel has been replaced. */
function StartingPasswordBanner() {
  const [custom, setCustom] = useState(true);
  useEffect(() => {
    fetch("/api/security/status", { cache: "no-store" })
      .then((r) => r.json())
      .then((b: { password?: boolean }) => setCustom(b.password !== false))
      .catch(() => null);
  }, []);
  if (custom) return null;
  return (
    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-status-review/40 bg-attention-subtle px-4 py-3 text-[13.5px] text-fg-default">
      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-status-review" />
      <p>
        You are still using the starting password. When you have finished setting things up, choose your own in{" "}
        <Link href="/admin/security" className="font-semibold underline underline-offset-2">
          Access & security
        </Link>{" "}
        (12+ characters), then turn on two-step login.
      </p>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  useIdleLogout();
  const logout = async () => {
    await fetch("/api/logout", { method: "POST" }).catch(() => null);
    window.location.replace("/login");
  };
  return (
    <ToastProvider>
      <div className="min-h-dvh bg-canvas-subtle text-fg-default">
        <header className="sticky top-0 z-30 border-b border-border-default bg-canvas/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2.5">
            <Link href="/admin" className="mr-2 flex items-center gap-2 font-bold tracking-tight">
              <span className="grid size-7 place-items-center rounded-md bg-accent font-mono text-[11px] font-bold text-on-accent">RH</span>
              <span className="hidden font-mono text-[13px] sm:inline">console</span>
            </Link>
            <nav className="flex flex-1 gap-1 overflow-x-auto">
              {NAV.map(({ href, label, icon: Icon }) => {
                const on = href === "/admin" ? path === "/admin" || path.startsWith("/admin/sections") : path.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cx(
                      "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-semibold transition",
                      on ? "bg-accent text-on-accent" : "text-fg-muted hover:bg-canvas-subtle hover:text-fg-default",
                    )}
                  >
                    <Icon className="size-4" /> <span className="hidden sm:inline">{label}</span>
                  </Link>
                );
              })}
            </nav>
            <a href="https://ratulhasan.dev" target="_blank" rel="noreferrer" className="hidden items-center gap-1 text-[13px] font-semibold text-fg-muted hover:text-fg-default sm:flex">
              View site <ExternalLink className="size-3.5" />
            </a>
            <button onClick={logout} className="ml-1 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-semibold text-fg-muted hover:bg-canvas-subtle hover:text-fg-default">
              <LogOut className="size-4" /> <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">
          <StartingPasswordBanner />
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
