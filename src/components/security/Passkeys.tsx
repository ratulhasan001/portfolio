"use client";

import { useCallback, useEffect, useState } from "react";
import { browserSupportsWebAuthn, startRegistration } from "@simplewebauthn/browser";
import { Fingerprint, Pencil, Plus, Trash2 } from "lucide-react";
import { Button, Card, Field, Input, SectionTitle, useToast } from "@/components/admin/kit";
import { api, when } from "./shared";

interface Passkey {
  id: string;
  name: string;
  created_at: string;
  last_used: string | null;
}

/** "iPhone", "Mac"… a starting name for this device's passkey. */
function thisDevice() {
  const ua = navigator.userAgent;
  return /iPhone/.test(ua) ? "iPhone" : /iPad/.test(ua) ? "iPad" : /Android/.test(ua) ? "Android phone" : /Mac/.test(ua) ? "Mac" : /Windows/.test(ua) ? "Windows PC" : "This device";
}

/** Passkeys that can log in with this device's fingerprint, face or screen lock. */
export function Passkeys() {
  const toast = useToast();
  const [list, setList] = useState<Passkey[] | null>(null);
  const [supported, setSupported] = useState(true);
  const [adding, setAdding] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [confirm, setConfirm] = useState("");

  const load = useCallback(
    () =>
      api<{ passkeys?: Passkey[]; supported?: boolean }>("passkeys").then((b) => {
        if (!b.passkeys) return;
        setList(b.passkeys);
        setSupported(!!b.supported && browserSupportsWebAuthn());
      }),
    [],
  );
  useEffect(() => {
    void load();
  }, [load]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy("add");
    try {
      const o = await api<{ options?: Parameters<typeof startRegistration>[0]["optionsJSON"]; token?: string }>("passkeys", "POST", { step: "options", password });
      if (!o.options) return setError(o.message ?? "Couldn't start. Try again.");
      let response;
      try {
        response = await startRegistration({ optionsJSON: o.options });
      } catch (err) {
        const n = err instanceof Error ? err.name : "";
        return setError(n === "InvalidStateError" ? "This device already has a passkey here." : "Cancelled - no passkey was added.");
      }
      const v = await api("passkeys", "POST", { step: "verify", token: o.token, response, name: name.trim() || thisDevice() });
      if (!v.ok) return setError(v.message ?? "Couldn't add it. Try again.");
      toast("Passkey added");
      setAdding(false);
      setPassword("");
      void load();
    } finally {
      setBusy("");
    }
  };

  const remove = async (p: Passkey) => {
    if (confirm !== p.id) {
      setConfirm(p.id);
      setTimeout(() => setConfirm((c) => (c === p.id ? "" : c)), 3000);
      return;
    }
    setBusy(p.id);
    await api("passkeys", "DELETE", { id: p.id });
    setBusy("");
    setConfirm("");
    toast("Passkey removed");
    void load();
  };

  const rename = async (p: Passkey) => {
    const next = window.prompt("Name for this passkey", p.name)?.trim();
    if (!next || next === p.name) return;
    await api("passkeys", "PATCH", { id: p.id, name: next });
    void load();
  };

  return (
    <Card className="p-5 sm:p-6">
      <SectionTitle
        icon={<Fingerprint className="size-4" />}
        title="Passkeys"
        hint="Log in with your fingerprint, face or phone screen lock - no password to type, and it can't be stolen by a fake site"
      />
      {!list ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : (
        <div className="grid gap-4">
          {list.length > 0 && (
            <ul className="divide-y divide-line rounded-xl border border-line bg-canvas">
              {list.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-soft text-brand">
                    <Fingerprint className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold text-ink">{p.name}</p>
                    <p className="text-[12.5px] text-muted">
                      Added {when(p.created_at)} · {p.last_used ? `last used ${when(p.last_used)}` : "not used yet"}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => rename(p)} aria-label={`Rename ${p.name}`}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button size="sm" variant="danger" loading={busy === p.id} onClick={() => remove(p)}>
                    <Trash2 className="size-4" /> {confirm === p.id ? "Click again to remove" : "Remove"}
                  </Button>
                </li>
              ))}
            </ul>
          )}
          {!supported ? (
            <p className="text-[13px] text-muted">Passkeys can be added when this panel is opened on its own address (admin.ratulhasan.dev) in a browser that supports them.</p>
          ) : adding ? (
            <form onSubmit={add} className="grid gap-3.5 sm:max-w-md">
              <Field label="Your password">
                <Input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus />
              </Field>
              <Field label="Name for this passkey">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={thisDevice()} maxLength={60} />
              </Field>
              {error && <p className="text-[13px] font-semibold text-red-600">{error}</p>}
              <div className="flex flex-wrap gap-2">
                <Button type="submit" variant="dark" loading={busy === "add"}>
                  <Fingerprint className="size-4" /> Create passkey
                </Button>
                <Button type="button" variant="ghost" onClick={() => setAdding(false)}>
                  Cancel
                </Button>
              </div>
              <p className="text-[12.5px] text-muted">Your device will ask for your fingerprint, face or screen lock. Add one on each phone or computer you use.</p>
            </form>
          ) : (
            <div>
              <Button
                variant={list.length ? "secondary" : "dark"}
                onClick={() => {
                  setAdding(true);
                  setError("");
                  setName(thisDevice());
                }}
              >
                <Plus className="size-4" /> Add a passkey for this device
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
