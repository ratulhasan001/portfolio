import { Check, CircleDashed, Loader, Minus } from "lucide-react";
import type { Progress, TaskStatus } from "@/lib/admin-sections";
import { publicTasks, workPlanGroups } from "@/lib/plan-public";
import { EVIDENCE_ICON, evidenceLabel } from "./drill-reports";

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

  return (
    <div>
      <div className="space-y-2">
        {workPlanGroups.map((g) => {
          const items = publicTasks.filter((t) => t.group === g.id);
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
