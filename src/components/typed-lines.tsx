"use client";

import { motion } from "framer-motion";
import { PopWords } from "./pop-in";
import { getBootDelay } from "@/lib/boot-delay";

type Line = { prompt: string; output: string; pop?: boolean };

const lines: Line[] = [
  { prompt: "whoami", output: "Ratul Hasan — CSE undergraduate, BAUET" },
  {
    prompt: "cat goal.txt",
    output:
      "Pursuing a PhD in Machine Learning / AI, focused on trustworthy LLMs and biology-informed modeling for healthcare.",
    pop: true,
  },
  {
    prompt: "cat thesis.md",
    output:
      "Biology-Informed Recurrent Neural Networks for Longitudinal Hippocampal Atrophy Forecasting in Alzheimer's Disease.",
  },
  {
    prompt: "echo $CURRENT_FOCUS",
    output: "LLM bias & hallucination · mental-health NLP · applied deep learning",
  },
];

export function TypedLines() {
  return (
    <div className="mono space-y-4 text-sm">
      {lines.map((line, i) => (
        <motion.div
          key={line.prompt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 + i * 0.35 }}
        >
          <div className="flex items-center gap-2 text-fg-muted">
            <span className="text-success">$</span>
            <span>{line.prompt}</span>
          </div>
          {line.pop ? (
            <p className="mt-1 pl-4 text-[13px] leading-relaxed text-fg-default sm:text-sm">
              <PopWords
                text={line.output}
                delay={0.55 + i * 0.35 + getBootDelay(1.6)}
                stagger={0.035}
                className="gradient-text font-semibold"
              />
            </p>
          ) : (
            <motion.p
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.55 + i * 0.35 }}
              className="mt-1 pl-4 text-[13px] leading-relaxed text-fg-default sm:text-sm"
            >
              {line.output}
            </motion.p>
          )}
        </motion.div>
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 + lines.length * 0.35 }}
        className="flex items-center gap-2 text-fg-muted"
      >
        <span className="text-success">$</span>
        <span className="animate-caret inline-block h-4 w-2 bg-fg-muted" />
      </motion.span>
    </div>
  );
}
