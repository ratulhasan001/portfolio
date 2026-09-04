"use client";

import { BookMarked, ExternalLink, Star, GitFork } from "lucide-react";
import { projects } from "@/lib/data";
import { SectionTitle } from "./ui";
import { StaggerGroup, staggerItem } from "./fade-in";
import { TiltCard } from "./tilt-card";
import { PopWords } from "./pop-in";
import { ParallaxLayer } from "./parallax-layer";
import { Disclosure } from "./disclosure";

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9"
    >
      <ParallaxLayer speed={35}>
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_10%,transparent_70%)]" />
      </ParallaxLayer>

      <SectionTitle
        index="05"
        title="Pinned Projects"
        subtitle="Applied systems work — blockchain, decentralized infrastructure, and full-stack platforms."
      />

      <StaggerGroup className="grid gap-2.5 sm:grid-cols-2">
        {projects.map((project) => (
          <TiltCard
            key={project.name}
            variants={staggerItem}
            className="rounded-md border border-border-default bg-canvas-subtle p-4 shadow-sm transition-colors hover:border-accent/50"
          >
            <div className="flex items-center justify-between gap-2">
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-accent transition-[letter-spacing] duration-300 hover:tracking-wide"
              >
                <BookMarked size={14} />
                <PopWords text={project.name} inView stagger={0.04} />
                <ExternalLink
                  size={12}
                  className="text-fg-subtle opacity-0 transition-opacity group-hover:opacity-100"
                />
              </a>
              <span className="flex shrink-0 items-center gap-1.5 text-xs text-fg-subtle">
                <span
                  className="animate-pulse-dot h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: project.languageColor }}
                />
                {project.language}
              </span>
            </div>

            <Disclosure title="Show project details" className="mt-2">
              <p className="text-sm leading-relaxed text-fg-muted">
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

              <div className="mt-3 flex items-center gap-4 text-xs text-fg-subtle">
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
        ))}
      </StaggerGroup>
    </section>
  );
}
