"use client";

import { motion } from "framer-motion";
import { GraduationCap, Medal } from "lucide-react";
import { education } from "@/lib/data";
import { SectionTitle } from "./ui";
import { FadeIn } from "./fade-in";
import { TiltCard } from "./tilt-card";
import { CountUp } from "./count-up";
import { PopWords } from "./pop-in";
import { ParallaxLayer } from "./parallax-layer";

export function EducationSection() {
  return (
    <section
      id="education"
      className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <ParallaxLayer speed={35}>
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_10%,transparent_70%)]" />
      </ParallaxLayer>

      <SectionTitle
        index="02"
        title="Education"
        subtitle="Academic record and the thesis work anchoring my research direction."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {education.map((edu, i) => (
          <FadeIn key={edu.school} delay={i * 0.12}>
            <TiltCard className="h-full rounded-lg border border-border-default bg-canvas-subtle p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <motion.span
                  whileHover={{ rotate: -12, scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border-default bg-canvas text-done"
                >
                  <GraduationCap size={18} />
                </motion.span>
                <div>
                  <h3 className="text-base font-semibold leading-snug text-fg-default">
                    <PopWords text={edu.school} inView stagger={0.03} />
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-done">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-done" />
                    {edu.degree}
                  </p>
                  <p className="mono mt-1 text-xs text-fg-subtle">
                    {edu.period} · {edu.location}
                  </p>
                  {edu.merit && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5, y: -6 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 420, damping: 14, delay: 0.25 }}
                      whileHover={{ scale: 1.06, rotate: -2 }}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-attention/30 bg-attention-subtle px-2.5 py-1 text-xs font-semibold text-attention"
                    >
                      <Medal size={13} />
                      {edu.merit}
                    </motion.span>
                  )}
                </div>
              </div>

              {edu.score && (
                <div className="mt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="mono text-xs uppercase tracking-wider text-fg-subtle">
                      {edu.score.label}
                    </span>
                    <span className="mono flex items-baseline gap-1">
                      <span className="gradient-text text-2xl font-extrabold">
                        <CountUp value={edu.score.value} decimals={2} />
                      </span>
                      <span className="text-sm text-fg-subtle">
                        / {edu.score.scale.toFixed(1)}
                      </span>
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-canvas-inset">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{
                        width: `${(edu.score.value / edu.score.scale) * 100}%`,
                      }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-accent to-done"
                    />
                  </div>
                </div>
              )}

              {edu.detail && (
                <p className="shimmer mt-4 rounded-md border border-border-muted bg-canvas px-3.5 py-3 text-sm leading-relaxed text-fg-muted">
                  {edu.detail}
                </p>
              )}
            </TiltCard>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
