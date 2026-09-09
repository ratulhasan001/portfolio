"use client";

import { motion } from "framer-motion";
import { GitCommitHorizontal } from "lucide-react";
import { experience } from "@/lib/data";
import { SectionTitle, Chip } from "./ui";
import { PopWords } from "./pop-in";
import { ParallaxLayer } from "./parallax-layer";
import { Disclosure } from "./disclosure";
import { TimelineLogo } from "./timeline-logo";

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9"
    >
      <ParallaxLayer speed={35}>
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_10%,transparent_70%)]" />
      </ParallaxLayer>

      <SectionTitle index="03" title="Experience" />

      <ol className="relative ml-5 max-w-4xl border-l border-border-default pl-8 sm:ml-6 sm:pl-10">
        {experience.map((exp, i) => (
          <motion.li
            key={exp.org}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-7 last:mb-0"
          >
            <TimelineLogo
              src={exp.logo}
              alt={exp.org}
              current={exp.current}
              delay={i * 0.1 + 0.15}
              fallback={<GitCommitHorizontal size={12} />}
            />

            <Disclosure
              title="Show role details"
              summary={
                <div className="min-w-0">
                  {/* Role carries the weight; the dates sit out at the right
                      margin in mono so the column of periods scans on its own. */}
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h4 className="text-lg font-semibold leading-tight tracking-tight text-fg-default sm:text-xl">
                      <PopWords text={exp.role} inView stagger={0.04} />
                    </h4>
                    <span className="mono shrink-0 text-[11px] uppercase tracking-[0.1em] text-fg-subtle">
                      {exp.period}
                    </span>
                  </div>

                  <p className="mt-1 text-[15px] font-medium text-fg-muted">
                    <PopWords text={exp.org} inView delay={0.1} stagger={0.04} />
                  </p>

                  <div className="mono mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-fg-subtle">
                    <span>{exp.location}</span>
                    {exp.current && (
                      <>
                        <span aria-hidden>·</span>
                        <span className="inline-flex items-center gap-1.5 uppercase tracking-[0.1em] text-status-published">
                          <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-current" />
                          Current
                        </span>
                      </>
                    )}
                  </div>
                </div>
              }
            >
              <div className="border-l-2 border-border-muted pl-4">
                <ul className="space-y-2 text-[15px] leading-relaxed text-fg-muted">
                  {exp.bullets.map((b) => (
                    <li key={b} className="flex gap-2.5">
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-fg-subtle" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {exp.tags.map((tag) => (
                    <Chip key={tag}>{tag}</Chip>
                  ))}
                </div>
              </div>
            </Disclosure>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
