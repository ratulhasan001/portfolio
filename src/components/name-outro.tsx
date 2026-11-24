"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { profile } from "@/lib/data";

const reveal = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

/**
 * Closing call to action: what the visitor can reach out about, the ways to
 * do it, then a one-line footer.
 */
export function NameOutro() {
  return (
    <section
      id="contact"
      className="border-t border-border-default px-4 pb-10 pt-16 sm:px-6 sm:pb-12 sm:pt-24"
    >
      <div className="mx-auto max-w-5xl text-center">
        <motion.p
          {...reveal}
          transition={{ duration: 0.5 }}
          className="mono text-[11px] uppercase tracking-[0.3em] text-fg-subtle"
        >
          Get in touch
        </motion.p>

        <motion.h2
          {...reveal}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold tracking-[-0.03em] text-fg-default sm:text-5xl"
        >
          Open to research and project collaborations
        </motion.h2>

        <motion.p
          {...reveal}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-fg-muted sm:text-base"
        >
          Have a research idea, a dataset or a project you want to build
          together? I&apos;d be glad to hear about it.
        </motion.p>

        <motion.div
          {...reveal}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <Mail size={16} />
            Email me
          </a>
        </motion.div>

        <div className="mono mt-16 flex flex-col items-center gap-3 border-t border-border-default pt-6 text-[11px] sm:mx-6 uppercase tracking-[0.12em] text-fg-subtle sm:flex-row sm:justify-between">
          <a
            href={`mailto:${profile.email}`}
            className="normal-case tracking-normal text-[13px] text-fg-muted transition-colors hover:text-fg-default"
          >
            {profile.email}
          </a>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <a href={profile.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-fg-default">
              GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="transition-colors hover:text-fg-default">
              LinkedIn
            </a>
            <a href={profile.scholar} target="_blank" rel="noreferrer" className="transition-colors hover:text-fg-default">
              Scholar
            </a>
            <span className="text-fg-subtle/60">
              © {new Date().getFullYear()} {profile.name}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
