import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Globe,
  GraduationCap,
  ShieldAlert,
} from "lucide-react";
import {
  backing,
  demoRules,
  demoUrls,
  drills,
  folionix,
  milestones,
  requestFlow,
  services,
  stack,
  type MilestoneState,
} from "@/lib/folionix";
import { OngoingBadge } from "@/components/projects-section";
import { PipelineDemo } from "@/components/pipeline-demo";
import { FadeIn } from "@/components/fade-in";

export const metadata: Metadata = {
  title: "Folionix — Ratul Hasan",
  description: `${folionix.title}: ${folionix.subtitle}. An ongoing DevOps learning project.`,
};

const doneCount = milestones.filter((m) => m.state === "done").length;

const stateLabel: Record<MilestoneState, string> = {
  done: "Done",
  "in-progress": "Learning now",
  planned: "Up next",
};

function Section({
  index,
  title,
  subtitle,
  children,
}: {
  index: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 sm:mt-14">
      <div className="mb-5 flex items-start gap-3">
        <span className="mono mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-strong text-[12px] text-fg-muted">
          {index}
        </span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-fg-default sm:text-2xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 max-w-2xl text-sm text-fg-muted sm:text-[15px]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

function StepNode({ state }: { state: MilestoneState }) {
  if (state === "done")
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-status-published text-canvas">
        <Check size={14} strokeWidth={3} />
      </span>
    );
  if (state === "in-progress")
    return (
      <span className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-status-review bg-canvas">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-review opacity-25 motion-reduce:animate-none" />
        <span className="h-2.5 w-2.5 rounded-full bg-status-review" />
      </span>
    );
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-dashed border-border-strong bg-canvas" />
  );
}

export default function FolionixPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="safe-top sticky top-0 z-10 border-b border-border-default bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            href="/#projects"
            className="group flex min-w-0 items-center gap-2.5 text-fg-default"
          >
            <span className="mono flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-fg-default bg-fg-default text-[13px] font-bold leading-none tracking-tight text-canvas transition-colors duration-200 group-hover:bg-canvas group-hover:text-fg-default">
              RH
            </span>
            <span className="flex min-w-0 items-center gap-1.5 text-sm font-semibold tracking-tight">
              <ArrowLeft
                size={14}
                className="shrink-0 text-fg-subtle transition-transform duration-200 group-hover:-translate-x-0.5"
              />
              <span className="truncate">Back to projects</span>
            </span>
          </Link>
          <OngoingBadge track="DevOps" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        {/* ---- Intro ---- */}
        <FadeIn>
          <p className="mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
            Project · {folionix.tagline}
          </p>
          <h1 className="mt-2 text-5xl font-extrabold tracking-[-0.04em] text-fg-default sm:text-7xl">
            {folionix.title}
          </h1>
          <p className="mt-2 text-lg font-semibold text-fg-muted sm:text-xl">
            {folionix.subtitle}
          </p>
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-fg-muted sm:text-base">
            {folionix.pitch}
          </p>
          <p className="mt-2 max-w-3xl text-[13px] italic text-fg-subtle">
            {folionix.origin}
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-7 flex gap-3 rounded-2xl border border-status-review/40 bg-status-review/[0.06] p-4 sm:p-5">
            <GraduationCap
              size={22}
              className="mt-0.5 shrink-0 text-status-review"
            />
            <div>
              <p className="text-[15px] font-semibold text-fg-default">
                Ongoing project · Learning in public
              </p>
              <p className="mt-1 text-[14px] leading-relaxed text-fg-muted">
                {folionix.journey}
              </p>
            </div>
          </div>
        </FadeIn>

        {/* ---- Roadmap ---- */}
        <Section
          index="01"
          title="Roadmap"
          subtitle="What I will do, step by step. No fixed dates; each step is done when I have learned it and it works."
        >
          <div className="mb-6 rounded-xl border border-border-default bg-canvas-subtle p-4">
            <div className="mono flex items-center justify-between text-[11px] uppercase tracking-[0.1em] text-fg-subtle">
              <span>Progress</span>
              <span>
                {doneCount} / {milestones.length} steps done
              </span>
            </div>
            <div className="mt-2 flex gap-1.5">
              {milestones.map((m) => (
                <span
                  key={m.title}
                  title={`${m.when}: ${m.title}`}
                  className={`h-2 flex-1 rounded-full ${
                    m.state === "done"
                      ? "bg-status-published"
                      : m.state === "in-progress"
                        ? "bg-status-review"
                        : "bg-border-strong/60"
                  }`}
                />
              ))}
            </div>
          </div>

          <ol className="relative">
            {milestones.map((m, i) => (
              <li key={m.title} className="relative flex gap-4 pb-6 last:pb-0">
                {i < milestones.length - 1 && (
                  <span
                    aria-hidden
                    className={`absolute left-[13px] top-8 bottom-0 w-0.5 ${
                      m.state === "done"
                        ? "bg-status-published/60"
                        : "bg-border-default"
                    }`}
                  />
                )}
                <div className="relative z-[1] shrink-0">
                  <StepNode state={m.state} />
                </div>
                <FadeIn className="min-w-0 flex-1">
                  <div
                    className={`rounded-2xl border p-4 ${
                      m.state === "in-progress"
                        ? "border-status-review/50 bg-canvas"
                        : m.state === "done"
                          ? "border-border-strong bg-canvas"
                          : "border-dashed border-border-default bg-canvas-subtle/60"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <span className="mono text-[11px] uppercase tracking-[0.1em] text-fg-subtle">
                        {m.when}
                      </span>
                      <h3 className="text-[16px] font-bold text-fg-default">
                        {m.title}
                      </h3>
                      <span
                        className={`mono ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${
                          m.state === "done"
                            ? "bg-status-published/[0.12] text-status-published"
                            : m.state === "in-progress"
                              ? "bg-status-review/[0.12] text-status-review"
                              : "border border-border-default text-fg-subtle"
                        }`}
                      >
                        {stateLabel[m.state]}
                      </span>
                    </div>
                    <ul className="mt-2.5 space-y-1">
                      {m.items.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2 text-[14px] leading-relaxed text-fg-muted"
                        >
                          <span className="mt-[9px] h-1 w-1 shrink-0 rotate-45 bg-fg-subtle" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>
              </li>
            ))}
          </ol>
        </Section>

        {/* ---- Pipeline demo ---- */}
        <Section
          index="02"
          title="The pipeline I'm building"
          subtitle="Press run to see what every change will go through, from pull request to a signed image deployed by ArgoCD."
        >
          <PipelineDemo />
        </Section>

        {/* ---- Architecture ---- */}
        <Section
          index="03"
          title="What runs inside"
          subtitle="The finished application: five services, each chosen to create a different kind of operations problem."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((svc) => (
              <div
                key={svc.name}
                className="rounded-2xl border border-border-strong bg-canvas p-4"
              >
                <p className="mono text-[14px] font-semibold text-fg-default">
                  {svc.name}
                </p>
                <p className="mono mt-0.5 text-[11px] text-fg-subtle">
                  {svc.tech}
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-fg-muted">
                  {svc.role}
                </p>
              </div>
            ))}
            <div className="rounded-2xl border border-dashed border-border-default bg-canvas-subtle p-4">
              <p className="mono text-[14px] font-semibold text-fg-default">
                backing services
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {backing.map((b) => (
                  <span
                    key={b}
                    className="mono rounded-full border border-border-default px-2.5 py-1 text-[10px] uppercase tracking-[0.08em] text-fg-muted"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-border-default bg-canvas-subtle p-4">
            <p className="mono text-[11px] uppercase tracking-[0.1em] text-fg-subtle">
              One thesis upload, end to end
            </p>
            <ol className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-2">
              {requestFlow.map((step, i) => (
                <li key={step} className="flex items-center gap-1.5">
                  <span className="mono rounded-md border border-border-strong bg-canvas px-2 py-1 text-[11px] text-fg-default">
                    {step}
                  </span>
                  {i < requestFlow.length - 1 && (
                    <ArrowRight size={12} className="text-fg-subtle" />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </Section>

        {/* ---- Public demo ---- */}
        <Section
          index="04"
          title="The public demo (coming)"
          subtitle="When the Kubernetes step is done, anyone will be able to try it. These addresses are not live yet."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {demoUrls.map((u) => (
              <div
                key={u.host}
                className="flex items-start gap-3 rounded-2xl border border-dashed border-border-strong bg-canvas p-4"
              >
                <Globe size={18} className="mt-0.5 shrink-0 text-fg-subtle" />
                <div className="min-w-0">
                  <p className="mono break-all text-[13px] font-semibold text-fg-default">
                    {u.host}
                  </p>
                  <p className="mt-1 text-[13px] text-fg-muted">{u.what}</p>
                </div>
                <span className="mono ml-auto inline-flex shrink-0 items-center gap-1 text-[10px] uppercase tracking-[0.08em] text-fg-subtle">
                  <Clock size={11} />
                  Soon
                </span>
              </div>
            ))}
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {demoRules.map((r) => (
              <li
                key={r}
                className="rounded-full border border-border-default bg-canvas-subtle px-3 py-1 text-[13px] text-fg-muted"
              >
                {r}
              </li>
            ))}
          </ul>
        </Section>

        {/* ---- Drills ---- */}
        <Section
          index="05"
          title="Failure drills I plan to run"
          subtitle="Break it on purpose, fix it, and write up what happened. Each one will get its own write-up and recording."
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            {drills.map((d) => (
              <div
                key={d.id}
                className="flex items-start gap-3 rounded-xl border border-border-default bg-canvas p-3"
              >
                <span className="mono flex h-7 min-w-[2.75rem] shrink-0 items-center justify-center rounded-md border border-border-strong bg-canvas-subtle text-[11px] font-semibold text-fg-muted">
                  {d.id}
                </span>
                <p className="text-[14px] leading-snug text-fg-muted">
                  {d.title}
                </p>
                <ShieldAlert
                  size={14}
                  className="ml-auto mt-0.5 shrink-0 text-fg-subtle"
                />
              </div>
            ))}
          </div>
        </Section>

        {/* ---- Stack ---- */}
        <Section
          index="06"
          title="Tools I'm learning through it"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(stack).map(([group, tools]) => (
              <div key={group}>
                <p className="mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">
                  {group}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {tools.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border-default bg-canvas-subtle px-2.5 py-1 text-[13px] font-medium text-fg-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ---- Ownership ---- */}
        <Section index="07" title="Who builds what">
          <div className="grid gap-3 sm:grid-cols-2">
            {folionix.ownership.map((o) => (
              <div
                key={o.repo}
                className="rounded-2xl border border-border-strong bg-canvas p-4"
              >
                <p className="mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">
                  {o.label}
                </p>
                <p className="mono mt-1 text-[14px] font-semibold text-fg-default">
                  {o.repo}
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-fg-muted">
                  {o.text}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[13px] text-fg-subtle">
            Repositories will be made public as each step is finished.
          </p>
        </Section>

        <div className="mt-14 border-t border-border-default pt-6">
          <Link
            href="/#projects"
            className="group mono inline-flex items-center gap-1.5 text-[13px] text-fg-muted transition-colors hover:text-fg-default"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Back to all projects
          </Link>
        </div>
      </main>
    </div>
  );
}
