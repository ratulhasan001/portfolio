"use client";

import { useEffect, useRef } from "react";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let loading: Promise<TurnstileApi> | null = null;

function loadTurnstile() {
  loading ??= new Promise<TurnstileApi>((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile missing")));
    s.onerror = () => {
      loading = null;
      reject(new Error("turnstile failed to load"));
    };
    document.head.appendChild(s);
  });
  return loading;
}

/**
 * Cloudflare's "Verify you are human" box. `onToken` gets the pass token ("" when it expires or fails); a token works
 * once, so bump `reset` after each try to get a fresh one.
 */
export function Turnstile({
  siteKey,
  action,
  onToken,
  reset = 0,
  theme = "dark",
}: {
  siteKey: string;
  action: string;
  onToken: (t: string) => void;
  reset?: number;
  theme?: "dark" | "light";
}) {
  const box = useRef<HTMLDivElement>(null);
  const id = useRef<string | null>(null);
  const cb = useRef(onToken);
  useEffect(() => {
    cb.current = onToken;
  }, [onToken]);

  useEffect(() => {
    let gone = false;
    loadTurnstile()
      .then((t) => {
        if (gone || !box.current) return;
        id.current = t.render(box.current, {
          sitekey: siteKey,
          action,
          theme,
          size: "flexible",
          callback: (tok: string) => cb.current(tok),
          "expired-callback": () => cb.current(""),
          "error-callback": () => cb.current(""),
        });
      })
      .catch(() => cb.current(""));
    return () => {
      gone = true;
      if (id.current) window.turnstile?.remove(id.current);
      id.current = null;
    };
  }, [siteKey, action, theme]);

  useEffect(() => {
    if (reset && id.current) {
      cb.current("");
      window.turnstile?.reset(id.current);
    }
  }, [reset]);

  return <div ref={box} className="min-h-[65px] w-full" />;
}
