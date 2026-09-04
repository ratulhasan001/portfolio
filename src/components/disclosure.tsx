"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * Collapsed-by-default detail panel. Cards render their headline facts
 * inline and tuck everything else behind this toggle so a section reads
 * as a scannable list on first load.
 *
 * With no `label`, the trigger is a bare chevron button — the right weight
 * for per-item cards, where a worded button would repeat down the page.
 * Pass a `label` for section-level toggles that need naming.
 */
export function Disclosure({
  label,
  openLabel,
  title = "Show details",
  children,
  className = "",
}: {
  label?: string;
  openLabel?: string;
  /** Tooltip / screen-reader name for the icon-only trigger. */
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  // Cards are often wrapped in a link — keep the toggle local.
  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen((v) => !v);
  };

  const chevron = (
    <motion.span
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex"
    >
      <ChevronDown size={label ? 11 : 14} />
    </motion.span>
  );

  return (
    <div className={className}>
      {label ? (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={toggle}
          className="mono inline-flex items-center gap-1 rounded-full border border-border-muted bg-canvas px-2 py-0.5 text-[11px] font-medium text-fg-muted transition-colors hover:border-accent/50 hover:text-accent"
        >
          {open ? openLabel ?? "Less" : label}
          {chevron}
        </button>
      ) : (
        <motion.button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Hide details" : title}
          title={open ? "Hide details" : title}
          onClick={toggle}
          whileTap={{ scale: 0.9 }}
          className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
            open
              ? "border-accent/40 bg-accent/10 text-accent"
              : "border-border-muted bg-canvas text-fg-subtle hover:border-accent/40 hover:bg-accent/[0.06] hover:text-accent"
          }`}
        >
          {chevron}
        </motion.button>
      )}

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
