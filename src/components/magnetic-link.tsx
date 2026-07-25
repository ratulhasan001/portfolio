"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { motion, useSpring } from "framer-motion";

type Ripple = { id: number; x: number; y: number };

export function MagneticLink({
  href,
  download,
  target,
  rel,
  onClick,
  className,
  children,
}: {
  href: string;
  download?: boolean;
  target?: string;
  rel?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(0, { stiffness: 300, damping: 20, mass: 0.5 });
  const y = useSpring(0, { stiffness: 300, damping: 20, mass: 0.5 });
  const [ripples, setRipples] = useState<Ripple[]>([]);

  function handleMouseMove(e: MouseEvent<HTMLAnchorElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const id = Date.now();
      setRipples((r) => [
        ...r,
        { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
      ]);
      window.setTimeout(
        () => setRipples((r) => r.filter((rp) => rp.id !== id)),
        650
      );
    }
    onClick?.(e);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      download={download}
      target={target}
      rel={rel}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileTap={{ scale: 0.96 }}
      style={{ x, y }}
      className={`group relative isolate flex items-center justify-center overflow-hidden ${className ?? ""}`}
    >
      {children}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          aria-hidden
          initial={{ opacity: 0.35, scale: 0 }}
          animate={{ opacity: 0, scale: 5 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          style={{ left: r.x, top: r.y }}
          className="pointer-events-none absolute -z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
        />
      ))}
    </motion.a>
  );
}
