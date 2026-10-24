"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Play, RotateCcw } from "lucide-react";
import { pipelineStages } from "@/lib/folionix";

const STEP_MS = 650;

/**
 * A scripted walk through the planned pipeline: each stage turns from queued
 * to running to passed. Nothing is fetched; it previews what the real
 * GitHub Actions + ArgoCD flow will do once it exists.
 */
export function PipelineDemo() {
  // -1 = idle, 0..n-1 = running that stage, n = finished
  const [active, setActive] = useState(-1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const done = active >= pipelineStages.length;
  const running = active >= 0 && !done;

  useEffect(() => {
    if (!running) return;
    timer.current = setTimeout(() => setActive((a) => a + 1), STEP_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [active, running]);

  const start = () => setActive(0);

  return (
    <div className="rounded-2xl border border-border-strong bg-canvas p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">
            Simulated run · preview
          </p>
          <p className="mt-0.5 text-[14px] text-fg-muted">
            {done
              ? "Released: new version rolled out by ArgoCD."
              : running
                ? `Running: ${pipelineStages[active].name}…`
                : "Pull request → checks → signed release → GitOps deploy."}
          </p>
        </div>
        <button
          type="button"
          onClick={start}
          disabled={running}
          className="mono inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-on-accent transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {done ? <RotateCcw size={12} /> : <Play size={12} />}
          {done ? "Run again" : running ? "Running" : "Run pipeline"}
        </button>
      </div>

      <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {pipelineStages.map((stage, i) => {
          const state =
            active > i || done ? "passed" : active === i ? "running" : "queued";
          const firstRelease =
            stage.gate === "release" && pipelineStages[i - 1]?.gate === "pr";
          return (
            <li
              key={stage.name}
              className={`relative flex items-start gap-3 rounded-xl border px-3 py-2.5 transition-colors duration-300 ${
                state === "passed"
                  ? "border-status-published/40 bg-status-published/[0.06]"
                  : state === "running"
                    ? "border-status-review/50 bg-status-review/[0.06]"
                    : "border-border-default bg-canvas-subtle"
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                  state === "passed"
                    ? "border-status-published bg-status-published text-canvas"
                    : state === "running"
                      ? "border-status-review text-status-review"
                      : "mono border-border-strong text-fg-subtle"
                }`}
              >
                {state === "passed" ? (
                  <Check size={12} strokeWidth={3} />
                ) : state === "running" ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  i + 1
                )}
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-semibold leading-snug text-fg-default">
                  {stage.name}
                </span>
                <span className="mono block text-[11px] text-fg-subtle">
                  {stage.detail}
                </span>
              </span>
              <span className="mono ml-auto shrink-0 self-center text-[9px] uppercase tracking-[0.1em] text-fg-subtle">
                {firstRelease || i === 0
                  ? stage.gate === "pr"
                    ? "pr.yml"
                    : "release.yml"
                  : ""}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
