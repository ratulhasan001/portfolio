"use client";

import { useState } from "react";
import { Rocket } from "lucide-react";
import { adminApi, type PublishInfo } from "./api";
import { Button, cx, useToast } from "./kit";

const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

/**
 * Saved sections reach the public site through a new build. This bar says whether there is anything to publish and
 * starts the build (it takes about a minute on Vercel).
 */
export function PublishBar({ info, onChange }: { info: PublishInfo | null; onChange: (p: PublishInfo) => void }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  if (!info) return null;
  const go = async () => {
    setBusy(true);
    const b = await adminApi<{ publish?: PublishInfo }>("/api/admin/publish", "POST");
    setBusy(false);
    if (b.ok && b.publish) {
      onChange(b.publish);
      toast("Publishing: the site updates in about a minute");
    } else toast(b.message ?? "Couldn't publish", "err");
  };
  return (
    <div
      className={cx(
        "mb-5 flex flex-wrap items-center gap-3 rounded-2xl border px-4 py-3",
        info.pending ? "border-fg-default bg-canvas" : "border-border-default bg-canvas",
      )}
    >
      <Rocket className="size-5 shrink-0" />
      <div className="min-w-0 flex-1 text-[13.5px]">
        {info.pending ? (
          <p className="font-semibold">You have saved changes that aren&apos;t on the site yet.</p>
        ) : (
          <p className="font-semibold">The site is up to date with your saved sections.</p>
        )}
        <p className="text-fg-muted">
          {info.publishedAt ? `Last published ${fmt.format(new Date(info.publishedAt))}.` : "Not published from here yet."}{" "}
          {!info.ready && "Publishing needs VERCEL_DEPLOY_HOOK_URL in Vercel."} Folionix progress updates live, without publishing.
        </p>
      </div>
      <Button variant="primary" onClick={go} loading={busy} disabled={!info.ready || !info.pending}>
        Publish
      </Button>
    </div>
  );
}
