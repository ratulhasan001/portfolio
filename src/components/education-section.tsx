"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, GraduationCap } from "lucide-react";
import { education, type Education } from "@/lib/data";
import { SectionTitle } from "./ui";
import { FadeIn } from "./fade-in";
import { PopWords } from "./pop-in";
import { ParallaxLayer } from "./parallax-layer";

/** Inline separator. Hidden on phones, where the meta row wraps onto
 *  several lines and the dots would be left dangling at the line ends. */
function Dot() {
  return (
    <span aria-hidden className="hidden text-fg-subtle sm:inline">
      ·
    </span>
  );
}

function EducationRow({ edu }: { edu: Education }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const thesis = edu.detail?.replace(/^Thesis:\s*/, "");

  return (
    <li className="px-4 py-4 sm:px-5 sm:py-5">
      <div className="flex gap-3 sm:gap-4">
        <span className="logo-plate relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border-default shadow-sm">
          {edu.logo ? (
            <Image
              src={edu.logo}
              alt={edu.school}
              fill
              sizes="40px"
              className="mark-real object-contain p-0.5"
            />
          ) : (
            <GraduationCap size={16} className="text-fg-muted" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1.5">
            <h3 className="min-w-0 flex-1 text-[17px] font-semibold leading-snug tracking-tight text-fg-default sm:text-xl">
              <PopWords text={edu.degree} inView stagger={0.04} />
            </h3>
            <span className="mono mt-0.5 shrink-0 text-[10px] uppercase tracking-[0.16em] text-fg-muted sm:text-[11px]">
              {edu.period}
            </span>
          </div>

          <p className="mt-1 text-[15px] font-medium text-fg-muted">
            <PopWords text={edu.school} inView delay={0.1} stagger={0.04} />
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-2">
            {edu.score && (
              <span className="mono rounded-full border border-border-default px-3 py-1 text-[10px] uppercase tracking-[0.1em] text-fg-muted sm:text-[11px]">
                {edu.score.label} {edu.score.value.toFixed(2)}/
                {edu.score.scale.toFixed(1)}
              </span>
            )}

            <Dot />
            <span className="mono text-[10px] uppercase tracking-[0.1em] text-fg-subtle sm:text-[11px]">
              {edu.location}
            </span>

            {edu.merit && (
              <>
                <Dot />
                <span className="mono text-[10px] uppercase tracking-[0.1em] text-status-published sm:text-[11px]">
                  {edu.merit}
                </span>
              </>
            )}

            {thesis && (
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={panelId}
                aria-label={open ? "Hide thesis" : "Show thesis"}
                title={open ? "Hide thesis" : "Show thesis"}
                className={`ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  open
                    ? "border-fg-default bg-fg-default text-canvas"
                    : "border-border-default text-fg-muted hover:border-fg-subtle hover:text-fg-default"
                }`}
              >
                <motion.span
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="flex"
                >
                  <ChevronDown size={14} />
                </motion.span>
              </button>
            )}
          </div>

          <AnimatePresence initial={false}>
            {open && thesis && (
              <motion.div
                id={panelId}
                key="panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-4 border-t border-border-default pt-3">
                  <p className="mono mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                    Thesis
                  </p>
                  <p className="text-sm leading-relaxed text-fg-muted">{thesis}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </li>
  );
}

export function EducationSection() {
  return (
    <section
      id="education"
      className="relative mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-9"
    >
      <ParallaxLayer speed={35}>
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_10%,transparent_70%)]" />
      </ParallaxLayer>

      <SectionTitle index="02" title="Education" />

      <FadeIn>
        <div className="overflow-hidden rounded-2xl border border-border-strong bg-canvas">
          <div className="flex items-center gap-3 border-b border-border-default px-4 py-2.5 sm:px-5">
            <span className="mono flex min-w-0 items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-fg-muted sm:text-[11px]">
              <GraduationCap size={13} className="shrink-0" />
              <span className="truncate">Academic Background</span>
            </span>
          </div>

          <ul className="divide-y divide-border-default">
            {education.map((edu) => (
              <EducationRow key={edu.school} edu={edu} />
            ))}
          </ul>
        </div>
      </FadeIn>
    </section>
  );
}
