import { Check, Loader } from "lucide-react";
import type { Progress, TaskStatus } from "@/lib/admin-sections";
import { publicTasks } from "@/lib/plan-public";

type Task = (typeof publicTasks)[number];

function List({ items, empty, icon }: { items: Task[]; empty: string; icon: React.ReactNode }) {
  return items.length ? (
      <ul className="space-y-1.5">
        {items.map((t) => (
          <li key={t.id} className="flex items-start gap-2 text-[14px] text-fg-default">
            <span className="mt-1 shrink-0">{icon}</span>
            <span className="min-w-0">
              {t.title}
              <span className="mono ml-1.5 text-[11px] text-fg-subtle">{t.id}</span>
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-[14px] text-fg-subtle">{empty}</p>
    );
}

/**
 * Where the project stands, for someone with half a minute: overall progress, what is being worked on now and what
 * was finished most recently. Live from the admin panel, like the work plan below it.
 */
export function FolionixStatus({ progress }: { progress: Progress }) {
  const status = (id: string): TaskStatus => progress[id]?.status ?? "todo";
  const counted = publicTasks.filter((t) => status(t.id) !== "skipped");
  const done = counted.filter((t) => status(t.id) === "done");
  const doing = counted.filter((t) => status(t.id) === "doing");
  const pct = (n: number) => (counted.length ? (n / counted.length) * 100 : 0);
  const newest = (a: { id: string }, b: { id: string }) => (progress[b.id]!.at > progress[a.id]!.at ? 1 : -1);
  const now = [...doing].sort(newest).slice(0, 3);
  const recent = [...done].sort(newest).slice(0, 3);
  const drills = publicTasks.filter((t) => t.id.startsWith("P-"));
  const drillsDone = drills.filter((t) => status(t.id) === "done").length;

  return (
    <div className="rounded-2xl border border-border-strong bg-canvas p-4 sm:p-5">
      {/* the numbers appear once something is finished: a row of zeros only says "nothing done" */}
      {done.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-3 border-b border-border-default pb-4">
            {[
              { n: `${Math.round(pct(done.length))}%`, l: "of the plan done" },
              { n: `${done.length}/${counted.length}`, l: "tasks and drills" },
              { n: `${drillsDone}/${drills.length}`, l: "break-and-fix drills" },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-2xl font-extrabold tracking-tight text-fg-default sm:text-3xl">{s.n}</p>
                <p className="mono mt-0.5 text-[10.5px] uppercase tracking-[0.08em] text-fg-subtle">{s.l}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-border-strong/40">
            <span className="bg-status-published" style={{ width: `${pct(done.length)}%` }} />
            <span className="bg-status-review" style={{ width: `${pct(doing.length)}%` }} />
          </div>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mono mb-2 text-[11px] uppercase tracking-[0.1em] text-status-review">Working on now</p>
          <List items={now} empty="Setting up the next step." icon={<Loader size={13} className="text-status-review" />} />
        </div>
        <div>
          <p className="mono mb-2 text-[11px] uppercase tracking-[0.1em] text-status-published">Recently finished</p>
          <List items={recent} empty="Nothing ticked off yet: the first tasks are under way." icon={<Check size={13} className="text-status-published" />} />
        </div>
      </div>
    </div>
  );
}
