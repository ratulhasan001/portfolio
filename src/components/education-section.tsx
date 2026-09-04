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
    <>
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="text-base font-semibold text-fg-default sm:text-lg">
          <PopWords text={edu.degree} inView stagger={0.04} />
        </h4>
        {edu.score && (
          <span className="mono rounded-full border border-border-muted bg-canvas px-2 py-0.5 text-xs text-fg-muted">
            {edu.score.label} {edu.score.value.toFixed(2)}/
            {edu.score.scale.toFixed(1)}
          </span>
        )}
        {edu.merit && (
          <span className="rounded-full bg-success-subtle px-2 py-0.5 text-xs font-medium text-success">
            {edu.merit}
          </span>
        )}
      </div>
      <p className="text-[15px] font-medium text-accent">
        <PopWords text={edu.school} inView delay={0.1} stagger={0.04} />
      </p>
      <p className="mono mt-1 text-[13px] text-fg-subtle">
        {edu.period} · {edu.location}
      </p>
    </>
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

      <SectionTitle
        index="02"
        title="Education"
        subtitle="Academic record and the thesis work anchoring my research direction."
      />

      <ol className="relative max-w-3xl border-l border-border-default pl-8">
        {education.map((edu, i) => (
          <motion.li
            key={edu.school}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 last:mb-0"
          >
            <TimelineLogo
              src={edu.logo}
              alt={edu.school}
              delay={i * 0.1 + 0.15}
              fallback={<GraduationCap size={12} />}
            />

            {edu.detail ? (
              <Disclosure title="Show thesis" summary={<EntryHead edu={edu} />}>
                <p className="text-[15px] leading-relaxed text-fg-muted">
                  {edu.detail}
                </p>
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
