"use client";

import { useEffect, useState } from "react";
import { BellRing, CheckCircle2, CircleDashed, History as HistoryIcon, Send } from "lucide-react";
import { Button, Card, SectionTitle, cx, useToast } from "@/components/admin/kit";
import { api, when } from "./shared";

interface Event {
  id: string;
  at: string;
  kind: string;
  ip: string;
  device: string;
  detail: string;
}

const LABEL: Record<string, { text: string; tone: "ok" | "bad" | "info" }> = {
  login: { text: "Logged in", tone: "ok" },
  "wrong-password": { text: "Wrong password", tone: "bad" },
  "wrong-code": { text: "Wrong login code", tone: "bad" },
  locked: { text: "Locked out", tone: "bad" },
  logout: { text: "Logged out", tone: "info" },
  "device-logged-out": { text: "Logged out a device", tone: "info" },
  "password-changed": { text: "Password changed", tone: "info" },
  "2fa-on": { text: "Two-step login turned on", tone: "ok" },
  "2fa-off": { text: "Two-step login turned off", tone: "bad" },
  "recovery-codes": { text: "New recovery codes made", tone: "info" },
  "passkey-added": { text: "Passkey added", tone: "info" },
  "passkey-removed": { text: "Passkey removed", tone: "info" },
  "reset-requested": { text: "Password reset asked for", tone: "info" },
  "password-reset": { text: "Password reset", tone: "info" },
  "session-blocked": { text: "Login used from another browser or country - logged out", tone: "bad" },
  "content-changed": { text: "Portfolio section saved", tone: "info" },
  published: { text: "Site published", tone: "ok" },
  "file-uploaded": { text: "File uploaded", tone: "info" },
};
const HOW: Record<string, string> = { password: "with password", "password+2fa": "with password + code", "password+email": "with password + email code", "password+recovery": "with a recovery code", passkey: "with a passkey", reset: "after a reset" };
const DOT = { ok: "bg-brand", bad: "bg-red-500", info: "bg-faint" };

/** The latest logins, wrong passwords, lockouts and security changes. */
export function History() {
  const [list, setList] = useState<Event[] | null>(null);
  useEffect(() => {
    void api<{ events?: Event[] }>("history").then((b) => b.events && setList(b.events));
  }, []);
  return (
    <Card className="p-5 sm:p-6">
      <SectionTitle icon={<HistoryIcon className="size-4" />} title="Login history" hint="The latest logins and security changes, newest first" />
      {!list ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : !list.length ? (
        <p className="text-sm text-muted">Nothing yet.</p>
      ) : (
        <ul className="max-h-[420px] divide-y divide-line overflow-y-auto rounded-xl border border-line bg-canvas">
          {list.map((e) => {
            const l = LABEL[e.kind] ?? { text: e.kind, tone: "info" as const };
            const detail = e.kind === "login" ? (HOW[e.detail] ?? e.detail) : e.detail;
            return (
              <li key={e.id} className="flex items-start gap-3 px-4 py-2.5">
                <span className={cx("mt-1.5 size-2 shrink-0 rounded-full", DOT[l.tone])} />
                <div className="min-w-0 flex-1">
                  <p className={cx("text-[13.5px] font-bold", l.tone === "bad" ? "text-red-700" : "text-ink")}>
                    {l.text}
                    {detail && <span className="font-medium text-muted"> · {detail}</span>}
                  </p>
                  <p className="text-[12px] text-muted">
                    {when(e.at)} · {e.device} · IP {e.ip}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

function Channel({ on, name, how }: { on: boolean; name: string; how: string }) {
  return (
    <li className="flex items-start gap-2.5">
      {on ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" /> : <CircleDashed className="mt-0.5 size-4 shrink-0 text-faint" />}
      <span className="text-[13px] text-body">
        <b className="text-ink">{name}</b> {on ? "- on" : <>- not set up. In Vercel, add {how}.</>}
      </span>
    </li>
  );
}

/** Where security alerts go (set up in Vercel), with a button to send a test. */
export function Alerts() {
  const toast = useToast();
  const [c, setC] = useState<{ email: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    void api<{ email: boolean }>("alerts").then((b) => !b.error && setC(b));
  }, []);
  const test = async () => {
    setBusy(true);
    const b = await api("alerts", "POST");
    setBusy(false);
    toast(b.ok ? "Test alert sent" : (b.message ?? "Couldn't send it"), b.ok ? "ok" : "err");
  };
  return (
    <Card className="p-5 sm:p-6">
      <SectionTitle
        icon={<BellRing className="size-4" />}
        title="Security alerts"
        hint="A message when a new device logs in, after a lockout, or when the password or login settings change. “Forgot password” reset links are sent here too."
        action={
          c?.email ? (
            <Button size="sm" loading={busy} onClick={test}>
              <Send className="size-4" /> Send a test
            </Button>
          ) : null
        }
      />
      {c && (
        <ul className="grid gap-2">
          <Channel on={c.email} name="Email" how={"RESEND_API_KEY and ALERT_EMAIL (from resend.com; several addresses can be separated by commas)"} />
        </ul>
      )}
    </Card>
  );
}
