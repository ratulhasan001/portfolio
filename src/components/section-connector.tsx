"use client";

import { motion } from "framer-motion";

export function SectionConnector() {
  return (
    <div className="relative mx-auto flex h-14 w-px items-center justify-center overflow-visible">
      <div className="absolute inset-0 mx-auto w-px bg-border-default" />
      <motion.span
        aria-hidden
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]"
      />
    </div>
  );
}
