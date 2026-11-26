"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, TriangleAlert } from "lucide-react";
import { Button, Card, Field, Input, SectionTitle, cx, useToast } from "@/components/admin/kit";
import { api, when } from "./shared";

const MIN = 12;

/** 0-4: how hard the new password would be to guess, judged roughly from its length and mix of characters. */
function strength(pw: string) {
  if (pw.length < MIN) return 0;
  const kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z\d]/].filter((r) => r.test(pw)).length;
  return Math.min(4, 1 + (pw.length >= 16 ? 1 : 0) + (pw.length >= 22 ? 1 : 0) + (kinds >= 3 ? 1 : 0));
}
const LEVEL = ["Too short", "OK", "Good", "Strong", "Very strong"];
const BAR = ["bg-red-400", "bg-amber-400", "bg-lime", "bg-brand", "bg-brand"];

/** Shows whether the admin's own password is in use, and changes it. */
export function Password() {
  const toast = useToast();
  const [status, setStatus] = useState<{ custom: boolean; changedAt: string | null; db?: boolean } | null>(null);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void api<{ custom: boolean; changedAt: string | null; db?: boolean }>("password").then((b) => !b.error && setStatus(b));
  }, []);

  const s = strength(next);
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (next.length < MIN) return setError(`Use at least ${MIN} characters.`);
    if (next !== again) return setError("The two new passwords don't match.");
    setSaving(true);
    const b = await api("password", "POST", { current, next });
    setSaving(false);
    if (!b.ok) return setError(b.message ?? "Couldn't change it. Try again.");
    toast("Password changed. Other devices are logged out.");
    setCurrent("");
    setNext("");
    setAgain("");
    setStatus({ custom: true, changedAt: new Date().toISOString(), db: true });
  };

  const type = show ? "text" : "password";
  return (
    <Card className="p-5 sm:p-6">
      <SectionTitle icon={<KeyRound className="size-4" />} title="Password" hint={status?.custom && status.changedAt ? `Last changed ${when(status.changedAt)}` : "The password you type to log in"} />
      {status && !status.custom && (
        <p className="mb-4 flex gap-2.5 rounded-xl border border-status-review/40 bg-attention-subtle px-3.5 py-3 text-[13px] leading-relaxed text-fg-default">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-status-review" />
          <span>
            You are signing in with the starting password from Vercel (APP_PASSWORD). Replace it with a long password of your own - at least {MIN}
            characters. A short sentence is easy to remember and very hard to guess.
          </span>
        </p>
      )}
      <form onSubmit={save} className="grid gap-3.5 sm:max-w-md">
        <Field label={status?.custom ? "Current password" : "Current (starting) password"}>
          <Input type={type} autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
        </Field>
        <Field label="New password">
          <Input type={type} autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} minLength={MIN} required />
        </Field>
        {next && (
          <div className="-mt-1.5 flex items-center gap-2.5">
            <div className="flex flex-1 gap-1">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={cx("h-1.5 flex-1 rounded-full", i < Math.max(1, s) ? BAR[s] : "bg-line")} />
              ))}
            </div>
            <span className={cx("text-[12px] font-bold", s ? "text-body" : "text-red-600")}>{s ? LEVEL[s] : `${next.length}/${MIN}`}</span>
          </div>
        )}
        <Field label="New password again">
          <Input type={type} autoComplete="new-password" value={again} onChange={(e) => setAgain(e.target.value)} required />
        </Field>
        {error && <p className="text-[13px] font-semibold text-red-600">{error}</p>}
        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" variant="dark" loading={saving} disabled={status?.db === false}>
            Change password
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setShow((v) => !v)}>
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />} {show ? "Hide" : "Show"}
          </Button>
        </div>
        <p className="text-[12.5px] text-muted">Changing it logs out every other device.</p>
      </form>
    </Card>
  );
}
