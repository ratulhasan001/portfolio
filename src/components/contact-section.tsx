"use client";

import { motion } from "framer-motion";
import { Mail, ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/data";
import { FadeIn } from "./fade-in";
import { GithubIcon, LinkedinIcon } from "./brand-icons";
import { BackgroundBlobs } from "./background-blobs";
import { ParallaxLayer } from "./parallax-layer";
import { smoothScrollToId } from "@/lib/scroll";
import { PopWords, PopIn } from "./pop-in";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <FadeIn>
        <div className="relative overflow-hidden rounded-lg border border-border-default bg-canvas-subtle p-8 text-center sm:p-14">
          <ParallaxLayer speed={25}>
            <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_75%)]" />
          </ParallaxLayer>
          <ParallaxLayer speed={40}>
            <BackgroundBlobs />
          </ParallaxLayer>
          <div className="relative">
            <PopIn as="span" inView scale={0.3} className="mono text-sm text-accent">
              06 · Contact
            </PopIn>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-fg-default sm:text-3xl">
              <PopWords
                text="Open to research collaborations & graduate opportunities"
                inView
                stagger={0.03}
              />
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-fg-muted sm:text-base">
              Currently applying to Masters/PhD programs in Machine Learning
              and AI research. Reach out if you&apos;re working on trustworthy
              LLMs, biomedical deep learning, or related problems.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <motion.a
                variants={{ rest: { scale: 1, y: 0 }, hover: { scale: 1.05, y: -3 } }}
                initial="rest"
                whileHover="hover"
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                href={`mailto:${profile.email}`}
                className="shimmer relative flex items-center gap-2 overflow-hidden rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-[box-shadow,background-color] duration-300 hover:bg-accent-emphasis hover:shadow-[0_14px_30px_-10px_var(--color-accent)]"
              >
                <motion.span
                  variants={{
                    rest: { rotate: 0, y: 0 },
                    hover: { rotate: [0, -14, 10, -6, 0], y: [0, -2, 0] },
                  }}
                  transition={{ duration: 0.55, ease: "easeInOut" }}
                  className="relative flex"
                >
                  <Mail size={15} />
                </motion.span>
                <span className="relative">Email me</span>
              </motion.a>
              <motion.a
                variants={{ rest: { scale: 1, y: 0 }, hover: { scale: 1.05, y: -3 } }}
                initial="rest"
                whileHover="hover"
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="shimmer group relative flex items-center gap-2 overflow-hidden rounded-md border border-border-default bg-canvas px-5 py-2.5 text-sm font-semibold text-fg-default shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-accent hover:shadow-[0_14px_30px_-10px_var(--color-accent)]"
              >
                <motion.span
                  aria-hidden
                  variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ originX: 0 }}
                  className="absolute inset-0 bg-gradient-to-r from-[#24292f] to-[#0d1117]"
                />
                <motion.span
                  variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: -14, scale: 1.15 } }}
                  transition={{ type: "spring", stiffness: 400, damping: 12 }}
                  className="relative flex transition-colors duration-300 group-hover:text-white"
                >
                  <GithubIcon size={15} />
                </motion.span>
                <span className="relative transition-colors duration-300 group-hover:text-white">
                  GitHub
                </span>
              </motion.a>
              <motion.a
                variants={{ rest: { scale: 1, y: 0 }, hover: { scale: 1.05, y: -3 } }}
                initial="rest"
                whileHover="hover"
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="shimmer group relative flex items-center gap-2 overflow-hidden rounded-md border border-border-default bg-canvas px-5 py-2.5 text-sm font-semibold text-fg-default shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-accent hover:shadow-[0_14px_30px_-10px_var(--color-accent)]"
              >
                <motion.span
                  aria-hidden
                  variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ originX: 0 }}
                  className="absolute inset-0 bg-[#0A66C2]"
                />
                <motion.span
                  variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: 14, scale: 1.15 } }}
                  transition={{ type: "spring", stiffness: 400, damping: 12 }}
                  className="relative flex transition-colors duration-300 group-hover:text-white"
                >
                  <LinkedinIcon size={15} />
                </motion.span>
                <span className="relative transition-colors duration-300 group-hover:text-white">
                  LinkedIn
                </span>
              </motion.a>
            </div>
          </div>
        </div>
      </FadeIn>

      <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border-default pt-6 text-xs text-fg-subtle sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name}. Built with Next.js
          &amp; Framer Motion.
        </p>
        <a
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            smoothScrollToId("#overview");
          }}
          className="group flex items-center gap-1 hover:text-accent"
        >
          Back to top
          <motion.span
            className="flex"
            whileHover={{ y: -3, x: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <ArrowUpRight size={12} />
          </motion.span>
        </a>
      </footer>
    </section>
  );
}
