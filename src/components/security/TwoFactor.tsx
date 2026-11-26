"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Copy, Download, Mail, ShieldCheck, Smartphone, TriangleAlert } from "lucide-react";
import { Button, Card, Field, Input, SectionTitle, useToast } from "@/components/admin/kit";
import { api, when } from "./shared";

interface Status {
  on: boolean;
  since: string | null;
  email: boolean;
  emailSince: string | null;
  emailReady: boolean;
  emailTo: string;
  recoveryLeft: number;
  secretReady: boolean;
  secretWorks: boolean;
  db?: boolean;
}

type Mode =
  | { k: "idle" }
  | { k: "start" }
  | { k: "scan"; qr: string; secret: string }
  | { k: "codes"; codes: string[] }
  | { k: "recovery" }
  | { k: "off" }
  | { k: "email-on" }
  | { k: "email-off" };

/** Shows recovery codes once, with copy and download. */
function RecoveryCodes({ codes, onDone }: { codes: string[]; onDone: () => void }) {
  const toast = useToast();
  const text = `Portfolio admin - recovery codes\nEach code works once, in place of the login code from your app or email.\n\n${codes.join("\n")}\n`;
  return (
    <div className="grid gap-3">
      <p className="rounded-xl border border-status-review/40 bg-attention-subtle px-3.5 py-3 text-[13px] leading-relaxed text-fg-default">
        <b>Save these recovery codes now</b> - they are shown only once. If you lose your phone or can&apos;t get into your email, each code logs you in one time instead of the login code. Keep them
        somewhere safe, away from this computer (printed, or in a password manager).
      </p>
      <ol className="grid grid-cols-2 gap-x-6 gap-y-1.5 rounded-xl border border-line bg-canvas px-4 py-3 font-mono text-[14.5px] font-semibold tracking-wider text-ink sm:max-w-md">
        {codes.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => {
            void navigator.clipboard.writeText(text).then(() => toast("Copied"));
          }}
        >
          <Copy className="size-4" /> Copy
        </Button>
        <Button
          size="sm"
          onClick={() => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
            a.download = "rh-console-recovery-codes.txt";
            a.click();
          }}
        >
          <Download className="size-4" /> Download
        </Button>
        <Button size="sm" variant="dark" onClick={onDone}>
          <Check className="size-4" /> I saved them
        </Button>
      </div>
    </div>
  );
}

/** Steps to add SESSION_SECRET in Vercel, which two-step login needs. */
export function SecretSteps() {
  return (
    <div className="rounded-xl border border-status-review/40 bg-attention-subtle px-3.5 py-3 text-[13px] leading-relaxed text-fg-default">
      <p className="flex items-center gap-2 font-bold">
        <TriangleAlert className="size-4 text-amber-600" /> SESSION_SECRET isn&apos;t set up yet
      </p>
      <ol className="mt-1.5 list-decimal space-y-0.5 pl-5">
        <li>
          Make a random secret: on a Mac, open Terminal and run <code className="rounded bg-canvas px-1.5 py-0.5 font-mono text-[12px]">openssl rand -base64 48</code>
        </li>
        <li>In Vercel → your project → Settings → Environment Variables, add <b>SESSION_SECRET</b> with that value (Production).</li>
        <li>Redeploy, then come back here. Never change it afterwards - the app codes depend on it.</li>
      </ol>
    </div>
  );
}

/** One way of getting the second-step code, with its on/off state and buttons. */
function Method({ icon, title, detail, on, children }: { icon: React.ReactNode; title: string; detail: string; on: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 rounded-xl border px-3.5 py-3 ${on ? "border-brand/20 bg-soft" : "border-line bg-canvas"}`}>
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-canvas text-brand ring-1 ring-line">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold text-ink">
          {title} <span className={`ml-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${on ? "bg-lime/40 text-deep" : "bg-canvas text-muted"}`}>{on ? "On" : "Off"}</span>
        </p>
        <p className="text-[12.5px] text-muted">{detail}</p>
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

/**
 * Two-step login: a code from an authenticator app, a code by email, or both (then either works at login). Turns each
 * on or off, and makes new recovery codes.
 */
export function TwoFactor() {
  const toast = useToast();
  const [s, setS] = useState<Status | null>(null);
  const [mode, setMode] = useState<Mode>({ k: "idle" });
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => api<Status>("2fa").then((b) => !b.error && setS(b)), []);
  useEffect(() => {
    void load();
  }, [load]);

  const go = (m: Mode) => {
    setMode(m);
    setPassword("");
    setCode("");
    setError("");
    setNote("");
  };

  const send = async (body: Record<string, string>) => {
    setBusy(true);
    setError("");
    const b = await api<{ qr?: string; secret?: string; codes?: string[] | null }>("2fa", "POST", body);
    setBusy(false);
    if (!b.ok) {
      setError(b.message ?? "Something went wrong. Try again.");
      return null;
    }
    return b;
  };

  /** Emails a code to confirm the change being made. */
  const emailMe = async () => {
    const b = await send({ action: "email-send" });
    if (b) setNote(`Code sent to ${s?.emailTo || "your email"}. It works for 3 minutes.`);
  };

  const done = (message: string, codes?: string[] | null) => {
    if (codes?.length) go({ k: "codes", codes });
    else go({ k: "idle" });
    toast(message);
    void load();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode.k === "start") {
      const b = await send({ action: "start", password });
      if (b?.qr) go({ k: "scan", qr: b.qr, secret: b.secret ?? "" });
    } else if (mode.k === "scan") {
      const b = await send({ action: "confirm", code });
      if (b) done("Authenticator app is on", b.codes);
    } else if (mode.k === "email-on") {
      const b = await send({ action: "email-on", password, code });
      if (b) done("Email codes are on", b.codes);
    } else if (mode.k === "recovery") {
      const b = await send({ action: "recovery", password, code });
      if (b) done("New recovery codes made", b.codes);
    } else if (mode.k === "off" || mode.k === "email-off") {
      const b = await send({ action: mode.k, password, code });
      if (b) done(mode.k === "off" ? "Authenticator app is off" : "Email codes are off");
    }
  };

  const passwordField = (
    <Field label="Your password">
      <Input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus />
    </Field>
  );
  const codeField = (label: string, placeholder: string) => (
    <Field label={label}>
      <Input
        inputMode={mode.k === "scan" || mode.k === "email-on" ? "numeric" : "text"}
        autoComplete="one-time-code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={placeholder}
        required
        maxLength={20}
        className="font-mono tracking-widest"
      />
    </Field>
  );
  const emailLink = (label: string) => (
    <button type="button" onClick={emailMe} disabled={busy} className="inline-flex items-center gap-1.5 justify-self-start text-[13px] font-semibold text-brand hover:underline disabled:opacity-50">
      <Mail className="size-4" /> {label}
    </button>
  );

  const any = !!s && (s.on || s.email);
  const confirmHint = s?.on && s.email ? "a code from your app or email, or a recovery code" : s?.on ? "a code from your app, or a recovery code" : "a code by email, or a recovery code";

  return (
    <Card className="p-5 sm:p-6">
      <SectionTitle
        icon={<ShieldCheck className="size-4" />}
        title="Two-step login"
        hint="After the password, a 6-digit code - from an app on your phone, by email, or either - so a stolen password alone isn't enough"
      />
      {!s ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : mode.k === "codes" ? (
        <RecoveryCodes codes={mode.codes} onDone={() => go({ k: "idle" })} />
      ) : (
        <div className="grid gap-3">
          <Method
            icon={<Smartphone className="size-4" />}
            title="Authenticator app"
            detail={s.on && s.since ? `Google Authenticator, Authy… · on since ${when(s.since)}` : "Google Authenticator, Microsoft Authenticator, Authy… Works without internet."}
            on={s.on}
          >
            {mode.k === "idle" &&
              (s.on ? (
                <Button size="sm" variant="danger" onClick={() => go({ k: "off" })}>
                  Turn off
                </Button>
              ) : (
                <Button size="sm" variant="dark" disabled={!s.secretReady || s.db === false} onClick={() => go({ k: "start" })}>
                  Turn on
                </Button>
              ))}
          </Method>
          <Method
            icon={<Mail className="size-4" />}
            title="Code by email"
            detail={s.emailReady ? `Sent to ${s.emailTo}${s.email && s.emailSince ? ` · on since ${when(s.emailSince)}` : ""}` : "Needs RESEND_API_KEY and ALERT_EMAIL in Vercel"}
            on={s.email}
          >
            {mode.k === "idle" &&
              (s.email ? (
                <Button size="sm" variant="danger" onClick={() => go({ k: "email-off" })}>
                  Turn off
                </Button>
              ) : (
                <Button size="sm" variant="dark" disabled={!s.emailReady || s.db === false} onClick={() => go({ k: "email-on" })}>
                  Turn on
                </Button>
              ))}
          </Method>

          {!s.on && !s.secretReady && <SecretSteps />}
          {s.on && !s.secretWorks && (
            <p className="rounded-xl border border-red-500/40 bg-attention-subtle px-3.5 py-3 text-[13px] text-fg-default">
              SESSION_SECRET in Vercel has changed, so codes from your app can&apos;t be checked. Put the old value back, or log in with an email or recovery code,
              then turn the app off and on again.
            </p>
          )}
          {any && (
            <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-body">
              <span className={s.recoveryLeft <= 3 ? "font-semibold text-amber-700" : ""}>
                {s.recoveryLeft} recovery {s.recoveryLeft === 1 ? "code" : "codes"} left{s.recoveryLeft <= 3 ? " - make new ones" : ""}
              </span>
              {mode.k === "idle" && (
                <Button size="sm" onClick={() => go({ k: "recovery" })}>
                  New recovery codes
                </Button>
              )}
            </div>
          )}

          {mode.k !== "idle" && (
            <form onSubmit={submit} className="mt-1 grid gap-3.5 border-t border-line pt-4 sm:max-w-md">
              {mode.k === "start" && (
                <>
                  <p className="text-[13px] text-body">You&apos;ll need an authenticator app on your phone, such as Google Authenticator, Microsoft Authenticator or Authy. First, type your password.</p>
                  {passwordField}
                </>
              )}
              {mode.k === "scan" && (
                <>
                  <ol className="list-decimal space-y-1 pl-5 text-[13px] text-body">
                    <li>Open your authenticator app and tap + (add an account).</li>
                    <li>Scan this QR code. Can&apos;t scan? Choose “enter a setup key” and type the key below.</li>
                    <li>Type the 6-digit code the app shows.</li>
                  </ol>
                  {/* eslint-disable-next-line @next/next/no-img-element -- QR code made on the server */}
                  <img src={mode.qr} alt="QR code for your authenticator app" className="size-48 rounded-xl border border-line bg-canvas p-2" />
                  <p className="text-[12.5px] text-muted">
                    Setup key: <span className="select-all font-mono font-semibold tracking-wider text-ink">{mode.secret}</span>
                  </p>
                  {codeField("Code from the app", "123 456")}
                </>
              )}
              {mode.k === "email-on" && (
                <>
                  <p className="text-[13px] text-body">
                    Each login will email a 6-digit code to <b>{s.emailTo}</b>. Keep that email account safe with its own two-step verification. First, send a test
                    code:
                  </p>
                  {passwordField}
                  {emailLink(note ? "Send it again" : "Email me a code")}
                  {codeField("Code from the email", "123456")}
                </>
              )}
              {(mode.k === "recovery" || mode.k === "off" || mode.k === "email-off") && (
                <>
                  <p className="text-[13px] text-body">
                    {mode.k === "recovery" ? "Your old recovery codes will stop working." : mode.k === "off" ? "The app will no longer be asked for." : "Codes will no longer be emailed."}{" "}
                    Confirm with your password and {confirmHint}.
                  </p>
                  {passwordField}
                  {codeField("Code", "123456 or a recovery code")}
                  {s.email && emailLink(note ? "Send the email code again" : "Email me a code")}
                </>
              )}
              {note && <p className="text-[13px] font-semibold text-brand">{note}</p>}
              {error && <p className="text-[13px] font-semibold text-red-600">{error}</p>}
              <div className="flex flex-wrap gap-2">
                <Button type="submit" variant={mode.k === "off" || mode.k === "email-off" ? "danger" : "dark"} loading={busy}>
                  {mode.k === "start" ? "Continue" : mode.k === "scan" || mode.k === "email-on" ? "Turn on" : mode.k === "recovery" ? "Make new codes" : "Turn off"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => go({ k: "idle" })}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </Card>
  );
}
