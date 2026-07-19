"use client";

import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { smoothScrollToId } from "@/lib/scroll";

const nodes = [
  { id: "overview", label: "Overview" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "research", label: "Research" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

function RailNode({
  id,
  label,
  threshold,
  progress,
}: {
  id: string;
  label: string;
  threshold: number;
  progress: MotionValue<number>;
}) {
  const scale = useTransform(
    progress,
    [Math.max(threshold - 0.08, 0), threshold],
    [1, 1.6]
  );
  const backgroundColor = useTransform(
    progress,
    [Math.max(threshold - 0.01, 0), threshold],
    ["var(--color-border-default)", "var(--color-accent)"]
  );

  return (
    <motion.button
      type="button"
      aria-label={`Jump to ${label}`}
      onClick={() => smoothScrollToId(`#${id}`)}
      className="group absolute -left-2.5 flex -translate-y-1/2 items-center py-2.5 pr-3 cursor-pointer"
      style={{ top: `${threshold * 100}%` }}
      whileTap={{ scale: 0.85 }}
    >
      <motion.span
        style={{ scale, backgroundColor }}
        whileHover={{ scale: 1.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        className="block h-[7px] w-[7px] rounded-full ring-4 ring-canvas"
      />
      <span className="mono pointer-events-none absolute left-5 whitespace-nowrap rounded border border-border-default bg-canvas-overlay px-2 py-0.5 text-[10px] text-fg-muted opacity-0 shadow-md transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">
        {label}
      </span>
    </motion.button>
  );
}

export function ScrollRail() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });
  const dotTop = useTransform(smooth, [0, 1], ["0%", "100%"]);

  return (
    <div className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <div className="relative h-[46vh] w-px bg-border-default">
        <motion.div
          style={{ scaleY: smooth }}
          className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-accent via-done to-success"
        />

        {nodes.map(({ id, label }, i) => (
          <RailNode
            key={id}
            id={id}
            label={label}
            threshold={i / (nodes.length - 1)}
            progress={smooth}
          />
        ))}

        <motion.div
          aria-hidden
          style={{ top: dotTop }}
          className="pointer-events-none absolute -left-[5px] h-[11px] w-[11px] -translate-y-1/2 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent)]"
        />
        <motion.div
          aria-hidden
          style={{ top: dotTop }}
          animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          className="pointer-events-none absolute -left-[5px] h-[11px] w-[11px] -translate-y-1/2 rounded-full bg-accent"
        />
      </div>
    </div>
  );
}
