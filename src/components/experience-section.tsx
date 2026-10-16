"use client";

import { motion } from "framer-motion";
import { GitCommitHorizontal } from "lucide-react";
import { experience, type Position } from "@/lib/data";
import { SectionTitle } from "./ui";
import { WipeWords } from "./wipe-in";
import { ParallaxLayer } from "./parallax-layer";
import { TimelineLogo } from "./timeline-logo";

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-9"
    >
      <ParallaxLayer speed={35}>
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_10%,transparent_70%)]" />
      </ParallaxLayer>

      <SectionTitle index="03" title="Experience" />

      <ol className="relative ml-5 border-l border-border-default pl-8 sm:ml-6 sm:pl-10">
        {experience.map((exp, i) => {
          const stacked = (exp.positions?.length ?? 0) > 1;
          return (
            <motion.li
              key={exp.org}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mb-9 last:mb-0"
            >
              <TimelineLogo
                src={exp.logo}
                alt={exp.org}
                current={exp.current}
                delay={i * 0.1 + 0.15}
                fallback={<GitCommitHorizontal size={12} />}
              />

              {/* Role carries the weight; the dates sit out at the right margin
                  in mono so the column of periods scans on its own. When the
                  org held several titles, the org takes the heading instead and
                  the titles stack beneath it. */}
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-bold leading-tight tracking-tight text-fg-default sm:text-xl">
                  <WipeWords
                    text={stacked ? exp.org : exp.role}
                    inView
                    stagger={0.04}
                  />
                </h3>
                <span className="mono shrink-0 text-[11px] uppercase tracking-[0.12em] text-fg-subtle">
                  {exp.period}
                </span>
              </div>

              {!stacked && (
                <p className="mt-1.5 text-[15px] text-fg-muted">
                  <WipeWords text={exp.org} inView delay={0.1} stagger={0.04} />
                </p>
              )}

              <div className="mono mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-fg-subtle">
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

              {stacked && <PositionFlow positions={exp.positions!} delay={i * 0.1} />}

              {/* Read straight through — the bullets are the substance of the
                  role, so they are not tucked behind a toggle. */}
              {exp.bullets.length > 0 && (
                <ul className="mt-4 space-y-2.5">
                  {exp.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex gap-3 text-[15px] leading-relaxed text-fg-muted"
                    >
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-fg-subtle" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}

/**
 * LinkedIn-style progression within one org: each title on a short rail,
 * newest first, so a promotion reads as a step up rather than a new job.
 */
function PositionFlow({
  positions,
  delay,
}: {
  positions: Position[];
  delay: number;
}) {
  return (
    <ol className="mt-4">
      {positions.map((pos, j) => {
        const last = j === positions.length - 1;
        return (
          <motion.li
            key={pos.role}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.45,
              delay: delay + 0.2 + j * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative flex gap-3.5"
          >
            <div className="relative flex w-3 shrink-0 justify-center">
              <span
                className={`relative z-10 mt-[7px] h-2.5 w-2.5 rounded-full border-2 ${
                  pos.current
                    ? "border-status-published bg-status-published"
                    : "border-fg-subtle bg-canvas"
                }`}
              >
                {pos.current && (
                  <span className="animate-pulse-dot absolute inset-0 rounded-full bg-status-published" />
                )}
              </span>
              {!last && (
                <motion.span
                  aria-hidden
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: delay + 0.35 + j * 0.12 }}
                  className="absolute bottom-[-7px] top-[19px] w-px origin-top bg-border-default"
                />
              )}
            </div>
            <div className={last ? "" : "pb-4"}>
              <p className="text-[15px] font-semibold leading-snug text-fg-default">
                {pos.role}
              </p>
              <p className="mono mt-0.5 text-[11px] uppercase tracking-[0.12em] text-fg-subtle">
                {pos.period}
              </p>
              {pos.bullets && pos.bullets.length > 0 && (
                <ul className="mt-2.5 space-y-2">
                  {pos.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex gap-3 text-[15px] leading-relaxed text-fg-muted"
                    >
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-fg-subtle" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
