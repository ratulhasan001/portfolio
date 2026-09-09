"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/data";

const firstName = profile.name.split(" ")[0];

/**
 * Closing sign-off: the first name set oversized as a piece of type, with
 * the contact links folded into the line beneath it. Replaces the old
 * contact panel — the page ends on the name rather than on a form.
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

        {/* Set in viewport units so the word holds the same optical weight at
            every width, with the tracking pulled in the way a display cut
            wants it. `masked-name` clips an animated fill to the glyphs. */}
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="masked-name mt-3 select-none text-[26vw] font-extrabold leading-[0.85] tracking-[-0.055em] sm:mt-4 sm:text-[22vw] lg:text-[19vw]"
        >
          {firstName}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mono mt-1 text-[10px] uppercase tracking-[0.3em] text-fg-subtle sm:text-[11px]"
        >
          {profile.role}
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
              className="transition-colors hover:text-fg-default"
            >
              CV
            </a>
            <span className="text-fg-subtle/60">
              © {new Date().getFullYear()}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
