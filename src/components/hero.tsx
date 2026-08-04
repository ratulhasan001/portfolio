"use client";

import { useRef, useState, type ComponentType } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Mail,
  Download,
  ArrowRight,
  FileText,
  Clock,
} from "lucide-react";
import { SiCodeforces, SiCodechef } from "react-icons/si";
import { profile, onlineJudges, publications } from "@/lib/data";
import { FadeIn } from "./fade-in";
import { GithubIcon, LinkedinIcon } from "./brand-icons";
import { ParallaxLayer } from "./parallax-layer";
import { PopWords } from "./pop-in";
import { Typewriter } from "./typewriter";
import { MagneticLink } from "./magnetic-link";
import { HeroPortrait } from "./hero-portrait";
import { smoothScrollToId } from "@/lib/scroll";
import { getBootDelay } from "@/lib/boot-delay";

const codeforces = onlineJudges.find((j) => j.platform === "Codeforces")!;
const codechef = onlineJudges.find((j) => j.platform === "Codechef")!;

const achievements = [
  {
    icon: SiCodeforces,
    title: "Codeforces Expert",
    subtitle: "Competitive Programming",
    action: "View Profile",
    href: codeforces.link,
    external: true,
  },
  {
    icon: SiCodechef,
    title: "Codechef 3★",
    subtitle: "Competitive Programming",
    action: "View Profile",
    href: codechef.link,
    external: true,
  },
  {
    icon: FileText,
    title: "4 Peer-reviewed Publications",
    subtitle: "IEEE • ACM Conference Proceedings",
    action: "Explore Publications",
    href: "#research",
    external: false,
  },
  {
    icon: Clock,
    title: `${publications.filter((p) => p.status === "under-review").length} Publication Under Review`,
    subtitle: "Nature Scientific Reports",
    action: "Explore Publications",
    href: "#research",
    external: false,
  },
];

function AchievementCard({
  icon: Icon,
  title,
  subtitle,
  action,
  href,
  external,
  delay,
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  subtitle: string;
  action: string;
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
      className="group relative flex flex-col items-start gap-1 overflow-hidden rounded-xl border border-accent/20 bg-canvas-subtle/50 p-4 text-left shadow-sm backdrop-blur-xl transition-[transform,box-shadow,border-color] duration-250 ease-out hover:-translate-y-1 hover:border-accent/70 hover:shadow-[0_16px_36px_-18px_var(--color-accent)] sm:p-5"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(120px_circle_at_20%_0%,color-mix(in_srgb,var(--color-accent)_16%,transparent),transparent)] opacity-0 transition-opacity duration-250 group-hover:opacity-100"
      />

      <span className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-accent transition-transform duration-250 ease-out group-hover:scale-110">
        <Icon size={17} />
      </span>

      <h3 className="relative mt-3 text-sm font-bold leading-snug text-fg-default">
        {title}
      </h3>
      <p className="relative text-xs text-fg-muted">{subtitle}</p>

      <span className="relative mt-3 flex items-center gap-1.5 text-xs font-medium text-accent">
        {action}
        <ArrowRight
          size={12}
          className="transition-transform duration-250 ease-out group-hover:translate-x-1"
        />
      </span>
    </motion.a>
  );
}

const contactIcons = [
  { icon: MapPin, label: profile.location },
  { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
  { icon: GithubIcon, label: "GitHub", href: profile.github, external: true },
  { icon: LinkedinIcon, label: "LinkedIn", href: profile.linkedin, external: true },
];

function IconLink({
  icon: Icon,
  label,
  href,
  external,
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  href?: string;
  external?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative flex"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {href ? (
        <motion.a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="glass flex h-9 w-9 items-center justify-center rounded-full text-fg-muted transition-colors duration-200 hover:text-accent"
        >
          <Icon size={15} />
        </motion.a>
      ) : (
        <span className="glass flex h-9 w-9 items-center justify-center rounded-full text-fg-muted">
          <Icon size={15} />
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
        className="relative mx-auto grid max-w-6xl gap-10 px-4 pt-6 pb-6 sm:px-6 sm:pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:pt-10"
      >
        {/* Left: identity + copy */}
        <div>
          <FadeIn delay={0.1 + bootDelay}>
            <p className="mono text-sm font-medium text-fg-muted">Hi, I&apos;m</p>
          </FadeIn>

          <h1 className="mt-1 text-4xl font-bold tracking-tight text-fg-default sm:text-5xl lg:text-6xl">
            <PopWords text={profile.name} delay={0.22 + bootDelay} stagger={0.05} />
          </h1>

          <FadeIn delay={0.5 + bootDelay}>
            <p className="mt-4 text-lg font-semibold text-accent sm:text-xl">
              Aspiring Graduate Researcher
            </p>
          </FadeIn>

          <FadeIn delay={0.6 + bootDelay}>
            <p className="mono mt-1.5 min-h-[1.5em] text-sm text-fg-default sm:text-base">
              <Typewriter words={profile.focusAreas} />
            </p>
          </FadeIn>

          <FadeIn delay={0.72 + bootDelay} className="mt-6 max-w-lg">
            <p className="text-justify text-sm leading-relaxed text-fg-muted sm:text-[15px]">
              {profile.summary}
            </p>
          </FadeIn>

          <FadeIn delay={0.84 + bootDelay} className="mt-8 flex flex-wrap items-center gap-3">
            <MagneticLink
              href="#research"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollToId("#research");
              }}
              className="shimmer gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-[box-shadow,background-color] duration-300 hover:bg-accent-emphasis hover:shadow-[0_16px_36px_-12px_var(--color-accent)]"
            >
              View Research
              <motion.span
                variants={{ rest: { x: 0 }, hover: { x: 3 } }}
                initial="rest"
                whileHover="hover"
                className="flex"
              >
                <ArrowRight size={15} />
              </motion.span>
            </MagneticLink>

            <MagneticLink
              href="/Ratul_Hasan_CV.pdf"
              download
              className="glass gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-fg-default shadow-sm transition-colors duration-300 hover:text-accent"
            >
              <Download size={15} />
              Download CV
            </MagneticLink>

            <MagneticLink
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollToId("#contact");
              }}
              className="gap-2 rounded-md border border-accent/40 px-5 py-2.5 text-sm font-semibold text-accent transition-colors duration-300 hover:border-accent hover:bg-accent/10"
            >
              Contact Me
            </MagneticLink>
          </FadeIn>

          <FadeIn delay={0.94 + bootDelay} className="mt-6 flex flex-wrap items-center gap-2.5">
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

      {/* Key achievements */}
      <div className="relative mx-auto max-w-6xl px-4 pb-10 sm:px-6 sm:pb-14">
        <FadeIn>
          <p className="mono text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            Key Achievements
          </p>
        </FadeIn>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {achievements.map((a, i) => (
            <AchievementCard key={a.title} {...a} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
