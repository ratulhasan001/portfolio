"use client";

import { useEffect, useState } from "react";
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

const links = [
  { href: "#overview", label: "Overview", icon: LayoutDashboard },
  { href: "#experience", label: "Experience", icon: Briefcase },
  { href: "#education", label: "Education", icon: GraduationCap },
  { href: "#research", label: "Research", icon: FlaskConical },
  { href: "#projects", label: "Projects", icon: FolderGit2 },
  { href: "#skills", label: "Skills", icon: Trophy },
  { href: "#contact", label: "Contact", icon: Mail },
];

export function Nav() {
  const [active, setActive] = useState("#overview");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-border-default bg-canvas/85 backdrop-blur-md"
          : "border-transparent bg-canvas"
      }`}
    >
      <div className="gradient-line h-[2px] w-full opacity-70" />

      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
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
          <span className="mono text-sm tracking-tight">
            ratulhasan<span className="text-accent">/</span>
            <span className="gradient-text font-semibold">research</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = active === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollToId(link.href);
                }}
                className="group relative"
              >
                <motion.span
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.94 }}
                  className={`relative z-10 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-accent"
                      : "text-fg-muted group-hover:text-fg-default"
                  }`}
                >
                  <Icon
                    size={13}
                    className={`transition-transform duration-300 ${
                      isActive ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  {link.label}
                </motion.span>
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full border border-accent/30 bg-accent/10 shadow-[0_0_16px_-4px_var(--color-accent)]"
                  />
                )}
                {!isActive && (
                  <span className="absolute inset-0 rounded-full bg-canvas-subtle opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="mono hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-success/30 bg-success-subtle px-2.5 py-1 text-[11px] font-medium text-success xl:flex">
            <motion.span
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full bg-success"
            />
            Open to research
          </div>
          <ThemeToggle />
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border-default text-fg-muted transition-colors hover:border-accent hover:text-accent md:hidden"
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
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border-default bg-canvas md:hidden"
          >
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.05 } },
              }}
              className="flex flex-col gap-1 px-4 py-3"
            >
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = active === link.href;
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    variants={{
                      hidden: { opacity: 0, x: -12 },
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
                  >
                    <Icon size={15} />
                    {link.label}
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
    </header>
  );
}
