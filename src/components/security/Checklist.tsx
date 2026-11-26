"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CircleDashed, ListChecks } from "lucide-react";
import { Card, SectionTitle, cx } from "@/components/admin/kit";
import { api } from "./shared";

type Status = Record<"password" | "twoFactor" | "passkey" | "sessionSecret" | "turnstile" | "alerts", boolean>;

const ITEMS: { key: keyof Status; title: string; todo: string; vercel?: boolean }[] = [
  { key: "password", title: "A long password of your own", todo: "Set one below - at least 12 characters." },
  { key: "sessionSecret", title: "SESSION_SECRET in Vercel", todo: "Needed for two-step login. See the steps in “Two-step login”.", vercel: true },
  { key: "twoFactor", title: "Two-step login", todo: "Turn it on below, with an authenticator app on your phone." },
  { key: "passkey", title: "A passkey", todo: "Add one for each phone or computer you log in from." },
  { key: "turnstile", title: "Cloudflare “Verify you are human”", todo: "In Cloudflare → Turnstile, add a widget for admin.ratulhasan.dev, then add TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY in Vercel.", vercel: true },
  { key: "alerts", title: "Security alerts", todo: "Add RESEND_API_KEY and ALERT_EMAIL in Vercel. Also needed for “Forgot password” and email login codes.", vercel: true },
];

/** What's set up, and what's left, at a glance. */
export function Checklist() {
  const [s, setS] = useState<Status | null>(null);
  useEffect(() => {
    void api<Status>("status").then((b) => !b.error && setS(b));
  }, []);
  if (!s) return null;
  const done = ITEMS.filter((i) => s[i.key]).length;
  return (
    <Card className="p-5 sm:p-6">
      <SectionTitle icon={<ListChecks className="size-4" />} title={`Security checklist · ${done} of ${ITEMS.length} done`} hint="Every login already ends after 2 hours, and wrong passwords lock the login for longer each time." />
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${(done / ITEMS.length) * 100}%` }} />
      </div>
      <ul className="grid gap-2.5 md:grid-cols-2">
        {ITEMS.map((i) => {
          const ok = s[i.key];
          return (
            <li key={i.key} className={cx("flex gap-2.5 rounded-xl border px-3.5 py-3", ok ? "border-brand/20 bg-soft" : "border-line bg-canvas")}>
              {ok ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" /> : <CircleDashed className="mt-0.5 size-4 shrink-0 text-faint" />}
              <div className="min-w-0">
                <p className="text-[13.5px] font-bold text-ink">
                  {i.title}
                  {!ok && i.vercel && <span className="ml-1.5 rounded-full bg-canvas px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-muted">Vercel</span>}
                </p>
                {!ok && <p className="mt-0.5 text-[12.5px] leading-snug text-muted">{i.todo}</p>}
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
