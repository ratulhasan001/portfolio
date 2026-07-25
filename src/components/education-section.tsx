"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { education } from "@/lib/data";
import { SectionTitle, Chip } from "./ui";
import { PopWords } from "./pop-in";
import { ParallaxLayer } from "./parallax-layer";

export function EducationSection() {
  return (
    <section
      id="education"
      className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14"
    >
      <ParallaxLayer speed={35}>
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_10%,transparent_70%)]" />
      </ParallaxLayer>

      <SectionTitle
        index="02"
        title="Education"
        subtitle="Academic record and the thesis work anchoring my research direction."
      />

      <ol className="relative max-w-3xl border-l border-border-default pl-6">
        {education.map((edu, i) => (
          <motion.li
            key={edu.school}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 last:mb-0"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.15, type: "spring" }}
              className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-canvas bg-accent"
            >
              <GraduationCap size={9} className="text-canvas" />
            </motion.span>

            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-semibold text-fg-default">
                <PopWords text={edu.degree} inView stagger={0.04} />
              </h4>
              {edu.merit && (
                <span className="rounded-full bg-success-subtle px-2 py-0.5 text-[11px] font-medium text-success">
                  {edu.merit}
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-accent">
              <PopWords text={edu.school} inView delay={0.1} stagger={0.04} />
            </p>
            <p className="mono mt-0.5 text-xs text-fg-subtle">
              {edu.period} · {edu.location}
            </p>
            {edu.detail && (
              <ul className="mt-3 space-y-1.5 text-sm text-fg-muted">
                <li className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-fg-subtle" />
                  {edu.detail}
                </li>
              </ul>
            )}
            {edu.score && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Chip>
                  {edu.score.label} {edu.score.value.toFixed(2)} /{" "}
                  {edu.score.scale.toFixed(1)}
                </Chip>
              </div>
            )}
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
