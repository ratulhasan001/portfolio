"use client";

import { useState } from "react";
import { Plus, Star, Trash2 } from "lucide-react";
import { EVIDENCE_KINDS, EVIDENCE_LIMITS as L, type Evidence, type EvidenceKind } from "@/lib/admin-sections";
import { FileButton } from "./ValueEditor";
import { Button, Switch, cx } from "./kit";

const input = "w-full rounded-lg border border-border-default bg-canvas px-3 py-2 text-[13.5px] outline-none focus:border-fg-default";

/**
 * The proof behind one task or drill: a short summary, the headline numbers, and links (write-up, video, terminal
 * recording, graphs, commit…). Files can be uploaded straight to R2. "Showcase" puts it on the public page as a card.
 */
export function EvidenceEditor({ value, onSave }: { value: Evidence | undefined; onSave: (e: Evidence | null) => Promise<void> }) {
  const [e, setE] = useState<Evidence>(value ?? {});
  const [busy, setBusy] = useState(false);
  const metrics = e.metrics ?? [];
  const links = e.links ?? [];
  const dirty = JSON.stringify(e) !== JSON.stringify(value ?? {});

  const save = async () => {
    setBusy(true);
    await onSave(Object.keys(e).length ? e : null);
    setBusy(false);
  };

  return (
    <div className="grid gap-3 rounded-xl border border-border-default bg-canvas-subtle p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-fg-muted">Proof</p>
        <label className="flex items-center gap-2 text-[13px] font-semibold">
          <Star className={cx("size-4", e.showcase ? "fill-current text-status-review" : "text-fg-subtle")} />
          Showcase on the public page
          <Switch checked={!!e.showcase} onChange={(v) => setE({ ...e, showcase: v })} label="Showcase" />
        </label>
      </div>

      <label className="grid gap-1">
        <span className="text-[12px] font-semibold text-fg-muted">Summary: what broke or was built, how you found it, how you fixed it</span>
        <textarea className={cx(input, "min-h-[80px]")} maxLength={L.summary} value={e.summary ?? ""} onChange={(ev) => setE({ ...e, summary: ev.target.value })} />
      </label>

      <div className="grid gap-1.5">
        <span className="text-[12px] font-semibold text-fg-muted">Key numbers (measured, never estimated)</span>
        {metrics.map((m, i) => (
          <div key={i} className="flex gap-2">
            <input className={input} placeholder="Rebuild time" maxLength={L.metricLabel} value={m.label} onChange={(ev) => setE({ ...e, metrics: metrics.map((x, j) => (j === i ? { ...x, label: ev.target.value } : x)) })} />
            <input className={cx(input, "max-w-[160px]")} placeholder="24 min" maxLength={L.metricValue} value={m.value} onChange={(ev) => setE({ ...e, metrics: metrics.map((x, j) => (j === i ? { ...x, value: ev.target.value } : x)) })} />
            <button type="button" aria-label="Remove number" onClick={() => setE({ ...e, metrics: metrics.filter((_, j) => j !== i) })} className="shrink-0 rounded px-1.5 text-fg-muted hover:text-red-600">
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        {metrics.length < L.metrics && (
          <button type="button" onClick={() => setE({ ...e, metrics: [...metrics, { label: "", value: "" }] })} className="flex w-fit items-center gap-1 text-[13px] font-semibold text-fg-muted hover:text-fg-default">
            <Plus className="size-4" /> Add a number
          </button>
        )}
      </div>

      <div className="grid gap-1.5">
        <span className="text-[12px] font-semibold text-fg-muted">Links (https) or uploads</span>
        {links.map((l, i) => {
          const set = (patch: Partial<typeof l>) => setE({ ...e, links: links.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
          return (
            <div key={i} className="grid gap-2 sm:grid-cols-[150px_1fr_160px_auto_auto]">
              <select className={input} value={l.kind} onChange={(ev) => set({ kind: ev.target.value as EvidenceKind })}>
                {EVIDENCE_KINDS.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.label}
                  </option>
                ))}
              </select>
              <input className={input} placeholder="https://…" maxLength={L.url} value={l.url} onChange={(ev) => set({ url: ev.target.value })} />
              <input className={input} placeholder="Label (optional)" maxLength={L.linkLabel} value={l.label ?? ""} onChange={(ev) => set({ label: ev.target.value })} />
              <FileButton onDone={(url) => set({ url })} />
              <button type="button" aria-label="Remove link" onClick={() => setE({ ...e, links: links.filter((_, j) => j !== i) })} className="rounded px-1.5 text-fg-muted hover:text-red-600">
                <Trash2 className="size-4" />
              </button>
            </div>
          );
        })}
        {links.length < L.links && (
          <button type="button" onClick={() => setE({ ...e, links: [...links, { kind: "writeup", url: "" }] })} className="flex w-fit items-center gap-1 text-[13px] font-semibold text-fg-muted hover:text-fg-default">
            <Plus className="size-4" /> Add a link
          </button>
        )}
      </div>

      <div className="flex justify-end">
        <Button size="sm" variant="primary" onClick={save} loading={busy} disabled={!dirty}>
          Save proof
        </Button>
      </div>
    </div>
  );
}
