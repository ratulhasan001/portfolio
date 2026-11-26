import { ArrowUpRight, Check, CircleDashed, FileText, GitCommitHorizontal, Image as ImageIcon, LineChart, Loader, Play, SquareTerminal, Gauge, ClipboardList, Link2 } from "lucide-react";
import { EVIDENCE_KINDS, type EvidenceKind, type Progress } from "@/lib/admin-sections";
import { MAJOR, majorDrills, publicTasks } from "@/lib/plan-public";


export const EVIDENCE_ICON: Record<EvidenceKind, typeof FileText> = {
  writeup: FileText,
  video: Play,
  recording: SquareTerminal,
  dashboard: LineChart,
  screenshot: ImageIcon,
  commit: GitCommitHorizontal,
  postmortem: ClipboardList,
  loadtest: Gauge,
  other: Link2,
};
export const evidenceLabel = (k: EvidenceKind) => EVIDENCE_KINDS.find((x) => x.id === k)?.label ?? "Link";
const isImage = (url: string) => /\.(png|jpe?g|webp|gif)$/i.test(new URL(url).pathname);

/**
 * The 24 major drills (S-1 to S-24), all listed from the start. A drill with proof (or marked done) in the admin panel
 * shows its full report: summary, measured numbers, screenshots and links. The rest show their goal and what will be
 * measured. Any other task marked "showcase" in the admin panel is reported here too.
 */
export function DrillReports({ progress }: { progress: Progress }) {
  const hasReport = (id: string) => !!progress[id]?.evidence || progress[id]?.status === "done";
  const rank = (id: string) => (progress[id]?.status === "done" ? 0 : 1);
  const shown = [...majorDrills.filter((t) => hasReport(t.id)), ...publicTasks.filter((t) => t.group !== MAJOR && progress[t.id]?.evidence?.showcase)]
    .sort((a, b) => rank(a.id) - rank(b.id));
  const pending = majorDrills.filter((t) => !hasReport(t.id));

  return (
    <div className="space-y-4">
      {shown.length > 0 && <Reports shown={shown} progress={progress} />}
      {pending.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pending.map((t) => {
            const doing = progress[t.id]?.status === "doing";
            return (
              <article key={t.id} id={`report-${t.id}`} className={`flex flex-col rounded-2xl border p-4 ${doing ? "border-status-review/50 bg-canvas" : "border-border-default bg-canvas-subtle/60"}`}>
                <div className="flex items-center gap-2">
                  <span className="mono text-[11px] uppercase tracking-[0.1em] text-fg-subtle">{t.id}</span>
                  <span
                    className={`mono ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${
                      doing ? "bg-status-review/[0.12] text-status-review" : "border border-border-default text-fg-subtle"
                    }`}
                  >
                    {doing ? <Loader size={11} /> : <CircleDashed size={11} />} {doing ? "In progress" : "Planned"}
                  </span>
                </div>
                <h3 className="mt-1.5 text-[15px] font-bold text-fg-default">{t.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-fg-muted">{t.how}</p>
                <p className="mt-auto pt-2.5 text-[13px] text-fg-default">
                  <span className="mono text-[10.5px] uppercase tracking-[0.08em] text-fg-subtle">Target · </span>
                  {t.done}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Reports({ shown, progress }: { shown: typeof publicTasks; progress: Progress }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {shown.map((t) => {
        const p = progress[t.id]!;
        const e = p.evidence ?? {};
        const images = (e.links ?? []).filter((l) => l.kind === "screenshot" || l.kind === "dashboard").filter((l) => isImage(l.url));
        return (
          <article key={t.id} id={`report-${t.id}`} className="flex flex-col rounded-2xl border border-border-strong bg-canvas p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mono text-[11px] uppercase tracking-[0.1em] text-fg-subtle">{t.id}</span>
              <span
                className={`mono ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${
                  p.status === "done" ? "bg-status-published/[0.12] text-status-published" : "bg-status-review/[0.12] text-status-review"
                }`}
              >
                {p.status === "done" ? <Check size={11} /> : <Loader size={11} />} {p.status === "done" ? "Done" : "In progress"}
              </span>
            </div>
            <h3 className="mt-1.5 text-[16px] font-bold text-fg-default">{t.title}</h3>
            <p className="mt-2 whitespace-pre-line text-[14px] leading-relaxed text-fg-muted">{e.summary || t.how}</p>

            {e.metrics?.length ? (
              <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {e.metrics.map((m) => (
                  <div key={m.label} className="rounded-xl border border-border-default bg-canvas-subtle px-3 py-2">
                    <dt className="mono text-[10.5px] uppercase tracking-[0.08em] text-fg-subtle">{m.label}</dt>
                    <dd className="mt-0.5 text-[17px] font-bold text-fg-default">{m.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {images.slice(0, 2).map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="overflow-hidden rounded-lg border border-border-default">
                    {/* eslint-disable-next-line @next/next/no-img-element -- uploaded proof, shown as is */}
                    <img src={l.url} alt={l.label || `${evidenceLabel(l.kind)} for ${t.id}`} loading="lazy" className="aspect-video w-full object-cover" />
                  </a>
                ))}
              </div>
            )}

            {e.links?.length ? (
              <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
                {e.links.map((l) => {
                  const Icon = EVIDENCE_ICON[l.kind];
                  return (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-1.5 rounded-full border border-border-default px-2.5 py-1 text-[12.5px] text-fg-muted transition-colors hover:border-fg-default hover:text-fg-default"
                    >
                      <Icon size={13} /> {l.label || evidenceLabel(l.kind)}
                      <ArrowUpRight size={12} className="opacity-50 group-hover:opacity-100" />
                    </a>
                  );
                })}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
