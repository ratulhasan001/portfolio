/**
 * Scroll-triggered entrances were dropped for performance: animating
 * clip-path repaints on every frame, and with dozens of blocks revealing as
 * the page scrolled it caused visible stutter. These wrappers keep their old
 * call sites working but now render content as-is.
 */
export function FadeIn({
  children,
  className,
}: {
  children: React.ReactNode;
  /** Kept for call-site compatibility; no longer used. */
  delay?: number;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function StaggerGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  /** Kept for call-site compatibility; no longer used. */
  stagger?: number;
}) {
  return <div className={className}>{children}</div>;
}

/** Empty variants: children of a StaggerGroup render in their final state. */
export const staggerItem = {
  hidden: {},
  show: {},
};

/**
 * On-load entrance for the hero only: a bottom-up wipe driven by a CSS
 * keyframe, so it runs once without JavaScript per frame. Styles live in
 * globals.css under `.hero-reveal`.
 */
export function HeroReveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`hero-reveal${className ? ` ${className}` : ""}`}
      style={{ "--reveal-delay": `${delay}s` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
