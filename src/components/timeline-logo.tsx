"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * Timeline marker: the org/school logo sitting on the rail, falling back to
 * the plain icon dot when an entry has no logo.
 */
export function TimelineLogo({
  src,
  alt,
  fallback,
  current,
  delay = 0,
}: {
  src?: string;
  alt: string;
  fallback: React.ReactNode;
  current?: boolean;
  delay?: number;
}) {
  return (
    <motion.span
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, type: "spring" }}
      className="absolute -left-[18px]"
    >
      {src ? (
        <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border-default bg-canvas-overlay shadow-sm">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="36px"
            className="object-contain p-0.5"
          />
        </span>
      ) : (
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full border border-border-default ${
            current ? "bg-success text-canvas" : "bg-accent text-canvas"
          }`}
        >
          {fallback}
        </span>
      )}
      {current && (
        <motion.span
          animate={{ scale: [1, 1.25, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-canvas bg-success"
        />
      )}
    </motion.span>
  );
}
