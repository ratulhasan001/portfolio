"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { LoginShell, loginButton, loginField, loginInput, loginLabel, loginLink } from "@/components/LoginShell";

const MIN = 12;

/**
 * Opened from a reset link (/login/reset#<token>, sent to the owner's email). The token is after the "#",
 * so it never reaches server logs or other sites. Sets a new password, then logs this device in.
 */
export default function ResetPage() {
  const [token, setToken] = useState("");
  const [state, setState] = useState<"checking" | "ready" | "bad" | "done">("checking");
  const [needsCode, setNeedsCode] = useState(false);
  const [password, setPassword] = useState("");
  const [again, setAgain] = useState("");
  const [code, setCode] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const call = (body: Record<string, unknown>): Promise<{ ok?: boolean; needsCode?: boolean; error?: string; message?: string }> =>
    fetch("/api/login/reset", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
      .then((r) => r.json())
      .catch(() => ({ ok: false, error: "offline", message: "Can't connect. Check your internet." }));

  useEffect(() => {
    const t = window.location.hash.slice(1);
    history.replaceState(null, "", window.location.pathname); // keep the token out of the address bar and history
    void call({ step: "check", token: t }).then((b) => {
      setToken(t);
      setNeedsCode(!!b.needsCode);
      setError(b.ok ? "" : (b.message ?? "This reset link doesn't work."));
      setState(b.ok ? "ready" : "bad");
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < MIN) return setError(`Use at least ${MIN} characters.`);
    if (password !== again) return setError("The two passwords don't match.");
    setBusy(true);
    const b = await call({ step: "set", token, password, code });
    setBusy(false);
    if (b.ok) {
      setState("done");
      setTimeout(() => window.location.replace("/admin/security"), 1200);
      return;
    }
    if (b.error === "expired") setState("bad");
    setError(b.message ?? "Something went wrong. Try again.");
  };

  return (
    <LoginShell>
      <div className="mb-6 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-lg bg-white text-black" aria-hidden>
          <KeyRound className="size-5" strokeWidth={2.2} />
        </span>
        <span className="font-mono text-[12px] leading-tight text-white/55">
          password reset
          <span className="block text-white/35">one-time link · expires soon</span>
        </span>
      </div>
      <h1 className="text-[28px] font-bold tracking-[-0.02em]">
        {state === "done" ? "All set!" : "New password"}
      </h1>

      {state === "checking" && (
        <p className="mt-6 flex items-center justify-center gap-2 text-[14px] text-white/60">
          <Loader2 className="size-4 animate-spin" /> Checking the link…
        </p>
      )}
      {state === "done" && <p className="mt-2 text-center text-[14px] text-white/60">Your new password is set. Every other device was logged out. Opening…</p>}
      {state === "bad" && (
        <div className="mt-6 text-center">
          <p className="text-[14px] font-semibold text-red-300">{error}</p>
          <Link href="/login" className={`${loginLink} mt-5 inline-flex items-center gap-1`}>
            <ArrowLeft className="size-3.5" /> Back to login
          </Link>
        </div>
      )}
      {state === "ready" && (
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <p className="text-center text-[14px] text-white/60">At least {MIN} characters. A short sentence of 4 or 5 words is easy to remember.</p>
          <div>
            <label htmlFor="new" className={loginLabel}>
              New password
            </label>
            <div className={`${loginField} border-white/15`}>
              <input id="new" type={show ? "text" : "password"} autoComplete="new-password" autoFocus required value={password} onChange={(e) => setPassword(e.target.value)} className={loginInput} />
              <button type="button" onClick={() => setShow((v) => !v)} className="grid h-14 w-12 shrink-0 place-items-center text-white/50 hover:text-white" aria-label={show ? "Hide password" : "Show password"}>
                {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="again" className={loginLabel}>
              Again
            </label>
            <div className={`${loginField} border-white/15`}>
              <input id="again" type={show ? "text" : "password"} autoComplete="new-password" required value={again} onChange={(e) => setAgain(e.target.value)} className={loginInput} />
            </div>
          </div>
          {needsCode && (
            <div>
              <label htmlFor="code" className={loginLabel}>
                Code from your app (or a recovery code)
              </label>
              <div className={`${loginField} border-white/15`}>
                <input
                  id="code"
                  autoComplete="one-time-code"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  maxLength={20}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={`${loginInput} font-mono tracking-[0.2em]`}
                />
              </div>
            </div>
          )}
          {error && (
            <p className="text-center text-[13px] font-semibold text-red-300" role="alert">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy} className={loginButton}>
            {busy ? <Loader2 className="size-5 animate-spin" /> : null} Set new password {!busy && <ArrowRight className="size-5" />}
          </button>
        </form>
      )}
    </LoginShell>
  );
}
