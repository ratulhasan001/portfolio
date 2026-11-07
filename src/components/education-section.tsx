"use client";

import Image from "next/image";
import { ExternalLink, GraduationCap } from "lucide-react";
import { education, type Education } from "@/lib/data";
import { SectionTitle } from "./ui";
import { FadeIn } from "./fade-in";
import { WipeWords } from "./wipe-in";

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
  const thesis = edu.detail?.replace(/^Thesis:\s*/, "");

  return (
    <li className="px-4 py-4 sm:px-5 sm:py-5">
      <div className="flex gap-3 sm:gap-4">
        {/* No plate, no rule, no crop: these are crests with fanned ribbons
            that a rounded frame would clip, so the artwork stands on its own. */}
        <span className="relative mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center">
          {edu.logo ? (
            <Image
              src={edu.logo}
              alt={edu.school}
              fill
              sizes="44px"
              className="mark-real object-contain"
            />
          ) : (
            <GraduationCap size={18} className="text-fg-muted" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1.5">
            <h3 className="min-w-0 flex-1 text-[17px] font-semibold leading-snug tracking-tight text-fg-default sm:text-xl">
              <WipeWords text={edu.degree} inView stagger={0.04} />
            </h3>
            <span className="mono mt-0.5 shrink-0 text-[10px] uppercase tracking-[0.16em] text-fg-muted sm:text-[11px]">
              {edu.period}
            </span>
          </div>

          <p className="mt-1 text-[15px] font-medium text-fg-muted">
            <WipeWords text={edu.school} inView delay={0.1} stagger={0.04} />
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

          </div>

          {thesis && (
            <div>
                <div className="mt-4 space-y-3 border-t border-border-default pt-3">
                  <div>
                    <p className="mono mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                      Thesis
                    </p>
                    <p className="text-sm leading-relaxed text-fg-muted">{thesis}</p>
                  </div>
                  {edu.supervisors?.map((sup) => (
                    <div key={sup.name}>
                      <p className="mono mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                        {sup.role}
                      </p>
                      <p className="text-sm leading-relaxed text-fg-muted">
                        {sup.link ? (
                          <a
                            href={sup.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-medium text-fg-default underline decoration-fg-subtle underline-offset-4 transition-colors hover:decoration-fg-default"
                          >
                            {sup.name}
                            <ExternalLink size={11} />
                          </a>
                        ) : (
                          <span className="font-medium text-fg-default">
                            {sup.name}
                          </span>
                        )}
                        , {sup.title}
                      </p>
                    </div>
                  ))}
                </div>
            </div>
          )}
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
