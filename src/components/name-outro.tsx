"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/data";
import { DinoRunner } from "./dino-runner";
import { EagleMark } from "./eagle-mark";

/**
 * Closing sign-off: a decorative endless runner in place of a sign-off mark,
 * with the contact links folded into the line beneath it.
 */
export function NameOutro() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-border-default px-4 pb-9 pt-14 sm:px-6 sm:pb-12 sm:pt-20"
    >
      <div className="mx-auto max-w-5xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mono text-[10px] uppercase tracking-[0.34em] text-fg-subtle sm:text-[11px]"
        >
          Open to research collaborations
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 sm:mt-6"
        >
          <DinoRunner />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mono mt-1 text-[10px] uppercase tracking-[0.3em] text-fg-subtle sm:text-[11px]"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-7 flex flex-col items-center gap-3 border-t border-border-default pt-5"
        >
          <a
            href={`mailto:${profile.email}`}
            className="mono text-[13px] text-fg-muted underline-offset-4 transition-colors hover:text-fg-default hover:underline"
          >
            {profile.email}
          </a>

          <div className="mono flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] uppercase tracking-[0.12em] text-fg-subtle">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-fg-default"
            >
              GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-fg-default"
            >
              LinkedIn
            </a>
            <a
              href={profile.scholar}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-fg-default"
            >
              Scholar
            </a>
            <a
              href="/cv"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-fg-default"
            >
              CV
            </a>
            <span className="text-fg-subtle/60">
              © {new Date().getFullYear()}
            </span>
          </div>
        </motion.div>

        {/* Watermark: the eagle mark and its words, fading out toward the
            page's edge. Decorative, so it stays out of the a11y tree. */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none mt-12 select-none sm:mt-16"
        >
          <EagleMark className="mx-auto h-16 w-16 text-fg-default/25 sm:h-20 sm:w-20" />
          <p className="mt-3 font-display text-[11px] font-bold uppercase tracking-[0.6em] text-fg-default/25 sm:mt-4 sm:text-sm">
            The
          </p>
          <p className="mt-1 whitespace-nowrap bg-gradient-to-b from-fg-default/20 to-fg-default/0 bg-clip-text pb-1 font-display text-[7.4vw] font-bold uppercase leading-none tracking-[0.08em] text-transparent lg:text-[4.6rem]">
            Silent Architect
          </p>
        </motion.div>
      </div>
    </section>
  );
}
