"use client";

import { useRef, type MouseEvent } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { profile } from "@/lib/data";
import { NeuralBackground } from "./neural-background";

export function HeroPortrait() {
  const ref = useRef<HTMLDivElement>(null);
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mvY, [-0.5, 0.5], [8, -8]), {
    stiffness: 220,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mvX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 220,
    damping: 22,
  });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mvX.set((e.clientX - rect.left) / rect.width - 0.5);
    mvY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mvX.set(0);
    mvY.set(0);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      className="relative mx-auto flex h-60 w-60 items-center justify-center sm:h-80 sm:w-80 lg:h-[22rem] lg:w-[22rem]"
    >
      {/* ambient glow */}
      <motion.span
        aria-hidden
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -inset-6 rounded-full bg-[radial-gradient(circle,var(--color-accent)_0%,transparent_65%)] blur-2xl"
      />
      <motion.span
        aria-hidden
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1.05, 0.95, 1.05] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(circle,var(--color-done)_0%,transparent_65%)] blur-2xl"
      />

      {/* neural node backdrop */}
      <div className="pointer-events-none absolute -inset-10 opacity-70">
        <NeuralBackground />
      </div>

      {/* holographic rings */}
      <motion.span
        aria-hidden
        animate={{ rotate: 360 }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute inset-2 rounded-full border border-dashed border-accent/25"
      />
      <motion.span
        aria-hidden
        animate={{ rotate: -360 }}
        transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute -inset-4 rounded-full border border-done/20"
      />

      {/* portrait */}
      <motion.div
        style={{ rotateX, rotateY }}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 h-40 w-40 rounded-full sm:h-56 sm:w-56 lg:h-64 lg:w-64"
      >
        <span
          aria-hidden
          className="absolute -inset-1.5 rounded-full bg-accent/40 blur-md"
        />
        <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-accent/60 shadow-[0_0_48px_-10px_var(--color-accent)]">
          <Image
            src="/my_img.jpg"
            alt={profile.name}
            fill
            sizes="(min-width: 1024px) 256px, (min-width: 640px) 224px, 160px"
            priority
            className="object-cover object-top"
          />
        </div>
      </motion.div>
    </div>
  );
}
