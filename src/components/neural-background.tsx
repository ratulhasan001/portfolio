"use client";

import { motion } from "framer-motion";

const nodes = [
  { x: 6, y: 20 }, { x: 4, y: 62 }, { x: 16, y: 88 },
  { x: 30, y: 10 }, { x: 28, y: 45 }, { x: 34, y: 78 },
  { x: 52, y: 25 }, { x: 50, y: 60 }, { x: 60, y: 92 },
  { x: 74, y: 12 }, { x: 76, y: 48 }, { x: 70, y: 80 },
  { x: 94, y: 30 }, { x: 92, y: 68 },
];

const edges: [number, number][] = [
  [0, 3], [0, 4], [1, 4], [1, 5], [2, 5],
  [3, 6], [4, 6], [4, 7], [5, 7], [5, 8],
  [6, 9], [6, 10], [7, 10], [7, 11], [8, 11],
  [9, 12], [10, 12], [10, 13], [11, 13],
];

export function NeuralBackground() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[var(--glow-opacity)]"
    >
      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="var(--color-accent)"
          strokeWidth={0.15}
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: i * 0.04, ease: "easeInOut" }}
        />
      ))}
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={0.8}
          fill="var(--color-done)"
          initial={{ opacity: 0.5, scale: 0 }}
          whileInView={{ scale: 1, opacity: [0.5, 1, 0.5] }}
          viewport={{ once: true }}
          transition={{
            scale: { duration: 0.4, delay: i * 0.05 },
            opacity: {
              duration: 2.5 + (i % 4),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            },
          }}
        />
      ))}
    </svg>
  );
}
