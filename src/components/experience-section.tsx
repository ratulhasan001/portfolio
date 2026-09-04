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

      <SectionTitle
        index="03"
        title="Experience"
        subtitle="A commit history of roles and research positions."
      />

      <ol className="relative max-w-3xl border-l border-border-default pl-8">
        {experience.map((exp, i) => (
          <motion.li
            key={exp.org}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 last:mb-0"
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
                <>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <h4 className="text-sm font-semibold text-fg-default sm:text-base">
                      <PopWords text={exp.role} inView stagger={0.04} />
                    </h4>
                    <span className="text-fg-subtle">·</span>
                    <p className="text-sm font-medium text-accent">
                      <PopWords text={exp.org} inView delay={0.1} stagger={0.04} />
                    </p>
                  </div>
                  <p className="mono mt-0.5 text-xs text-fg-subtle">
                    {exp.period} · {exp.location}
                  </p>
                </>
              }
            >
              <ul className="space-y-1.5 text-sm text-fg-muted">
                {exp.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-fg-subtle" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {exp.tags.map((tag) => (
                  <Chip key={tag}>{tag}</Chip>
                ))}
              </div>
            </Disclosure>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
