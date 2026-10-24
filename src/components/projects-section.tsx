"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  SiKubernetes,
  SiSolidity,
  SiDjango,
  SiJavascript,
  SiOpenjdk,
  SiBootstrap,
} from "react-icons/si";
import { projects } from "@/lib/data";
import { SectionTitle } from "./ui";
import { StaggerGroup, staggerItem } from "./fade-in";
import { TiltCard } from "./tilt-card";
import { WipeWords } from "./wipe-in";
import { ParallaxLayer } from "./parallax-layer";

/**
 * Each project's stack mark in its real brand colour. Solidity and Django
 * are drawn near-black, so they carry a lifted variant that still reads on
 * the dark canvas; the rest are legible in both themes as-is.
 */
const projectIcons: Record<
  string,
  {
    Icon: React.ComponentType<{ size?: number; className?: string }>;
    color: string;
    darkColor?: string;
  }
> = {
  kubernetes: { Icon: SiKubernetes, color: "#326CE5", darkColor: "#5B8DEF" },
  solidity: { Icon: SiSolidity, color: "#363636", darkColor: "#C9C9C9" },
  django: { Icon: SiDjango, color: "#092E20", darkColor: "#44B78B" },
  javascript: { Icon: SiJavascript, color: "#F7DF1E" },
  java: { Icon: SiOpenjdk, color: "#E76F00" },
  bootstrap: { Icon: SiBootstrap, color: "#7952B3" },
};

/** Pulsing dot + label, shared with the Folionix case-study page. */
export function OngoingBadge({ track }: { track?: string }) {
  return (
    <span className="mono inline-flex items-center gap-1.5 rounded-full border border-status-review/40 bg-status-review/[0.08] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-status-review">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-review opacity-60 motion-reduce:animate-none" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-status-review" />
      </span>
      Ongoing{track && ` · ${track}`}
    </span>
  );
}

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-9"
    >
      <ParallaxLayer speed={35}>
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_10%,transparent_70%)]" />
      </ParallaxLayer>

      <SectionTitle index="05" title="Pinned Projects" />

      {/* Grid items stretch by default, so every card in a row shares a
          height; the tag row takes mt-auto so the tags and the footer rule
          sit on the same baseline however long the description runs. */}
      <StaggerGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => {
          const mark = projectIcons[project.icon];
          return (
            <TiltCard
              key={project.name}
              variants={staggerItem}
              className="h-full rounded-2xl border border-border-strong bg-canvas p-5 transition-colors hover:border-fg-subtle"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-3">
                  {mark && (
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-border-default bg-canvas-subtle [color:var(--mark)] dark:[color:var(--mark-dark)]"
                      style={
                        {
                          "--mark": mark.color,
                          "--mark-dark": mark.darkColor ?? mark.color,
                        } as React.CSSProperties
                      }
                      title={project.language}
                    >
                      <mark.Icon size={22} />
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    {project.ongoing && <OngoingBadge track={project.track} />}
                    <span className="mono text-[11px] text-fg-subtle">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <h3 className="mt-5 text-lg font-bold leading-snug tracking-tight text-fg-default">
                  <WipeWords text={project.name} inView stagger={0.04} />
                </h3>

                <p className="mt-2 text-[14px] leading-relaxed text-fg-muted">
                  {project.description}
                </p>

                {project.supervisors?.map((sup) => (
                  <p
                    key={sup.name}
                    className="mt-3 text-[13px] leading-relaxed text-fg-muted"
                  >
                    <span className="mono mr-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                      {sup.role}
                    </span>
                    {sup.link ? (
                      <a
                        href={sup.link}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-fg-default underline decoration-fg-subtle underline-offset-4 transition-colors hover:decoration-fg-default"
                      >
                        {sup.name}
                      </a>
                    ) : (
                      <span className="font-medium text-fg-default">
                        {sup.name}
                      </span>
                    )}
                    , {sup.title}
                  </p>
                ))}

                <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="mono rounded-full border border-border-default px-2.5 py-1 text-[10px] uppercase tracking-[0.08em] text-fg-muted"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                {project.detailsHref ? (
                  <Link
                    href={project.detailsHref}
                    target="_blank"
                    rel="noreferrer"
                    className="group/link mono mt-4 flex items-center justify-between border-t border-border-default pt-4 text-[13px] text-fg-muted transition-colors hover:text-fg-default"
                  >
                    View details
                    <ArrowRight
                      size={16}
                      className="shrink-0 transition-transform duration-200 group-hover/link:translate-x-0.5"
                    />
                  </Link>
                ) : (
                  project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="group/link mono mt-4 flex items-center justify-between border-t border-border-default pt-4 text-[13px] text-fg-muted transition-colors hover:text-fg-default"
                    >
                      {project.link.includes("github.com")
                        ? "View on GitHub"
                        : "Visit site"}
                      <ArrowUpRight
                        size={16}
                        className="shrink-0 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                      />
                    </a>
                  )
                )}
              </div>
            </TiltCard>
          );
        })}
      </StaggerGroup>
    </section>
  );
}
