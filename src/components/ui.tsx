"use client";

import { motion } from "framer-motion";
import { WipeIn, WipeWords } from "./wipe-in";
import { getBootDelay } from "@/lib/boot-delay";

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      whileHover={{ y: -2, scale: 1.05, borderColor: "var(--color-accent)", color: "var(--color-accent)" }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="chip inline-flex items-center rounded-full border border-border-default bg-canvas-subtle px-2.5 py-1 text-[13px] font-medium text-fg-muted"
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
        <WipeIn
          as="span"
          delay={0.3 + getBootDelay(1.6)}
          inView={false}
          className="ml-auto mono inline-flex items-center rounded border border-accent/25 bg-accent/[0.08] px-1.5 py-0.5 text-[11px] font-medium text-accent"
        >
          {label}
        </WipeIn>
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
    <div className="mb-5 flex items-start gap-3">
      {/* `as="div"` on purpose: the span variant sets display:inline-block
          inline, which would beat the flex centring on the circle. */}
      <WipeIn
        inView
        className="mono mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-strong text-[12px] text-fg-muted sm:h-10 sm:w-10 sm:text-[13px]"
      >
        {index}
      </WipeIn>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-fg-default sm:text-3xl">
          <WipeWords text={title} inView delay={0.1} stagger={0.06} />
        </h2>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-1 max-w-2xl text-sm text-fg-muted sm:text-[15px]"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}
