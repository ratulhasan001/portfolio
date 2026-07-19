"use client";

import { Circle } from "lucide-react";
import { motion } from "framer-motion";
import { PopIn, PopWords } from "./pop-in";
import { getBootDelay } from "@/lib/boot-delay";

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      whileHover={{ y: -2, scale: 1.05, borderColor: "var(--color-accent)", color: "var(--color-accent)" }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="chip inline-flex items-center rounded-full border border-border-default bg-canvas-subtle px-2.5 py-0.5 text-xs font-medium text-fg-muted"
    >
      {children}
    </motion.span>
  );
}

export function FileHeader({
  filename,
  label,
}: {
  filename: string;
  label?: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-t-md border border-b-0 border-border-default bg-canvas-subtle px-4 py-2.5">
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-attention/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
      </div>
      <span className="mono ml-2 text-xs text-fg-muted">{filename}</span>
      {label && (
        <PopIn
          as="span"
          delay={0.3 + getBootDelay(1.6)}
          scale={0.5}
          className="ml-auto mono inline-flex items-center rounded border border-accent/25 bg-accent/[0.08] px-1.5 py-0.5 text-[11px] font-medium text-accent"
        >
          {label}
        </PopIn>
      )}
    </div>
  );
}

export function SectionTitle({
  index,
  title,
  subtitle,
}: {
  index: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8 flex items-baseline gap-3">
      <PopIn as="span" inView scale={0.3} className="mono text-sm text-accent">
        {index}
      </PopIn>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-fg-default sm:text-3xl">
          <PopWords text={title} inView delay={0.1} stagger={0.06} />
        </h2>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-1 text-sm text-fg-muted"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}

export function StatusPill({
  status,
}: {
  status: "published" | "accepted" | "under-review";
}) {
  const map = {
    published: {
      text: "Published",
      cls: "bg-success-subtle text-success border-success/30",
    },
    accepted: {
      text: "Accepted",
      cls: "bg-accent/10 text-accent border-accent/30",
    },
    "under-review": {
      text: "Under Review",
      cls: "bg-attention-subtle text-attention border-attention/30",
    },
  } as const;
  const s = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.cls}`}
    >
      <motion.span
        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="flex"
      >
        <Circle size={6} className="fill-current" />
      </motion.span>
      {s.text}
    </span>
  );
}
