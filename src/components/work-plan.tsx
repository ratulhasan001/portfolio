import { Check, CircleDashed, Loader, Minus } from "lucide-react";
import type { Progress, TaskStatus } from "@/lib/admin-sections";
import plan from "@/lib/folionix-plan.json";
import { EVIDENCE_ICON, evidenceLabel } from "./drill-reports";

const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

const ICON: Record<TaskStatus, React.ReactNode> = {
  done: <Check size={13} className="text-status-published" />,
  doing: <Loader size={13} className="text-status-review" />,
  todo: <CircleDashed size={13} className="text-fg-subtle" />,
  skipped: <Minus size={13} className="text-fg-subtle" />,
};

/**
 * The whole Folionix work plan (every task and drill, from src/lib/folionix-plan.json) with its live status. The
 * status comes from the admin panel; each group folds open with a plain <details>, so the page needs no script.
 */
export function WorkPlan({ progress }: { progress: Progress }) {
  const status = (id: string): TaskStatus => progress[id]?.status ?? "todo";
  const counted = plan.tasks.filter((t) => status(t.id) !== "skipped");
  const done = counted.filter((t) => status(t.id) === "done").length;
  const doing = counted.filter((t) => status(t.id) === "doing").length;
  const pct = (n: number) => (counted.length ? (n / counted.length) * 100 : 0);
  const latest = plan.tasks
    .filter((t) => progress[t.id] && status(t.id) !== "todo")
    .sort((a, b) => (progress[b.id]!.at > progress[a.id]!.at ? 1 : -1))
    .slice(0, 5);

  return (
    <div>
      <div className="mb-5 rounded-xl border border-border-default bg-canvas-subtle p-4">
        <div className="mono flex flex-wrap items-center justify-between gap-2 text-[11px] uppercase tracking-[0.1em] text-fg-subtle">
          <span>
            {done} done · {doing} in progress · {counted.length - done - doing} to do
          </span>
          <span>{Math.round(pct(done))}%</span>
        </div>
        <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-border-strong/40">
          <span className="bg-status-published" style={{ width: `${pct(done)}%` }} />
          <span className="bg-status-review" style={{ width: `${pct(doing)}%` }} />
        </div>
      </div>

      {latest.length > 0 && (
        <div className="mb-5">
          <p className="mono mb-2 text-[11px] uppercase tracking-[0.1em] text-fg-subtle">Latest updates</p>
          <ul className="space-y-1.5">
            {latest.map((t) => (
              <li key={t.id} className="flex items-start gap-2 text-[14px] text-fg-muted">
                <span className="mt-1">{ICON[status(t.id)]}</span>
                <span className="min-w-0">
                  <span className="mono text-[12px] text-fg-subtle">{t.id}</span> {t.title}
                  <span className="text-fg-subtle"> · {fmt.format(new Date(progress[t.id]!.at))}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        {plan.groups.map((g) => {
          const items = plan.tasks.filter((t) => t.group === g.id);
          const gDone = items.filter((t) => status(t.id) === "done").length;
          const gDoing = items.some((t) => status(t.id) === "doing");
          return (
            <details key={g.id} className="group rounded-xl border border-border-default bg-canvas">
              <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                <span className="mono w-12 shrink-0 text-[11px] uppercase tracking-[0.08em] text-fg-subtle">{g.kind === "drill" ? "Drill" : "Tasks"}</span>
                <span className="min-w-0 flex-1 text-[14.5px] font-semibold text-fg-default">{g.title}</span>
                {gDoing && <span className="mono hidden rounded-full bg-status-review/[0.12] px-2 py-0.5 text-[10px] uppercase text-status-review sm:inline">Active</span>}
                <span className="mono shrink-0 text-[12px] text-fg-muted">
                  {gDone}/{items.length}
                </span>
              </summary>
              <ul className="border-t border-border-default px-4 py-2">
                {items.map((t) => (
                  <li key={t.id} className="flex items-start gap-2.5 py-1.5 text-[14px]">
                    <span className="mt-1 shrink-0">{ICON[status(t.id)]}</span>
                    <span className="mono mt-px w-14 shrink-0 text-[12px] text-fg-subtle">{t.id}</span>
                    <span className="min-w-0">
                      <span className={status(t.id) === "skipped" ? "text-fg-subtle line-through" : status(t.id) === "done" ? "text-fg-muted" : "text-fg-default"}>{t.title}</span>
                      {progress[t.id]?.note && <span className="block text-[13px] text-fg-subtle">{progress[t.id]!.note}</span>}
                      {progress[t.id]?.evidence?.metrics?.length ? (
                        <span className="mono mt-0.5 block text-[12px] text-fg-muted">
                          {progress[t.id]!.evidence!.metrics!.map((m) => `${m.label}: ${m.value}`).join(" · ")}
                        </span>
                      ) : null}
                      {progress[t.id]?.evidence?.links?.length ? (
                        <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                          {progress[t.id]!.evidence!.links!.map((l) => {
                            const Icon = EVIDENCE_ICON[l.kind];
                            return (
                              <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[12.5px] text-fg-muted underline-offset-2 hover:text-fg-default hover:underline">
                                <Icon size={12} /> {l.label || evidenceLabel(l.kind)}
                              </a>
                            );
                          })}
                          {progress[t.id]!.evidence!.showcase && (
                            <a href={`#report-${t.id}`} className="text-[12.5px] font-semibold text-fg-default underline-offset-2 hover:underline">
                              Full report
                            </a>
                          )}
                        </span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
      </div>
    </div>
  );
}
