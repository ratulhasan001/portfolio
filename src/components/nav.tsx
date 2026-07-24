"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";
import {
  GitBranch,
  Menu,
  X,
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  FlaskConical,
  FolderGit2,
  Trophy,
  Mail,
  Sparkles,
} from "lucide-react";
import { smoothScrollToId } from "@/lib/scroll";
import { getBootDelay } from "@/lib/boot-delay";

const links = [
  { href: "#overview", label: "Overview", icon: LayoutDashboard },
  { href: "#experience", label: "Experience", icon: Briefcase },
  { href: "#education", label: "Education", icon: GraduationCap },
  { href: "#research", label: "Research", icon: FlaskConical },
  { href: "#projects", label: "Projects", icon: FolderGit2 },
  { href: "#skills", label: "Skills", icon: Trophy },
  { href: "#contact", label: "Contact", icon: Mail },
];

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a
      href="#overview"
      onClick={(e) => {
        e.preventDefault();
        smoothScrollToId("#overview");
      }}
      className="group flex items-center gap-2 font-semibold text-fg-default"
    >
      <motion.span
        whileHover={{ rotate: -14, scale: 1.12 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="relative flex h-8 w-8 items-center justify-center rounded-full border border-border-default bg-canvas-subtle"
      >
        <motion.span
          aria-hidden
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.15, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-accent/20 blur-[6px]"
        />
        <GitBranch size={15} className="relative text-accent" />
      </motion.span>
      {!compact && (
        <span className="mono text-sm tracking-tight">
          ratulhasan<span className="text-accent">/</span>
          <span className="gradient-text font-semibold">research</span>
        </span>
      )}
    </a>
  );
}

function OpenBadge({ vertical = false }: { vertical?: boolean }) {
  return (
    <div
      className={`mono flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-success/30 bg-success-subtle px-2.5 py-1 text-[11px] font-medium text-success ${
        vertical ? "flex-col py-2 text-center leading-tight" : ""
      }`}
    >
      <motion.span
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-success"
      />
      {vertical ? (
        <span>
          Open to
          <br />
          research
        </span>
      ) : (
        "Open to research"
      )}
    </div>
  );
}

export function Nav() {
  const [active, setActive] = useState("#overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navSpin, setNavSpin] = useState(0);
  const isFirstActive = useRef(true);

  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isFirstActive.current) {
      isFirstActive.current = false;
      return;
    }
    setNavSpin((s) => s + 1);
  }, [active]);

  const bootDelay = getBootDelay(1.6);
  const activeLink = links.find((l) => l.href === active) ?? links[0];
  const ActiveIcon = activeLink.icon;

  return (
    <>
      {/* Desktop: floating vertical bar on the right */}
      <motion.header
        initial={{ opacity: 0, clipPath: "inset(0% 0% 100% 0%)" }}
        animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
        transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1], delay: 0.3 + bootDelay }}
        className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 lg:block"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 1.2 + bootDelay }}
          style={{ perspective: 800 }}
          className="relative flex flex-col items-center gap-1 overflow-hidden rounded-2xl border border-accent/20 bg-canvas/85 px-3 pb-4 pt-0 shadow-[0_24px_48px_-20px_var(--color-accent),0_14px_30px_-14px_rgba(0,0,0,0.55)] backdrop-blur-md"
        >
          <motion.span
            aria-hidden
            animate={{ rotateY: navSpin * 360 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-0 z-20 rounded-2xl border-2 border-accent/60"
          />

          <div className="gradient-line -mx-3 mb-3 h-[3px] w-[calc(100%+1.5rem)] shrink-0 opacity-80" />

          <Logo />

          <div className="my-2 h-px w-8 shrink-0 bg-border-default" />

          <nav className="flex flex-col items-stretch gap-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = active === link.href;
              return (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScrollToId(link.href);
                  }}
                  initial="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.94 }}
                  style={{ perspective: 800 }}
                  className="group relative"
                >
                  <motion.span
                    animate={{ rotateY: isActive ? -360 : 0 }}
                    transition={{ duration: isActive ? 0.65 : 0 }}
                    className="relative z-10 block"
                  >
                    <motion.span
                      variants={{ rest: { x: 0 }, hover: { x: -3 } }}
                      transition={{ type: "spring", stiffness: 420, damping: 20 }}
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "text-accent"
                          : "text-fg-muted group-hover:text-fg-default"
                      }`}
                    >
                      <motion.span
                        variants={{
                          rest: { rotate: 0, scale: 1 },
                          hover: { rotate: -12, scale: 1.25 },
                        }}
                        transition={{ type: "spring", stiffness: 450, damping: 12 }}
                        className="flex shrink-0"
                      >
                        <Icon size={14} className={isActive ? "scale-110" : ""} />
                      </motion.span>
                      <span className="whitespace-nowrap">{link.label}</span>
                    </motion.span>
                  </motion.span>

                  {isActive && (
                    <motion.span
                      layoutId="nav-pill-vertical"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-xl border border-accent/30 bg-accent/10 shadow-[0_0_16px_-4px_var(--color-accent)]"
                    />
                  )}
                  {!isActive && (
                    <motion.span
                      variants={{
                        rest: { opacity: 0, scale: 0.85 },
                        hover: { opacity: 1, scale: 1 },
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                      className="absolute inset-0 rounded-xl border border-accent/20 bg-canvas-subtle shadow-[0_10px_24px_-10px_var(--color-accent)]"
                    />
                  )}
                </motion.a>
              );
            })}
          </nav>

          <div className="my-2 h-px w-8 shrink-0 bg-border-default" />

          <OpenBadge vertical />

          <div className="mt-2">
            <ThemeToggle />
          </div>
        </motion.div>
      </motion.header>

      {/* Mobile / tablet: compact floating pill, top-right */}
      <motion.header
        initial={{ opacity: 0, y: -12, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.3 + bootDelay }}
        className="safe-top fixed right-4 top-4 z-50 lg:hidden"
      >
        <div className="flex items-center gap-2 rounded-full border border-accent/20 bg-canvas/90 py-1.5 pl-1.5 pr-2 shadow-[0_16px_32px_-16px_var(--color-accent)] backdrop-blur-md">
          <Logo compact />

          <div className="h-4 w-px shrink-0 bg-border-default" />

          <div aria-live="polite" className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeLink.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 400, damping: 26 }}
                className="flex items-center gap-1.5 whitespace-nowrap px-0.5 text-sm font-medium text-accent"
              >
                <ActiveIcon size={13} />
                {activeLink.label}
              </motion.span>
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.12, y: -2 }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: "spring", stiffness: 420, damping: 16 }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border-default text-fg-muted shadow-sm transition-[border-color,color,box-shadow] duration-300 hover:border-accent hover:text-accent hover:shadow-[0_8px_18px_-8px_var(--color-accent)]"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
                transition={{ duration: 0.15 }}
                className="flex"
              >
                {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ opacity: 0, scale: 0.9, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -8 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-accent/20 bg-canvas/95 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.6)] backdrop-blur-md"
            >
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.05 } },
                }}
                className="flex flex-col gap-1 p-3"
              >
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = active === link.href;
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      variants={{
                        hidden: { opacity: 0, x: 12 },
                        show: { opacity: 1, x: 0 },
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        setMobileOpen(false);
                        window.setTimeout(() => smoothScrollToId(link.href), 150);
                      }}
                      whileTap={{ scale: 0.97 }}
                      className={`flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "border border-accent/30 bg-accent/10 text-accent"
                          : "text-fg-muted hover:bg-canvas-subtle hover:text-fg-default"
                      }`}
                      style={{ perspective: 800 }}
                    >
                      <motion.span
                        animate={{ rotateY: isActive ? -360 : 0 }}
                        transition={{ duration: isActive ? 0.65 : 0 }}
                        className="flex items-center gap-2.5"
                      >
                        <Icon size={15} className="shrink-0" />
                        {link.label}
                      </motion.span>
                    </motion.a>
                  );
                })}
                <div className="mono mt-1 flex items-center gap-1.5 self-start rounded-full border border-success/30 bg-success-subtle px-2.5 py-1 text-[11px] font-medium text-success">
                  <Sparkles size={11} />
                  Open to research collaboration
                </div>
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
