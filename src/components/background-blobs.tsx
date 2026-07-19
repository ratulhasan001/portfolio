"use client";

import { motion } from "framer-motion";

export function BackgroundBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="blob absolute -left-32 -top-32 h-96 w-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 60, -20, 0],
          y: [0, 40, 80, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="blob absolute -right-24 top-10 h-80 w-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle, var(--color-done) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 60, -30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="blob absolute bottom-0 left-1/3 h-72 w-72 rounded-full"
        style={{
          background:
            "radial-gradient(circle, var(--color-success) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
