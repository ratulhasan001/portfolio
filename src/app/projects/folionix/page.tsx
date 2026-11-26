import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { backing, folionix, requestFlow, services } from "@/lib/folionix";
import { OngoingBadge } from "@/components/projects-section";
import { PipelineDemo } from "@/components/pipeline-demo";
import { FadeIn } from "@/components/fade-in";
import { ogImage } from "@/lib/og";
import { WorkPlan } from "@/components/work-plan";
import { DrillReports } from "@/components/drill-reports";
import { FolionixStatus } from "@/components/folionix-status";
import { publicProgress } from "@/lib/server/content";

// The work plan's progress comes from the admin panel: cached, and refreshed the moment a status changes there.
export const revalidate = 3600;

const title = "Folionix | Ratul Hasan";
const description = `${folionix.title}: ${folionix.subtitle}. An ongoing DevOps learning project.`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: "article",
    url: "/projects/folionix",
    siteName: "Ratul Hasan",
    title,
    description,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
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

export default async function FolionixPage() {
  const progress = await publicProgress();
  const links = (folionix.links ?? []).filter((l) => /^https:\/\//.test(l.url));
  const decisions = (folionix.decisions ?? []).filter((d) => d.question.trim() && d.answer.trim());
  let n = 0;
  const idx = () => String(++n).padStart(2, "0");
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


        {/* ---- My role: the first thing an interviewer asks ---- */}
        <FadeIn delay={0.05}>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {folionix.ownership.map((o) => (
              <div key={o.repo} className="rounded-2xl border border-border-strong bg-canvas p-4">
                <p className="mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle">
                  {o.label} · <span className="normal-case tracking-normal">{o.repo}</span>
                </p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-fg-muted">{o.text}</p>
              </div>
            ))}
          </div>
          {links.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {links.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-fg-default px-3.5 py-1.5 text-[13px] font-semibold text-fg-default transition-colors hover:bg-fg-default hover:text-canvas"
                >
                  {l.label} <ArrowUpRight size={13} />
                </a>
              ))}
            </div>
          )}
          <p className="mt-3 text-[13px] text-fg-subtle">Both repositories are private for now and will be made public as the work progresses.</p>
        </FadeIn>

        {/* ---- Where it stands (live) ---- */}
        <Section index={idx()} title="Where it stands" subtitle="Live from my progress tracker.">
          <FolionixStatus progress={progress} />
        </Section>

        <div id="drill-reports" className="scroll-mt-20">
          <Section
            index={idx()}
            title="Major drills"
            subtitle="Failures I cause on purpose and fix, each with a target. Finished drills show the measured numbers and the proof: write-ups, recordings and graphs."
          >
            <DrillReports progress={progress} />
          </Section>
        </div>

        {/* ---- Architecture ---- */}
        <Section
          index={idx()}
          title="Architecture"
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

        {/* ---- Pipeline demo ---- */}
        <Section
          index={idx()}
          title="The CI/CD pipeline I'm building"
          subtitle="The planned pipeline as a simulation: press run to see what every change will go through, from pull request to a signed image deployed by ArgoCD."
        >
          <PipelineDemo />
        </Section>

        {/* ---- Decisions (shown once filled in from the admin panel) ---- */}
        {decisions.length > 0 && (
          <Section index={idx()} title="Decisions and trade-offs" subtitle="Why I chose what I chose, and what I gave up for it.">
            <div className="space-y-3">
              {decisions.map((d) => (
                <div key={d.question} className="rounded-2xl border border-border-default bg-canvas p-4">
                  <p className="text-[15px] font-semibold text-fg-default">{d.question}</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-fg-muted">{d.answer}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        <div id="work-plan" className="scroll-mt-20">
          <Section
            index={idx()}
            title="Work plan"
            subtitle="Every task and break-and-fix drill in the plan, with where I am right now."
          >
            <WorkPlan progress={progress} />
          </Section>
        </div>

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
