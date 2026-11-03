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
 * baseline, as if pushed through a slot. This one is a plain CSS keyframe
 * rather than a Framer Motion animation on purpose: the name plays while
 * the rest of the page is still hydrating, and a JS-driven transform drops
 * frames whenever the main thread is busy. A CSS animation on `transform`
 * runs on the compositor thread, so it stays smooth regardless, and it
 * starts from the server-rendered HTML with no flash. Reserved for the
 * name in the hero. Styles live in globals.css under `.rise-letter`.
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
  let index = 0;

  return (
    <span aria-label={text} className={className}>
      {words.map((word, i) => (
        <span key={i} aria-hidden>
          {/* The padding/negative margin pair widens the mask past the tight
              display leading so ascenders and descenders aren't clipped. */}
          <span className="-my-[0.14em] inline-block overflow-hidden py-[0.14em] align-bottom">
            {Array.from(word).map((letter, j) => {
              const letterDelay = delay + stagger * index++;
              return (
                <span
                  key={j}
                  className="rise-letter"
                  style={{ "--rise-delay": `${letterDelay}s` } as React.CSSProperties}
                >
                  {letter}
                </span>
              );
            })}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}
