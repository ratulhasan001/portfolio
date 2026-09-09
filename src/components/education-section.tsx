"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { education, type Education } from "@/lib/data";
import { SectionTitle } from "./ui";
import { PopWords } from "./pop-in";
import { ParallaxLayer } from "./parallax-layer";
import { Disclosure } from "./disclosure";
import { TimelineLogo } from "./timeline-logo";

function EntryHead({ edu }: { edu: Education }) {
  return (
    <div className="min-w-0">
      {/* Degree carries the weight; the years sit out at the right margin in
          mono so the column of periods scans on its own. */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="text-lg font-semibold leading-tight tracking-tight text-fg-default sm:text-xl">
          <PopWords text={edu.degree} inView stagger={0.04} />
        </h4>
        <span className="mono shrink-0 text-[11px] uppercase tracking-[0.1em] text-fg-subtle">
          {edu.period}
        </span>
      </div>

      <p className="mt-1 text-[15px] font-medium text-fg-muted">
        <PopWords text={edu.school} inView delay={0.1} stagger={0.04} />
      </p>

      <div className="mono mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-fg-subtle">
        <span>{edu.location}</span>
        {edu.score && (
          <>
            <span aria-hidden>·</span>
            <span className="text-fg-default">
              {edu.score.label} {edu.score.value.toFixed(2)}/
              {edu.score.scale.toFixed(1)}
            </span>
          </>
        )}
        {edu.merit && (
          <>
            <span aria-hidden>·</span>
            <span className="uppercase tracking-[0.1em] text-status-published">
              {edu.merit}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export function EducationSection() {
  return (
    <section
      id="education"
      className="relative mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9"
    >
      <ParallaxLayer speed={35}>
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_10%,transparent_70%)]" />
      </ParallaxLayer>

      <SectionTitle index="02" title="Education" />

      <ol className="relative ml-5 max-w-4xl border-l border-border-default pl-8 sm:ml-6 sm:pl-10">
        {education.map((edu, i) => (
          <motion.li
            key={edu.school}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-7 last:mb-0"
          >
            <TimelineLogo
              src={edu.logo}
              alt={edu.school}
              delay={i * 0.1 + 0.15}
              fallback={<GraduationCap size={12} />}
            />

            {edu.detail ? (
              <Disclosure title="Show thesis" summary={<EntryHead edu={edu} />}>
                <div className="border-l-2 border-border-muted pl-4">
                  <p className="mono mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
                    Thesis
                  </p>
                  <p className="text-[15px] leading-relaxed text-fg-muted">
                    {edu.detail.replace(/^Thesis:\s*/, "")}
                  </p>
                </div>
              </Disclosure>
            ) : (
              <EntryHead edu={edu} />
            )}
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
