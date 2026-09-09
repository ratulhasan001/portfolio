"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  Code2,
  Users2,
  Award,
  ExternalLink,
  Crown,
  Database,
  Webhook,
  Anvil,
  Brain,
  ScanEye,
  Server,
  Blocks,
} from "lucide-react";
import {
  SiC,
  SiCplusplus,
  SiPython,
  SiJavascript,
  SiDjango,
  SiLaravel,
  SiGit,
  SiGithub,
  SiMysql,
  SiPostgresql,
} from "react-icons/si";
import { skills, onlineJudges, achievements, leadership } from "@/lib/data";
import { SectionTitle } from "./ui";
import { FadeIn, StaggerGroup, staggerItem } from "./fade-in";
import { ParallaxLayer } from "./parallax-layer";
import { TiltLink } from "./tilt-card";
import { PopWords, PopIn } from "./pop-in";
import { CodeforcesIcon, CodechefIcon, LeetcodeIcon } from "./brand-icons";

const judgeIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Codeforces: CodeforcesIcon,
  Codechef: CodechefIcon,
  LeetCode: LeetcodeIcon,
};

const skillIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  C: SiC,
  "C++": SiCplusplus,
  Python: SiPython,
  JavaScript: SiJavascript,
  SQL: Database,
  Django: SiDjango,
  REST: Webhook,
  Foundry: Anvil,
  Laravel: SiLaravel,
  Git: SiGit,
  GitHub: SiGithub,
  MySQL: SiMysql,
  PostgreSQL: SiPostgresql,
  "Machine Learning": Brain,
  "Computer Vision": ScanEye,
  "Backend Development": Server,
  Blockchain: Blocks,
};

export function SkillsSection() {
  return (
    <section
      id="skills"
      className="relative mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9"
    >
      <ParallaxLayer speed={45}>
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_10%,transparent_70%)]" />
      </ParallaxLayer>
      <SectionTitle index="04" title="Skills & Achievements" />

      <div className="mb-7">
        <PopIn inView>
          <h3 className="mono mb-3 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-fg-subtle">
            <Trophy size={13} />
            Competitive Programming
          </h3>
        </PopIn>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {onlineJudges.map((judge, i) => {
            const Icon = judgeIcons[judge.platform];
            return (
              <FadeIn key={judge.platform} delay={i * 0.08}>
                <TiltLink
                  href={judge.link}
                  target="_blank"
                  rel="noreferrer"
                  className="shimmer h-full rounded-md border border-border-default bg-canvas-subtle p-3.5 transition-colors hover:border-accent/50"
                >
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
                    <p className="text-[15px] font-semibold text-fg-default">
                      <PopWords text={judge.platform} inView stagger={0.04} />
                    </p>
                  </div>
                  <p className="gradient-text mt-1.5 text-lg font-bold">
                    {judge.stat}
                  </p>
                  <span className="group/handle mono mt-1 inline-flex items-center gap-1 text-[13px] text-fg-subtle transition-colors group-hover:text-accent">
                    @{judge.handle}
                    <ExternalLink
                      size={11}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </span>
                </TiltLink>
              </FadeIn>
            );
          })}
        </div>

        {/* One panel, one list: seven separate cards fragmented what is
            really a single run of contest results. */}
        <FadeIn delay={0.1}>
          <div className="mt-3 rounded-md border border-border-default bg-canvas-subtle px-4 py-3 shadow-sm sm:px-5 sm:py-4">
            <h4 className="mono mb-2.5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-fg-subtle">
              <Award size={12} />
              Contest Achievements
            </h4>
            <ul className="divide-y divide-border-muted">
              {achievements.map((a, i) => (
                <motion.li
                  key={a}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                  className="flex items-baseline gap-3 py-2 text-[15px] leading-relaxed text-fg-muted transition-colors hover:text-fg-default"
                >
                  <span className="mono w-5 shrink-0 text-[11px] text-fg-subtle">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">{a}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </div>

      <div className="mb-7">
        <PopIn inView>
          <h3 className="mono mb-3 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-fg-subtle">
            <Code2 size={13} />
            Technical Skills
          </h3>
        </PopIn>
        <StaggerGroup className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(skills).map(([category, items]) => (
            <motion.div
              key={category}
              variants={staggerItem}
              whileHover={{ y: -3, borderColor: "var(--color-accent)" }}
              className="shimmer rounded-md border border-border-default bg-canvas-subtle p-3.5 transition-colors"
            >
              <p className="text-[15px] font-semibold text-fg-default">
                <PopWords text={category} inView stagger={0.04} />
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {items.map((item) => {
                  const Icon = skillIcons[item];
                  return (
                    <motion.span
                      key={item}
                      whileHover={{ y: -2, scale: 1.06 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="chip inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/[0.07] px-2.5 py-1 text-[13px] font-medium text-accent"
                    >
                      {Icon && <Icon size={12} />}
                      {item}
                    </motion.span>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>

      <div>
        <PopIn inView>
          <h3 className="mono mb-3 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-fg-subtle">
            <Users2 size={13} />
            Leadership &amp; Volunteering
          </h3>
        </PopIn>
        {/* All three entries sit on one row: the multi-role card no longer
            spans the grid, it just stacks its roles inside its own column. */}
        <StaggerGroup className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {leadership.map((entry) => (
            <motion.div
              key={entry.org}
              variants={staggerItem}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="shimmer group relative overflow-hidden rounded-md border border-border-muted bg-canvas-subtle px-4 py-3.5 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-done/50 hover:shadow-[0_16px_32px_-16px_var(--color-done)]"
            >
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-1 scale-y-0 bg-gradient-to-b from-done to-accent transition-transform duration-300 ease-out group-hover:scale-y-100"
              />
              <div className="flex items-start gap-3">
                <motion.span
                  whileHover={{ rotate: -12, scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-done-subtle text-done"
                >
                  <Crown size={15} />
                </motion.span>
                <p className="min-w-0 text-[15px] font-semibold leading-snug text-fg-default">
                  <PopWords text={entry.org} inView stagger={0.03} />
                </p>
              </div>

              <ul className="mt-3 space-y-1.5 border-l border-done/30 pl-4 sm:ml-1">
                {entry.roles.map((role, i) => (
                  <motion.li
                    key={role}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.35 }}
                    className="relative"
                  >
                    <span
                      className={`absolute -left-[18.5px] top-1.5 h-2 w-2 rounded-full border-2 border-canvas-subtle ${
                        i === 0 ? "bg-done" : "bg-fg-subtle"
                      }`}
                    />
                    <span
                      className={
                        i === 0
                          ? "text-sm font-bold text-fg-default"
                          : "text-sm font-medium text-fg-muted"
                      }
                    >
                      {role}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
