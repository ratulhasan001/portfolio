"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ExternalLink, Search, Star } from "lucide-react";
import { TASK_STATUSES, type Evidence, type Progress, type TaskStatus } from "@/lib/admin-sections";
import { EvidenceEditor } from "@/components/admin/EvidenceEditor";
import plan from "@/lib/folionix-plan.json";
import { PRIVATE_GROUPS, PRIVATE_TASKS } from "@/lib/plan-public";
import { adminApi } from "@/components/admin/api";
import { Card, cx, useToast } from "@/components/admin/kit";

type Task = (typeof plan.tasks)[number];

const STATUS_STYLE: Record<TaskStatus, string> = {
  todo: "bg-canvas text-fg-muted",
  doing: "bg-status-accepted text-white",
  done: "bg-status-published text-white",
  skipped: "bg-canvas-inset text-fg-subtle line-through",
};

function Row({ task, p, onSet }: { task: Task; p: Progress[string] | undefined; onSet: (status: TaskStatus, note?: string, evidence?: Evidence | null) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(p?.note ?? "");
  const status = p?.status ?? "todo";
  return (
    <li className="border-t border-border-default first:border-t-0">
      <div className="flex flex-wrap items-center gap-2 px-3 py-2.5">
        <button type="button" onClick={() => setOpen(!open)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
          <ChevronDown className={cx("size-4 shrink-0 text-fg-subtle transition", open ? "" : "-rotate-90")} />
          <span className="mono w-14 shrink-0 text-[12px] text-fg-subtle">{task.id}</span>
          <span className={cx("min-w-0 text-[14px]", status === "done" && "text-fg-muted", status === "skipped" && "text-fg-subtle line-through")}>{task.title}</span>
          {p?.evidence?.showcase && <Star className="size-3.5 shrink-0 fill-current text-status-review" aria-label="Showcased" />}
          {p?.evidence && !p.evidence.showcase && <span className="shrink-0 rounded bg-canvas-inset px-1.5 text-[10.5px] font-semibold text-fg-muted">proof</span>}
          {PRIVATE_TASKS.has(task.id) && <span className="shrink-0 rounded bg-canvas-inset px-1.5 text-[10.5px] font-semibold text-fg-muted">private</span>}
        </button>
        <div className="flex shrink-0 overflow-hidden rounded-lg border border-border-default" role="radiogroup" aria-label={`Status of ${task.id}`}>
          {TASK_STATUSES.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={status === s.id}
              onClick={() => status !== s.id && onSet(s.id)}
              className={cx("px-2.5 py-1 text-[12px] font-semibold transition", status === s.id ? STATUS_STYLE[s.id] : "text-fg-muted hover:bg-canvas-subtle")}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      {open && (
        <div className="grid gap-2 px-3 pb-3 pl-[88px] text-[13px]">
          {task.how && (
            <p className="text-fg-muted">
              <span className="font-semibold text-fg-default">How: </span>
              {task.how}
            </p>
          )}
          {task.done && (
            <p className="text-fg-muted">
              <span className="font-semibold text-fg-default">Done when: </span>
              {task.done}
            </p>
          )}
          <label className="grid gap-1">
            <span className="text-[12px] font-semibold text-fg-muted">Note (shown on the public page)</span>
            <input
              className="w-full rounded-lg border border-border-default bg-canvas px-3 py-2 text-[13.5px] outline-none focus:border-fg-default"
              value={note}
              maxLength={500}
              placeholder="e.g. a link to the write-up, or what's left"
              onChange={(e) => setNote(e.target.value)}
              onBlur={() => note !== (p?.note ?? "") && onSet(status, note)}
            />
          </label>
          <EvidenceEditor value={p?.evidence} onSave={(ev) => onSet(status, undefined, ev)} />
        </div>
      )}
    </li>
  );
}

export default function FolionixProgress() {
  const toast = useToast();
  const [progress, setProgress] = useState<Progress>({});
  const [loaded, setLoaded] = useState(false);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<TaskStatus | "all">("all");
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    adminApi<{ progress: Progress }>("/api/admin/progress").then((b) => {
      if (b.progress) setProgress(b.progress);
      setLoaded(true);
    });
  }, []);

  const set = async (id: string, status: TaskStatus, note?: string, evidence?: Evidence | null) => {
    const before = progress;
    setProgress({ ...progress, [id]: { ...progress[id], status, note: note ?? progress[id]?.note, at: new Date().toISOString() } });
    const b = await adminApi<{ progress?: Progress }>("/api/admin/progress", "POST", { changes: [{ id, status, note, evidence }] });
    if (b.ok && b.progress) {
      setProgress(b.progress);
      if (evidence !== undefined) toast("Proof saved - it's on the public page now");
    }
    else {
      setProgress(before);
      toast(b.message ?? "Couldn't save", "err");
    }
  };

  const statusOf = (id: string) => progress[id]?.status ?? "todo";
  const match = (t: Task) =>
    (filter === "all" || statusOf(t.id) === filter) && (!q || `${t.id} ${t.title} ${t.how}`.toLowerCase().includes(q.toLowerCase()));

  const totals = useMemo(() => {
    const c = { todo: 0, doing: 0, done: 0, skipped: 0 };
    for (const t of plan.tasks) c[statusOf(t.id)]++;
    return c;
  }, [progress]); // eslint-disable-line react-hooks/exhaustive-deps
  const counted = plan.tasks.length - totals.skipped;

  return (
    <div>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Folionix progress</h1>
        <a href="https://ratulhasan.dev/projects/folionix#work-plan" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[13px] font-semibold text-fg-muted hover:text-fg-default">
          Public page <ExternalLink className="size-3.5" />
        </a>
      </div>
      <p className="mb-4 text-sm text-fg-muted">Every task and drill from the plan. Open one to add a note and its proof (summary, numbers, write-up, video). Changes show on the public page straight away; starred ones appear as Drill reports.</p>

      <Card className="mb-4 p-4">
        <div className="mb-2 flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
          <span>
            <b>{totals.done}</b> done
          </span>
          <span>
            <b>{totals.doing}</b> in progress
          </span>
          <span>
            <b>{totals.todo}</b> to do
          </span>
          <span className="text-fg-muted">{totals.skipped} skipped</span>
          <span className="ml-auto font-semibold">{counted ? Math.round((totals.done / counted) * 100) : 0}%</span>
        </div>
        <div className="flex h-2 overflow-hidden rounded-full bg-canvas-inset">
          <div className="bg-status-published" style={{ width: `${counted ? (totals.done / counted) * 100 : 0}%` }} />
          <div className="bg-status-accepted" style={{ width: `${counted ? (totals.doing / counted) * 100 : 0}%` }} />
        </div>
      </Card>

      <div className="mb-4 flex flex-wrap gap-2">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-border-default bg-canvas px-3">
          <Search className="size-4 text-fg-subtle" />
          <input className="h-9 w-full bg-transparent text-[14px] outline-none" placeholder="Search tasks (F-36a, Terraform…)" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="h-9 rounded-lg border border-border-default bg-canvas px-2 text-[13px]" value={filter} onChange={(e) => setFilter(e.target.value as TaskStatus | "all")}>
          <option value="all">All statuses</option>
          {TASK_STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {!loaded ? (
        <p className="text-fg-muted">Loading…</p>
      ) : (
        <div className="grid gap-3">
          {plan.groups.map((g) => {
            const all = plan.tasks.filter((t) => t.group === g.id);
            const shown = all.filter(match);
            if (!shown.length) return null;
            const done = all.filter((t) => statusOf(t.id) === "done").length;
            const isOpen = openGroups.has(g.id) || !!q || filter !== "all";
            return (
              <Card key={g.id} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenGroups((s) => (s.has(g.id) ? new Set([...s].filter((x) => x !== g.id)) : new Set([...s, g.id])))}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  <ChevronDown className={cx("size-4 shrink-0 transition", isOpen ? "" : "-rotate-90")} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-fg-subtle">{g.kind === "drill" ? "Drills" : "Tasks"}</span>
                    <span className="font-semibold">{g.title}</span>
                    {PRIVATE_GROUPS.has(g.id) && <span className="ml-2 rounded bg-canvas-inset px-1.5 py-0.5 text-[10.5px] font-semibold text-fg-muted">private: not on the public page</span>}
                  </span>
                  <span className="shrink-0 text-[13px] text-fg-muted">
                    {done}/{all.length}
                  </span>
                </button>
                {isOpen && (
                  <ul className="border-t border-border-default">
                    {shown.map((t) => (
                      <Row key={t.id} task={t} p={progress[t.id]} onSet={(s, n, ev) => set(t.id, s, n, ev)} />
                    ))}
                  </ul>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
