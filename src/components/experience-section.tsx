"use client";

import { motion } from "framer-motion";
import { GitCommitHorizontal } from "lucide-react";
import { experience } from "@/lib/data";
import { SectionTitle, Chip } from "./ui";
import { FadeIn } from "./fade-in";
import { PopWords } from "./pop-in";
import { ParallaxLayer } from "./parallax-layer";

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <ParallaxLayer speed={35}>
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_10%,transparent_70%)]" />
      </ParallaxLayer>

      <SectionTitle
        index="01"
        title="Experience"
        subtitle="A commit history of roles and research positions."
      />

      <ol className="relative max-w-3xl border-l border-border-default pl-6">
        {experience.map((exp, i) => (
          <FadeIn key={exp.org} delay={i * 0.1}>
            <li className="mb-10 last:mb-0">
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.15, type: "spring" }}
                className={`absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-canvas ${
                  exp.current ? "bg-success" : "bg-accent"
                }`}
              >
                <GitCommitHorizontal size={9} className="text-canvas" />
              </motion.span>

              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-base font-semibold text-fg-default">
                  <PopWords text={exp.role} inView stagger={0.04} />
                </h4>
                {exp.current && (
                  <span className="rounded-full bg-success-subtle px-2 py-0.5 text-[11px] font-medium text-success">
                    current
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-accent">
                <PopWords text={exp.org} inView delay={0.1} stagger={0.04} />
              </p>
              <p className="mono mt-0.5 text-xs text-fg-subtle">
                {exp.period} · {exp.location}
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-fg-muted">
                {exp.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-fg-subtle" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {exp.tags.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </li>
          </FadeIn>
        ))}
      </ol>
    </section>
  );
}
