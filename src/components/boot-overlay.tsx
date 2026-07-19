"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const bootLines = [
  { text: "booting research-kernel v2.6.hasan", delay: 0 },
  { text: "mounting /home/ratul/research ... OK", delay: 220 },
  { text: "loading modules: llm-bias, bio-rnn, blockchain, cv ... OK", delay: 420 },
  { text: "starting phd-application.service ... active", delay: 640 },
  { text: "welcome, ratul.", delay: 900 },
];

export function BootOverlay() {
  const [visible, setVisible] = useState(false);
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = window.sessionStorage.getItem("booted");
    if (seen || reduced) return;

    setVisible(true);
    window.sessionStorage.setItem("booted", "1");

    const timers = bootLines.map((line, i) =>
      window.setTimeout(() => setLineCount(i + 1), line.delay)
    );
    const hide = window.setTimeout(() => setVisible(false), 1500);

    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(hide);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-canvas"
        >
          <div className="mono w-full max-w-md px-6 text-xs text-fg-muted sm:text-sm">
            {bootLines.slice(0, lineCount).map((line, i) => (
              <motion.p
                key={line.text}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="mb-1.5 flex items-center gap-2"
              >
                <span className="text-success">[ ok ]</span>
                <span className={i === bootLines.length - 1 ? "text-accent" : ""}>
                  {line.text}
                </span>
              </motion.p>
            ))}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block h-3.5 w-2 translate-y-0.5 bg-fg-muted"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
