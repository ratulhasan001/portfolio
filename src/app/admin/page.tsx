"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, KanbanSquare } from "lucide-react";
import { SECTIONS, type Progress } from "@/lib/admin-sections";
import plan from "@/lib/folionix-plan.json";
import { adminApi, type PublishInfo } from "@/components/admin/api";
import { PublishBar } from "@/components/admin/PublishBar";
import { Card, cx } from "@/components/admin/kit";

interface SectionState {
  data: unknown;
  saved: boolean;
  updatedAt: string | null;
}

const count = (v: unknown) => (Array.isArray(v) ? v.length : v && typeof v === "object" ? Object.keys(v).length : 0);

export default function Dashboard() {
  const [sections, setSections] = useState<Record<string, SectionState> | null>(null);
  const [publish, setPublish] = useState<PublishInfo | null>(null);
  const [progress, setProgress] = useState<Progress>({});
  const [db, setDb] = useState(true);

  useEffect(() => {
    adminApi<{ sections: Record<string, SectionState>; publish: PublishInfo; db: boolean }>("/api/admin/sections").then((b) => {
      if (b.sections) {
        setSections(b.sections);
        setPublish(b.publish);
        setDb(b.db);
      }
    });
    adminApi<{ progress: Progress }>("/api/admin/progress").then((b) => b.progress && setProgress(b.progress));
  }, []);

  const total = plan.tasks.length;
  const done = plan.tasks.filter((t) => progress[t.id]?.status === "done").length;
  const doing = plan.tasks.filter((t) => progress[t.id]?.status === "doing").length;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Dashboard</h1>
      <p className="mb-5 text-sm text-fg-muted">Edit any part of the portfolio, then publish. Folionix progress goes live as you tick it.</p>
      {!db && (
        <p className="mb-5 rounded-2xl border border-border-default bg-canvas px-4 py-3 text-[13.5px]">
          No database is connected (DATABASE_URL), so you can look around but not save.
        </p>
      )}
      <PublishBar info={publish} onChange={setPublish} />

      <Link href="/admin/folionix" className="mb-6 block">
        <Card className="flex items-center gap-4 p-4 transition hover:border-fg-subtle">
          <KanbanSquare className="size-6 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Folionix work progress</p>
            <p className="text-[13px] text-fg-muted">
              {done} of {total} done · {doing} in progress · shown live at ratulhasan.dev/projects/folionix
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-canvas-inset">
              <div className="h-full rounded-full bg-fg-default transition-all" style={{ width: `${(done / total) * 100}%` }} />
            </div>
          </div>
          <ChevronRight className="size-5 text-fg-muted" />
        </Card>
      </Link>

      {(["Home", "Folionix"] as const).map((page) => (
        <section key={page} className="mb-6">
          <h2 className="mb-2 text-[13px] font-bold uppercase tracking-[0.12em] text-fg-muted">{page === "Home" ? "Home page" : "Folionix page"}</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.filter((s) => s.page === page).map((s) => {
              const st = sections?.[s.key];
              return (
                <Link key={s.key} href={`/admin/sections/${s.key}`}>
                  <Card className="h-full p-4 transition hover:border-fg-subtle">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold">{s.label}</p>
                      {st && <span className={cx("rounded-full px-2 py-0.5 text-[11px] font-semibold", st.saved ? "bg-accent text-on-accent" : "bg-canvas-inset text-fg-muted")}>{st.saved ? "Edited" : "Built-in"}</span>}
                    </div>
                    <p className="mt-1 text-[13px] text-fg-muted">{s.hint}</p>
                    {st && <p className="mt-2 text-[12px] text-fg-subtle">{count(st.data)} {Array.isArray(st.data) ? "items" : "fields"}</p>}
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
