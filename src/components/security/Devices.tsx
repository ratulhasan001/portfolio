"use client";

import { useCallback, useEffect, useState } from "react";
import { Fingerprint, KeyRound, Laptop, LogOut, Smartphone } from "lucide-react";
import { Button, Card, SectionTitle, useToast } from "@/components/admin/kit";
import { api, relative, when } from "./shared";

interface Session {
  id: string;
  device: string;
  ip: string;
  how: string;
  created_at: string;
  last_seen: string;
  expires_at: string;
}

const HOW: Record<string, string> = { password: "Password", "password+2fa": "Password + code", "password+email": "Password + email code", "password+recovery": "Password + recovery code", passkey: "Passkey", reset: "Password reset" };

/** The devices logged in to the admin panel, each with a button to log it out. */
export function Devices() {
  const toast = useToast();
  const [list, setList] = useState<Session[] | null>(null);
  const [current, setCurrent] = useState<string | null>(null);
  const [busy, setBusy] = useState("");

  const load = useCallback(async () => {
    const b = await api<{ sessions?: Session[]; current?: string | null }>("sessions");
    if (b.sessions) {
      setList(b.sessions);
      setCurrent(b.current ?? null);
    }
  }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- loads the list once the page is open
  useEffect(() => void load(), [load]);

  const logOut = async (body: { id: string } | { others: true }, key: string) => {
    setBusy(key);
    const b = await api("sessions", "DELETE", body);
    setBusy("");
    if (b.ok) {
      toast("others" in body ? "Every other device is logged out" : "That device is logged out");
      void load();
    } else toast(b.message ?? "Couldn't log it out. Try again.", "err");
  };

  const others = (list ?? []).filter((s) => s.id !== current);

  return (
    <Card className="p-5 sm:p-6">
      <SectionTitle
        icon={<Laptop className="size-4" />}
        title="Logged-in devices"
        hint="Each login lasts 2 hours (or until 30 minutes without use), then asks again. Log out any device you don't recognise."
        action={
          others.length > 0 && (
            <Button size="sm" variant="danger" loading={busy === "all"} onClick={() => logOut({ others: true }, "all")}>
              <LogOut className="size-4" /> Log out all others
            </Button>
          )
        }
      />
      {!list ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : !list.length ? (
        <p className="text-sm text-muted">No devices are logged in.</p>
      ) : (
        <ul className="divide-y divide-line rounded-xl border border-line bg-canvas">
          {list.map((s) => {
            const phone = /iPhone|Android/.test(s.device);
            const Icon = s.how === "passkey" ? Fingerprint : phone ? Smartphone : s.how.startsWith("password") ? KeyRound : Laptop;
            const me = s.id === current;
            return (
              <li key={s.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-soft text-brand">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-ink">
                    {s.device}
                    {me && <span className="ml-2 rounded-full bg-lime/40 px-2 py-0.5 text-[11px] font-bold text-deep">This device</span>}
                  </p>
                  <p className="text-[12.5px] text-muted">
                    {HOW[s.how] ?? s.how} · {when(s.created_at)} · IP {s.ip} · ends {relative(s.expires_at)}
                  </p>
                </div>
                {!me && (
                  <Button size="sm" variant="secondary" loading={busy === s.id} onClick={() => logOut({ id: s.id }, s.id)}>
                    Log out
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
