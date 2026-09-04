"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * Collapsed-by-default detail panel. Cards render their headline facts
 * inline and tuck everything else behind this toggle so a section reads
 * as a scannable list on first load.
 */
export function Disclosure({
  label = "Details",
  openLabel,
  count,
  children,
  className = "",
}: {
  label?: string;
  openLabel?: string;
  count?: number;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={(e) => {
          // Cards are often wrapped in a link — keep the toggle local.
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="mono inline-flex items-center gap-1 rounded-full border border-border-muted bg-canvas px-2 py-0.5 text-[11px] font-medium text-fg-muted transition-colors hover:border-accent/50 hover:text-accent"
      >
        {open ? openLabel ?? "Less" : label}
        {typeof count === "number" && !open && (
          <span className="text-fg-subtle">{count}</span>
        )}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex"
        >
          <ChevronDown size={11} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
