"use client";

import { ExternalLink, Star, GitFork } from "lucide-react";
import {
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
import { PopWords } from "./pop-in";
import { ParallaxLayer } from "./parallax-layer";
import { Disclosure } from "./disclosure";

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
  solidity: { Icon: SiSolidity, color: "#363636", darkColor: "#C9C9C9" },
  django: { Icon: SiDjango, color: "#092E20", darkColor: "#44B78B" },
  javascript: { Icon: SiJavascript, color: "#F7DF1E" },
  java: { Icon: SiOpenjdk, color: "#E76F00" },
  bootstrap: { Icon: SiBootstrap, color: "#7952B3" },
};

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9"
    >
      <ParallaxLayer speed={35}>
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_10%,transparent_70%)]" />
      </ParallaxLayer>

      <SectionTitle index="05" title="Pinned Projects" />

      {/* Five square tiles across on desktop so the whole set reads as one
          row; they fall back to 2-up and 1-up as the viewport narrows.
          `items-start` matters: without it the grid stretches every tile to
          match the tallest, so opening one card visibly grows all five. */}
      <StaggerGroup className="grid grid-cols-1 items-start gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
        {projects.map((project) => {
          const mark = projectIcons[project.icon];
          return (
            <TiltCard
              key={project.name}
              variants={staggerItem}
              className="flex flex-col rounded-md border border-border-default bg-canvas-subtle p-3.5 shadow-sm transition-colors hover:border-accent/50"
            >
              <Disclosure
                title="Show project details"
                summary={
                  <div className="min-w-0">
                    {mark && (
                      <span
                        className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-md border border-border-default bg-canvas [color:var(--mark)] dark:[color:var(--mark-dark)]"
                        style={
                          {
                            "--mark": mark.color,
                            "--mark-dark": mark.darkColor ?? mark.color,
                          } as React.CSSProperties
                        }
                        title={project.language}
                      >
                        <mark.Icon size={20} />
                      </span>
                    )}
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="group/name flex items-start gap-1 text-[15px] font-semibold leading-snug text-fg-default underline-offset-4 hover:underline"
                    >
                      <span className="min-w-0">
                        <PopWords text={project.name} inView stagger={0.04} />
                      </span>
                      <ExternalLink
                        size={12}
                        className="mt-1 shrink-0 text-fg-subtle opacity-0 transition-opacity group-hover/name:opacity-100"
                      />
                    </a>
                    <span className="mt-1.5 flex items-center gap-1.5 text-[13px] text-fg-subtle">
                      <span
                        className="animate-pulse-dot h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: project.languageColor }}
                      />
                      {project.language}
                    </span>
                  </div>
                }
              >
                <p className="text-[13px] leading-relaxed text-fg-muted">
                  {project.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="chip rounded-full border border-border-muted bg-canvas px-2 py-0.5 text-[11px] text-fg-muted transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-3 text-[12px] text-fg-subtle">
                  <span className="flex items-center gap-1">
                    <Star size={12} />
                    Featured
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork size={12} />
                    Public
                  </span>
                </div>
              </Disclosure>
            </TiltCard>
          );
        })}
      </StaggerGroup>
    </section>
  );
}
