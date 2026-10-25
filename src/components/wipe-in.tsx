"use client";

import { motion, type Variants } from "framer-motion";

/** Direction the reveal travels, named the way PowerPoint names it. */
export type WipeFrom = "bottom" | "left" | "top" | "right";

/** Start state for a wipe: the element fully clipped away on one edge. */
const clipFrom: Record<WipeFrom, string> = {
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

const CLIP_SHOWN = "inset(0% 0% 0% 0%)";

function wipeVariants(from: WipeFrom, duration: number): Variants {
  return {
    hidden: { clipPath: clipFrom[from] },
    show: {
      clipPath: CLIP_SHOWN,
      transition: { duration, ease: [0.33, 0, 0.2, 1] },
    },
  };
}

/**
 * PowerPoint's Wipe entrance: the content is revealed edge-to-edge rather
 * than faded or moved, so nothing shifts position on the way in.
 */
export function WipeIn({
  children,
  className,
  delay = 0,
  from = "bottom",
  duration = 0.55,
  as = "div",
  inView = true,
  viewportMargin = "-60px",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  from?: WipeFrom;
  duration?: number;
  as?: "div" | "span";
  inView?: boolean;
  viewportMargin?: string;
}) {
  const MotionTag = as === "span" ? motion.span : motion.div;

  return (
    <MotionTag
      initial={{ clipPath: clipFrom[from] }}
      {...(inView
        ? {
            whileInView: { clipPath: CLIP_SHOWN },
            viewport: { once: true, margin: viewportMargin },
          }
        : { animate: { clipPath: CLIP_SHOWN } })}
      transition={{ duration, delay, ease: [0.33, 0, 0.2, 1] }}
      className={className}
      style={as === "span" ? { display: "inline-block" } : undefined}
    >
      {children}
    </MotionTag>
  );
}

/** Wipe, one word after the next — PowerPoint's "Wipe, By Word". */
export function WipeWords({
  text,
  className,
  delay = 0,
  stagger = 0.05,
  from = "bottom",
  duration = 0.5,
  inView = false,
  viewportMargin = "-60px",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  from?: WipeFrom;
  duration?: number;
  inView?: boolean;
  viewportMargin?: string;
}) {
  const words = text.split(" ");
  const trigger = inView
    ? {
        initial: "hidden" as const,
        whileInView: "show" as const,
        viewport: { once: true, margin: viewportMargin },
      }
    : { initial: "hidden" as const, animate: "show" as const };

  const item = wipeVariants(from, duration);

  return (
    <motion.span
      {...trigger}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={className}
    >
      {words.map((word, i) => (
        <span key={i}>
          <motion.span variants={item} className="inline-block">
            {word}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </motion.span>
  );
}

/**
 * Rise, letter by letter: each letter slides up from behind its word's
 * baseline, as if pushed through a slot. Only `transform` animates, so the
 * browser composites it on the GPU and the large hero type stays smooth.
 * Reserved for the name in the hero.
 */
export function RiseLetters({
  text,
  className,
  delay = 0,
  stagger = 0.035,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = text.split(" ");

  return (
    <motion.span
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      aria-label={text}
      className={className}
    >
      {words.map((word, i) => (
        <span key={i} aria-hidden>
          {/* The padding/negative margin pair widens the mask past the tight
              display leading so ascenders and descenders aren't clipped. */}
          <span className="-my-[0.14em] inline-block overflow-hidden py-[0.14em] align-bottom">
            {Array.from(word).map((letter, j) => (
              <motion.span
                key={j}
                variants={{
                  hidden: { y: "110%" },
                  show: {
                    y: "0%",
                    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                style={{ willChange: "transform" }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </motion.span>
  );
}
