"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useSpring, type Variants } from "framer-motion";

function useTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const rotateX = useSpring(0, { stiffness: 300, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 25 });
  const scale = useSpring(1, { stiffness: 300, damping: 25 });
  const mouseX = useSpring(50, { stiffness: 300, damping: 25 });
  const mouseY = useSpring(50, { stiffness: 300, damping: 25 });

  function handleMouseMove(e: React.MouseEvent<T>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 10);
    rotateX.set((0.5 - py) * 10);
    mouseX.set(px * 100);
    mouseY.set(py * 100);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  }

  const glow = useMotionTemplate`radial-gradient(280px circle at ${mouseX}% ${mouseY}%, var(--color-accent) 0%, transparent 70%)`;

  return {
    ref,
    rotateX,
    rotateY,
    scale,
    glow,
    handleMouseMove,
    handleMouseLeave,
    handleMouseEnter: () => scale.set(1.02),
  };
}

export function TiltCard({
  children,
  className,
  variants,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
}) {
  const t = useTilt<HTMLDivElement>();
  return (
    <motion.div
      ref={t.ref}
      variants={variants}
      onMouseMove={t.handleMouseMove}
      onMouseLeave={t.handleMouseLeave}
      onMouseEnter={t.handleMouseEnter}
      style={{ rotateX: t.rotateX, rotateY: t.rotateY, scale: t.scale, transformPerspective: 800 }}
      className={`group relative ${className ?? ""}`}
    >
      <motion.span
        aria-hidden
        style={{ background: t.glow }}
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-[0.12]"
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

export function TiltLink({
  children,
  className,
  href,
  target,
  rel,
  variants,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
  target?: string;
  rel?: string;
  variants?: Variants;
}) {
  const t = useTilt<HTMLAnchorElement>();
  return (
    <motion.a
      ref={t.ref}
      href={href}
      target={target}
      rel={rel}
      variants={variants}
      onMouseMove={t.handleMouseMove}
      onMouseLeave={t.handleMouseLeave}
      onMouseEnter={t.handleMouseEnter}
      style={{ rotateX: t.rotateX, rotateY: t.rotateY, scale: t.scale, transformPerspective: 800 }}
      className={`group relative ${className ?? ""}`}
    >
      <motion.span
        aria-hidden
        style={{ background: t.glow }}
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-[0.12]"
      />
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </motion.a>
  );
}
