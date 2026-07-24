"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  MapPin,
  Mail,
  Link as LinkIcon,
  Download,
  Sparkles,
} from "lucide-react";
import { profile, stats } from "@/lib/data";
import { FileHeader } from "./ui";
import { FadeIn } from "./fade-in";
import { TypedLines } from "./typed-lines";
import { GithubIcon, LinkedinIcon } from "./brand-icons";
import { BackgroundBlobs } from "./background-blobs";
import { ParallaxLayer } from "./parallax-layer";
import { CountUp } from "./count-up";
import { PopWords } from "./pop-in";
import { getBootDelay } from "@/lib/boot-delay";

export function Hero() {
  const bootDelay = getBootDelay(1.6);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const yPanel = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const ySidebar = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="overview"
      className="relative overflow-hidden border-b border-border-default"
    >
      <ParallaxLayer speed={40}>
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_10%,transparent_70%)]" />
      </ParallaxLayer>
      <ParallaxLayer speed={70}>
        <BackgroundBlobs />
      </ParallaxLayer>

      <motion.div
        style={{ opacity: heroOpacity }}
        className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[280px_1fr] lg:gap-12"
      >
        {/* Sidebar / profile card */}
        <motion.div style={{ y: ySidebar }}>
          <FadeIn>
            <div className="flex flex-col items-start lg:sticky lg:top-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="relative flex h-28 w-28 items-center justify-center rounded-full"
              >
                <motion.span
                  aria-hidden
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,var(--color-accent),var(--color-done),var(--color-success),var(--color-accent))] opacity-70 blur-[2px]"
                />
                <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-canvas bg-canvas-subtle shadow-lg">
                  <motion.div
                    initial={{ opacity: 0, scale: 1.3, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="relative h-full w-full"
                  >
                    <Image
                      src="/my_img.jpg"
                      alt={profile.name}
                      fill
                      sizes="112px"
                      priority
                      className="object-cover object-top"
                    />
                  </motion.div>
                </div>
                <motion.span
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-canvas bg-success text-white"
                >
                  <Sparkles size={12} />
                </motion.span>
              </motion.div>

              <h1 className="mt-4 text-2xl font-bold tracking-tight text-fg-default">
                <PopWords text={profile.name} delay={0.5 + bootDelay} stagger={0.08} />
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + bootDelay, ease: [0.22, 1, 0.36, 1] }}
                className="mt-3 text-justify text-sm leading-relaxed text-fg-muted"
              >
                Computer Science graduate with research experience in{" "}
                <span className="font-semibold text-accent">
                  machine learning, healthcare AI, blockchain, and cybersecurity
                </span>
                . Published in peer-reviewed conference proceedings, with research
                interests in{" "}
                <span className="font-semibold text-done">
                  trustworthy AI, large language models, and AI for healthcare
                </span>
                . Aspiring to pursue{" "}
                <span className="font-semibold text-success">
                  graduate research in Artificial Intelligence
                </span>
                .
              </motion.p>

              <motion.a
                variants={{ rest: { scale: 1, y: 0 }, hover: { scale: 1.03, y: -2 } }}
                initial="rest"
                whileHover="hover"
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                href="/Ratul_Hasan_CV.pdf"
                download
                className="shimmer group relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-md border border-border-default bg-canvas-subtle px-3 py-1.5 text-sm font-medium text-fg-default shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-accent hover:shadow-[0_10px_24px_-10px_var(--color-accent)]"
              >
                <motion.span
                  aria-hidden
                  variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ originX: 0 }}
                  className="absolute inset-0 bg-gradient-to-r from-accent to-done"
                />
                <motion.span
                  variants={{ rest: { y: 0 }, hover: { y: [0, 4, -2, 0] } }}
                  transition={{ duration: 0.65, ease: "easeInOut" }}
                  className="relative flex transition-colors duration-300 group-hover:text-white"
                >
                  <Download size={14} />
                </motion.span>
                <span className="relative transition-colors duration-300 group-hover:text-white">
                  Download CV
                </span>
              </motion.a>

              <ul className="mt-5 w-full space-y-1">
                {[
                  { icon: MapPin, label: profile.location },
                  {
                    icon: Mail,
                    label: profile.email,
                    href: `mailto:${profile.email}`,
                  },
                  {
                    icon: LinkIcon,
                    label: profile.website,
                    href: `https://${profile.website}`,
                    external: true,
                  },
                  {
                    icon: GithubIcon,
                    label: `github.com/${profile.handle}`,
                    href: profile.github,
                    external: true,
                  },
                  {
                    icon: LinkedinIcon,
                    label: "linkedin.com/in/ratul-hasan",
                    href: profile.linkedin,
                    external: true,
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  const rowContent = (
                    <>
                      <motion.span
                        whileHover={{ rotate: -10, scale: 1.15 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white"
                      >
                        <Icon size={13} />
                      </motion.span>
                      <span className="truncate text-sm text-fg-muted transition-colors duration-300 group-hover:text-fg-default">
                        {item.label}
                      </span>
                    </>
                  );
                  return (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: i * 0.06,
                        type: "spring",
                        stiffness: 300,
                        damping: 24,
                      }}
                    >
                      {item.href ? (
                        <motion.a
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noreferrer" : undefined}
                          whileHover={{ x: 4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 24 }}
                          className="group relative -mx-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5"
                        >
                          {rowContent}
                          <span
                            aria-hidden
                            className="absolute inset-0 -z-10 rounded-lg bg-canvas-subtle opacity-0 shadow-[0_10px_22px_-12px_var(--color-accent)] transition-opacity duration-300 group-hover:opacity-100"
                          />
                        </motion.a>
                      ) : (
                        <div className="group relative -mx-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5">
                          {rowContent}
                        </div>
                      )}
                    </motion.li>
                  );
                })}
              </ul>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {profile.interests.map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.06 }}
                    whileHover={{ scale: 1.08, y: -1 }}
                    className="chip rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          </FadeIn>
        </motion.div>

        {/* README panel */}
        <motion.div style={{ y: yPanel }}>
          <FadeIn delay={0.15}>
            <div
              className="relative overflow-hidden rounded-md p-[2px] shadow-md"
              style={{ perspective: 800 }}
            >
              <motion.span
                aria-hidden
                animate={{ rotate: 360 }}
                transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,var(--color-accent),var(--color-done),var(--color-success),var(--color-accent))]"
              />
              <motion.span
                aria-hidden
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 360 }}
                transition={{ duration: 0.9, ease: "easeInOut", delay: 0.6 + bootDelay }}
                className="pointer-events-none absolute inset-0 z-20 rounded-md border-2 border-accent/70"
              />
              <div className="relative overflow-hidden rounded-md bg-canvas">
                <FileHeader filename="README.md" label="researcher.profile" />
                <div className="border border-border-default bg-canvas-inset px-5 py-6 sm:px-7 sm:py-8">
                  <TypedLines />
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                  whileHover={{ y: -3, borderColor: "var(--color-accent)" }}
                  className="shimmer rounded-md border border-border-default bg-canvas-subtle px-4 py-3 text-center transition-colors"
                >
                  <div className="mono gradient-text text-xl font-bold">
                    <CountUp value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-0.5 text-xs text-fg-muted">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </motion.div>
      </motion.div>
    </section>
  );
}
