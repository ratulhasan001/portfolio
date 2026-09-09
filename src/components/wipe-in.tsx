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
 * PowerPoint's Whip entrance: the word is flung in around its leading edge
 * and snaps flat, so it lands with a crack rather than a glide. Reserved for
 * the name in the hero.
 */
export function WhipWords({
  text,
  className,
  delay = 0,
  stagger = 0.08,
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
      className={className}
    >
      {words.map((word, i) => (
        <span key={i}>
          <motion.span
            variants={{
              hidden: { opacity: 0, rotateY: -92, skewX: 26, x: -48 },
              show: {
                opacity: 1,
                rotateY: 0,
                skewX: 0,
                x: 0,
                transition: {
                  type: "spring",
                  stiffness: 320,
                  damping: 17,
                  mass: 0.7,
                },
              },
            }}
            style={{ transformPerspective: 900, transformOrigin: "left center" }}
            className="inline-block"
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </motion.span>
  );
}
