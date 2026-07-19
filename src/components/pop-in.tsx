"use client";

import { motion } from "framer-motion";

export function PopWords({
  text,
  className,
  delay = 0,
  stagger = 0.05,
  inView = false,
  viewportMargin = "-60px",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  inView?: boolean;
  viewportMargin?: string;
}) {
  const words = text.split(" ");
  const triggerProps = inView
    ? {
        initial: "hidden" as const,
        whileInView: "show" as const,
        viewport: { once: true, margin: viewportMargin },
      }
    : { initial: "hidden" as const, animate: "show" as const };

  return (
    <motion.span
      {...triggerProps}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={className}
    >
      {words.map((word, i) => (
        <span key={i}>
          <span className="inline-block overflow-visible pb-1 align-bottom">
            <motion.span
              variants={{
                hidden: { opacity: 0, scale: 0.25, y: 24, rotate: -14 },
                show: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  rotate: 0,
                  transition: { type: "spring", stiffness: 520, damping: 12, mass: 0.6 },
                },
              }}
              className="inline-block"
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </motion.span>
  );
}

export function PopIn({
  children,
  className,
  delay = 0,
  scale = 0.7,
  as = "div",
  inView = false,
  viewportMargin = "-60px",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  scale?: number;
  as?: "div" | "span";
  inView?: boolean;
  viewportMargin?: string;
}) {
  const MotionTag = as === "span" ? motion.span : motion.div;
  const triggerProps = inView
    ? { whileInView: { opacity: 1, scale: 1, y: 0 }, viewport: { once: true, margin: viewportMargin } }
    : { animate: { opacity: 1, scale: 1, y: 0 } };

  return (
    <MotionTag
      initial={{ opacity: 0, scale, y: 14 }}
      {...triggerProps}
      transition={{
        type: "spring",
        stiffness: 440,
        damping: 13,
        mass: 0.55,
        delay,
      }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
