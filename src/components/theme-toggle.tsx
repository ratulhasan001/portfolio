"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "./theme-provider";
import { Mascot } from "./mascot";

/** Light-mode nudges toward dark mode, shown one after another: mostly
 *  practical, with a light touch of humour. */
const PLEAS = [
  "Lights out? 🌙",
  "Try dark mode",
  "Easier on the eyes at night",
  "Bugs hate the dark 🐛",
  "Real devs code in the dark",
];

const SHOW_MS = 6000;
const SWAP_MS = 300;

/**
 * The theme switch is a robot that sleeps when the lights go out. In light
 * mode, near the top of the page, it keeps a quiet line going about dark
 * mode, changing it every few seconds; in dark mode it sleeps, eyes shut
 * with a few z's drifting up.
 */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const [plea, setPlea] = useState(0);
  const [swapping, setSwapping] = useState(false);
  const [atTop, setAtTop] = useState(true);

  // The nav (and this robot) follows the reader down the page, so it only
  // talks unprompted near the top; further down it'd sit over the content.
  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isDark) return;
    let swap = 0;
    const tick = window.setInterval(() => {
      if (document.hidden) return;
      // Hide the bubble, change the line while it's hidden, then bring it
      // back, so each new plea pops in rather than the text jumping.
      setSwapping(true);
      swap = window.setTimeout(() => {
        setPlea((p) => (p + 1) % PLEAS.length);
        setSwapping(false);
      }, SWAP_MS);
    }, SHOW_MS);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(swap);
    };
  }, [isDark]);

  // Awake: talking near the top of the page (it only waves on hover).
  // Asleep: quiet.
  const mood = isDark ? "is-asleep" : swapping || !atTop ? "" : "is-talking";

  return (
    <motion.button
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 420, damping: 16 }}
      className="theme-bot relative flex h-10 w-9 cursor-pointer items-end justify-center"
    >
      <Mascot kind="ai" plain say={isDark ? "Wake me up ☀️" : PLEAS[plea]} className={mood} />
      {isDark && (
        <span aria-hidden className="theme-bot__zzz">
          <i>z</i>
          <i>z</i>
          <i>z</i>
        </span>
      )}
    </motion.button>
  );
}
