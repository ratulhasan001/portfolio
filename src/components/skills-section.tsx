"use client";

import { motion } from "framer-motion";
import { Trophy, Code2, Users2, Award, ExternalLink } from "lucide-react";
import { skills, onlineJudges, achievements, leadership } from "@/lib/data";
import { SectionTitle } from "./ui";
import { FadeIn, StaggerGroup, staggerItem } from "./fade-in";
import { NeuralBackground } from "./neural-background";
import { TiltCard } from "./tilt-card";
import { PopWords, PopIn } from "./pop-in";
import { CodeforcesIcon, CodechefIcon, LeetcodeIcon } from "./brand-icons";

const judgeIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Codeforces: CodeforcesIcon,
  Codechef: CodechefIcon,
  LeetCode: LeetcodeIcon,
};

export function SkillsSection() {
  return (
    <section
      id="skills"
      className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <NeuralBackground />
      <SectionTitle
        index="05"
        title="Skills & Achievements"
        subtitle="Competitive programming record, technical toolkit, and leadership."
      />

      <div className="mb-14">
        <PopIn inView>
          <h3 className="mono mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            <Trophy size={13} />
            Competitive Programming
          </h3>
        </PopIn>
        <div className="grid gap-3 sm:grid-cols-3">
          {onlineJudges.map((judge, i) => {
            const Icon = judgeIcons[judge.platform];
            return (
              <FadeIn key={judge.platform} delay={i * 0.08}>
                <TiltCard className="shimmer h-full rounded-md border border-border-default bg-canvas-subtle p-4 transition-colors hover:border-accent/50">
                  <div className="flex items-center gap-2">
                    {Icon && (
                      <motion.span
                        whileHover={{ rotate: -10, scale: 1.15 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border-default bg-canvas text-accent"
                      >
                        <Icon size={14} />
                      </motion.span>
                    )}
                    <p className="text-sm font-semibold text-fg-default">
                      <PopWords text={judge.platform} inView stagger={0.04} />
                    </p>
                  </div>
                  <p className="gradient-text mt-2 text-lg font-bold">
                    {judge.stat}
                  </p>
                  <a
                    href={judge.link}
                    target="_blank"
                    rel="noreferrer"
                    className="group/handle mono mt-1 inline-flex items-center gap-1 text-xs text-fg-subtle transition-colors hover:text-accent"
                  >
                    @{judge.handle}
                    <ExternalLink
                      size={11}
                      className="opacity-0 transition-opacity group-hover/handle:opacity-100"
                    />
                  </a>
                </TiltCard>
              </FadeIn>
            );
          })}
        </div>

        <StaggerGroup className="mt-4 space-y-2">
          {achievements.map((a, i) => (
            <motion.div
              key={a}
              variants={staggerItem}
              whileHover={{ x: 4 }}
              className="shimmer group flex items-center gap-3 rounded-md border border-border-muted bg-canvas px-3.5 py-2.5 text-sm text-fg-muted transition-colors hover:border-attention/40"
            >
              <span className="mono text-[10px] text-fg-subtle">
                {String(i + 1).padStart(2, "0")}
              </span>
              <motion.span
                whileHover={{ rotate: -10, scale: 1.15 }}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-attention-subtle text-attention"
              >
                <Award size={12} />
              </motion.span>
              <span className="transition-colors group-hover:text-fg-default">
                {a}
              </span>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>

      <div className="mb-14">
        <PopIn inView>
          <h3 className="mono mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            <Code2 size={13} />
            Technical Skills
          </h3>
        </PopIn>
        <StaggerGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(skills).map(([category, items]) => (
            <motion.div
              key={category}
              variants={staggerItem}
              whileHover={{ y: -3, borderColor: "var(--color-accent)" }}
              className="shimmer rounded-md border border-border-default bg-canvas-subtle p-4 transition-colors"
            >
              <p className="text-sm font-semibold text-fg-default">
                <PopWords text={category} inView stagger={0.04} />
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {items.map((item) => (
                  <motion.span
                    key={item}
                    whileHover={{ y: -2, scale: 1.06 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="chip rounded-full border border-accent/25 bg-accent/[0.07] px-2.5 py-0.5 text-xs font-medium text-accent"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>

      <div>
        <PopIn inView>
          <h3 className="mono mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            <Users2 size={13} />
            Leadership &amp; Volunteering
          </h3>
        </PopIn>
        <StaggerGroup className="grid gap-2.5 sm:grid-cols-2">
          {leadership.map((l, i) => (
            <motion.div
              key={l}
              variants={staggerItem}
              whileHover={{ x: 4 }}
              className="shimmer group flex items-center gap-3 rounded-md border border-border-muted bg-canvas-subtle px-3.5 py-2.5 text-sm text-fg-muted transition-colors hover:border-done/40"
            >
              <span className="mono text-[10px] text-fg-subtle">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-done" />
              <span className="transition-colors group-hover:text-fg-default">
                {l}
              </span>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
