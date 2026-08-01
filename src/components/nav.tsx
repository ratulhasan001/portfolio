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
} from "lucide-react";
import { smoothScrollToId } from "@/lib/scroll";
import { getBootDelay } from "@/lib/boot-delay";

const links = [
  { href: "#overview", label: "Overview", icon: LayoutDashboard },
  { href: "#research", label: "Research", icon: FlaskConical },
  { href: "#education", label: "Education", icon: GraduationCap },
  { href: "#experience", label: "Experience", icon: Briefcase },
  { href: "#skills", label: "Skills", icon: Trophy },
  { href: "#projects", label: "Projects", icon: FolderGit2 },
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
      className="flex items-center gap-2 font-semibold text-fg-default"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border-default bg-canvas-subtle text-accent">
        <GitBranch size={15} />
      </span>
      {!compact && (
        <span className="mono text-sm tracking-tight">
          ratulhasan<span className="text-accent">/</span>research
        </span>
      )}
    </a>
  );
}

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

  const bootDelay = getBootDelay(1.6);
  const activeLink = links.find((l) => l.href === active) ?? links[0];
  const ActiveIcon = activeLink.icon;

  return (
    <>
      {/* Desktop: floating horizontal bar, top */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{
          opacity: 1,
          y: 0,
          marginLeft: scrolled ? 14 : 0,
          marginRight: scrolled ? 14 : 0,
          marginTop: scrolled ? 10 : 0,
          borderRadius: scrolled ? 20 : 0,
        }}
        transition={{
          opacity: { duration: 0.5, delay: 0.2 + bootDelay },
          y: { duration: 0.5, delay: 0.2 + bootDelay },
          marginLeft: { type: "spring", stiffness: 260, damping: 26 },
          marginRight: { type: "spring", stiffness: 260, damping: 26 },
          marginTop: { type: "spring", stiffness: 260, damping: 26 },
          borderRadius: { type: "spring", stiffness: 260, damping: 26 },
        }}
        className={`safe-top sticky top-0 z-50 hidden overflow-hidden transition-[background-color,border-color,box-shadow] duration-500 lg:block ${
          scrolled
            ? "border border-border-default bg-canvas/85 shadow-md backdrop-blur-md"
            : "border-b border-transparent bg-canvas shadow-none"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />

          <nav className="ml-10 flex items-center gap-1">
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
                  className="group relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium"
                >
                  <span
                    className={`relative z-10 flex items-center gap-1.5 transition-colors duration-200 ${
                      isActive
                        ? "text-accent"
                        : "text-fg-muted group-hover:text-fg-default"
                    }`}
                  >
                    <Icon size={13} />
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-accent/10"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          <ThemeToggle />
        </div>
      </motion.header>

      {/* Mobile / tablet: compact floating pill, top-right */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 + bootDelay }}
        className="safe-top fixed right-4 top-4 z-50 lg:hidden"
      >
        <div className="flex items-center gap-2 rounded-full border border-border-default bg-canvas/90 py-1.5 pl-1.5 pr-2 shadow-md backdrop-blur-md">
          <Logo compact />

          <div className="h-4 w-px shrink-0 bg-border-default" />

          <div aria-live="polite" className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeLink.href}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5 whitespace-nowrap px-0.5 text-sm font-medium text-accent"
              >
                <ActiveIcon size={13} />
                {activeLink.label}
              </motion.span>
            </AnimatePresence>
          </div>

          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border-default text-fg-muted transition-colors duration-200 hover:border-accent hover:text-accent"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border-default bg-canvas/95 shadow-lg backdrop-blur-md"
            >
              <div className="flex flex-col gap-1 p-3">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = active === link.href;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setMobileOpen(false);
                        window.setTimeout(() => smoothScrollToId(link.href), 150);
                      }}
                      className={`flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "bg-accent/10 text-accent"
                          : "text-fg-muted hover:bg-canvas-subtle hover:text-fg-default"
                      }`}
                    >
                      <Icon size={15} className="shrink-0" />
                      {link.label}
                    </a>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
