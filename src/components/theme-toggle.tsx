"use client";

import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={toggle}
      aria-label="Toggle theme"
      whileHover={{ scale: 1.12, y: -2, rotate: 12 }}
      whileTap={{ scale: 0.88, rotate: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 16 }}
      className="relative flex h-8 w-8 items-center justify-center rounded-md border border-border-default bg-canvas-subtle text-fg-muted shadow-sm transition-[border-color,color,box-shadow] duration-300 hover:border-accent hover:text-fg-default hover:shadow-[0_8px_18px_-8px_var(--color-accent)] cursor-pointer"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ duration: 0.25 }}
          className="flex items-center justify-center"
        >
          {isDark ? <Moon size={15} /> : <Sun size={15} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
