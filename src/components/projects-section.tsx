"use client";

import { ArrowUpRight } from "lucide-react";
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
                  <span className="mono text-[11px] text-fg-subtle">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold leading-snug tracking-tight text-fg-default">
                  <WipeWords text={project.name} inView stagger={0.04} />
                </h3>

                <p className="mt-2 text-[14px] leading-relaxed text-fg-muted">
                  {project.description}
                </p>

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
              </div>
            </TiltCard>
          );
        })}
      </StaggerGroup>
    </section>
  );
}
