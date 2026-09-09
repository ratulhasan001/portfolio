"use client";

import { useState, useRef, type ComponentType } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Mail } from "lucide-react";
import { profile } from "@/lib/data";
import { FadeIn } from "./fade-in";
import { CvIcon, GithubIcon, LinkedinIcon, ScholarIcon } from "./brand-icons";
import { ParallaxLayer } from "./parallax-layer";
import { PopWords } from "./pop-in";
import { Marquee } from "./marquee";
import { getBootDelay } from "@/lib/boot-delay";

// The page itself is monochrome, so `brand` is the one place real colour is
// allowed back in: it sweeps across the button while the cursor is on it.
const contactIcons = [
  {
    icon: Mail,
    label: profile.email,
    href: `mailto:${profile.email}`,
    brand: "var(--color-accent)",
    onBrand: "var(--color-on-accent)",
  },
  {
    icon: CvIcon,
    label: "View CV",
    href: "/cv",
    brand: "var(--color-accent)",
    onBrand: "var(--color-on-accent)",
  },
  {
    icon: GithubIcon,
    label: "GitHub",
    href: profile.github,
    external: true,
    brand: "linear-gradient(90deg, #24292f, #0d1117)",
    onBrand: "#ffffff",
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    href: profile.linkedin,
    external: true,
    brand: "#0A66C2",
    onBrand: "#ffffff",
  },
  {
    icon: ScholarIcon,
    label: "Google Scholar",
    href: profile.scholar,
    external: true,
    brand: "#4285F4",
    onBrand: "#ffffff",
  },
];

function IconLink({
  icon: Icon,
  label,
  href,
  external,
  download,
  brand,
  onBrand,
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  href?: string;
  external?: boolean;
  download?: boolean;
  brand?: string;
  onBrand?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.a
        href={href}
        download={download}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        aria-label={label}
        variants={{ rest: { y: 0, scale: 1 }, hover: { y: -3, scale: 1.06 } }}
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        className="glass group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-fg-muted shadow-sm transition-[box-shadow] duration-300 hover:shadow-[0_10px_22px_-10px_var(--color-accent)]"
      >
        <motion.span
          aria-hidden
          variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: 0, background: brand ?? "var(--color-accent)" }}
          className="absolute inset-0"
        />
        <motion.span
          variants={{
            rest: { rotate: 0, scale: 1 },
            hover: { rotate: -12, scale: 1.15 },
          }}
          transition={{ type: "spring", stiffness: 400, damping: 12 }}
          style={{ color: hovered ? onBrand : undefined }}
          className="relative flex transition-colors duration-300"
        >
          <Icon size={16} />
        </motion.span>
      </motion.a>

      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="glass pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-medium text-fg-default shadow-md"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Hero() {
  const bootDelay = getBootDelay(1.6);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const yShift = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="overview"
      className="relative overflow-hidden border-b border-border-default"
    >
      <ParallaxLayer speed={30}>
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_15%,#000_10%,transparent_75%)]" />
      </ParallaxLayer>

      <motion.div
        style={{ opacity: heroOpacity, y: yShift }}
        className="relative mx-auto max-w-5xl px-4 pb-10 pt-24 sm:px-6 sm:pb-14 sm:pt-28 lg:pb-16 lg:pt-24"
      >
        <FadeIn delay={0.1 + bootDelay}>
          <p className="mono text-base font-medium text-fg-muted">
            Hi, I&apos;m
          </p>
        </FadeIn>

        <h1 className="mt-1 text-4xl font-bold tracking-tight text-fg-default sm:text-6xl lg:text-7xl">
          <PopWords text={profile.name} delay={0.22 + bootDelay} stagger={0.05} />
        </h1>

        <FadeIn delay={0.5 + bootDelay}>
          <p className="mt-3 text-lg font-semibold text-fg-muted sm:text-xl">
            Aspiring Graduate Researcher
          </p>
        </FadeIn>

        <FadeIn delay={0.58 + bootDelay}>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-fg-subtle sm:text-base">
            {profile.tagline}
          </p>
        </FadeIn>

        <FadeIn
          delay={0.62 + bootDelay}
          className="mt-6 flex flex-wrap items-center gap-2"
        >
          {contactIcons.map((item) => (
            <IconLink key={item.label} {...item} />
          ))}
        </FadeIn>
      </motion.div>

      <Marquee />
    </section>
  );
}
