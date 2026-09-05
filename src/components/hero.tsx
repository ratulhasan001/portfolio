"use client";

import { useRef, useState, type ComponentType } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Mail, Download, ArrowUpRight, FileText, Clock } from "lucide-react";
import { SiCodeforces, SiCodechef } from "react-icons/si";
import { profile, onlineJudges, publications } from "@/lib/data";
import { FadeIn } from "./fade-in";
import {
  GithubIcon,
  LinkedinIcon,
  OrcidIcon,
  ScholarIcon,
} from "./brand-icons";
import { ParallaxLayer } from "./parallax-layer";
import { PopWords } from "./pop-in";
import { Typewriter } from "./typewriter";
import { HeroPortrait } from "./hero-portrait";
import { smoothScrollToId } from "@/lib/scroll";
import { getBootDelay } from "@/lib/boot-delay";

const codeforces = onlineJudges.find((j) => j.platform === "Codeforces")!;
const codechef = onlineJudges.find((j) => j.platform === "Codechef")!;

const achievements = [
  {
    icon: SiCodeforces,
    title: "Codeforces Expert",
    href: codeforces.link,
    external: true,
  },
  {
    icon: SiCodechef,
    title: "Codechef 3★",
    href: codechef.link,
    external: true,
  },
  {
    icon: FileText,
    title: "4 Peer-reviewed Publications",
    href: "#research",
    external: false,
  },
  {
    icon: Clock,
    title: `${publications.filter((p) => p.status === "under-review").length} Publication Under Review`,
    href: "#research",
    external: false,
  },
];

function AchievementCard({
  icon: Icon,
  title,
  href,
  external,
  delay,
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  href: string;
  external: boolean;
  delay: number;
}) {
  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onClick={
        external
          ? undefined
          : (e) => {
              e.preventDefault();
              smoothScrollToId(href);
            }
      }
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col items-start justify-center gap-1 overflow-hidden rounded-xl border border-accent/20 bg-canvas-subtle/50 p-3.5 text-left shadow-sm backdrop-blur-xl transition-[transform,box-shadow,border-color] duration-250 ease-out hover:-translate-y-1 hover:border-accent/70 hover:shadow-[0_16px_36px_-18px_var(--color-accent)] sm:p-4"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(120px_circle_at_20%_0%,color-mix(in_srgb,var(--color-accent)_16%,transparent),transparent)] opacity-0 transition-opacity duration-250 group-hover:opacity-100"
      />

      <div className="relative flex w-full items-start gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-accent transition-transform duration-250 ease-out group-hover:scale-110">
          <Icon size={17} />
        </span>
        <h3 className="min-w-0 flex-1 text-[15px] font-bold leading-snug text-fg-default">
          {title}
        </h3>
        <ArrowUpRight
          size={16}
          aria-hidden
          className="mt-0.5 shrink-0 text-fg-subtle transition-[transform,color] duration-250 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
        />
      </div>
    </motion.a>
  );
}

// `brand` is the colour that sweeps in on hover, same trick as the contact
// buttons — each link fills with the mark it belongs to.
const contactIcons = [
  {
    icon: Mail,
    label: profile.email,
    href: `mailto:${profile.email}`,
    brand: "var(--color-accent)",
  },
  {
    icon: OrcidIcon,
    label: "ORCID",
    href: profile.orcid,
    external: true,
    brand: "#A6CE39",
  },
  {
    icon: ScholarIcon,
    label: "Google Scholar",
    href: profile.scholar,
    external: true,
    brand: "#4285F4",
  },
  {
    icon: GithubIcon,
    label: "GitHub",
    href: profile.github,
    external: true,
    brand: "linear-gradient(90deg, #24292f, #0d1117)",
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    href: profile.linkedin,
    external: true,
    brand: "#0A66C2",
  },
  {
    icon: Download,
    label: "Download CV",
    href: "/Ratul_Hasan_CV.pdf",
    download: true,
    brand: "var(--color-accent)",
  },
];

// Only the opening line of the summary runs in the hero.
const [summaryLead] = profile.summary.split(/(?<=\.)\s+/);

function IconLink({
  icon: Icon,
  label,
  href,
  external,
  download,
  brand,
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  href?: string;
  external?: boolean;
  download?: boolean;
  brand?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const icon = (
    <motion.span
      variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: -12, scale: 1.15 } }}
      transition={{ type: "spring", stiffness: 400, damping: 12 }}
      className="relative flex transition-colors duration-300 group-hover:text-white"
    >
      <Icon size={16} />
    </motion.span>
  );

  return (
    <div
      className="relative flex"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {href ? (
        <motion.a
          href={href}
          download={download}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
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
          {icon}
        </motion.a>
      ) : (
        <span className="glass flex h-10 w-10 items-center justify-center rounded-full text-fg-muted">
          <Icon size={16} />
        </span>
      )}
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
        className="relative mx-auto grid max-w-6xl gap-7 px-4 pb-4 pt-20 sm:px-6 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-9 lg:pt-8"
      >
        {/* Left: identity + copy */}
        <div>
          <FadeIn delay={0.1 + bootDelay}>
            <p className="mono text-base font-medium text-fg-muted">Hi, I&apos;m</p>
          </FadeIn>

          <h1 className="mt-1 text-4xl font-bold tracking-tight text-fg-default sm:text-5xl lg:text-6xl">
            <PopWords text={profile.name} delay={0.22 + bootDelay} stagger={0.05} />
          </h1>

          <FadeIn delay={0.5 + bootDelay}>
            <p className="mt-3 text-lg font-semibold text-accent sm:text-xl">
              Aspiring Graduate Researcher
            </p>
          </FadeIn>

          <FadeIn delay={0.6 + bootDelay}>
            <p className="mono mt-1.5 min-h-[1.5em] text-base text-fg-default sm:text-lg">
              <Typewriter words={profile.focusAreas} />
            </p>
          </FadeIn>

          <FadeIn delay={0.72 + bootDelay} className="mt-4 max-w-lg">
            <p className="text-[15px] leading-relaxed text-fg-muted">{summaryLead}</p>
          </FadeIn>

          <FadeIn delay={0.84 + bootDelay} className="mt-5 flex flex-wrap items-center gap-2">
            {contactIcons.map((item) => (
              <IconLink key={item.label} {...item} />
            ))}
          </FadeIn>
        </div>

        {/* Right: portrait */}
        <div className="relative">
          <HeroPortrait />
        </div>
      </motion.div>

      {/* Featured */}
      <div className="relative mx-auto max-w-6xl px-4 pb-7 sm:px-6 sm:pb-9">
        <FadeIn>
          <p className="mono text-[13px] font-semibold uppercase tracking-wider text-fg-subtle">
            Featured
          </p>
        </FadeIn>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((a, i) => (
            <AchievementCard key={a.title} {...a} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
