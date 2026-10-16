import { animate } from "framer-motion";
import type Lenis from "lenis";

const NAV_OFFSET = 56;

/** The page's Lenis instance, while smooth scrolling is running. */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function smoothScrollToId(id: string) {
  if (typeof window === "undefined") return;
  const el = document.querySelector(id) as HTMLElement | null;
  if (!el) return;

  const startY = window.scrollY;
  const targetY = Math.max(
    0,
    el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET
  );
  const distance = Math.abs(targetY - startY);
  const duration = Math.min(1.15, Math.max(0.45, distance / 2200));

  el.classList.add("nav-flash-target");

  const onComplete = () => {
    el.classList.add("nav-flash");
    window.setTimeout(() => {
      el.classList.remove("nav-flash");
      el.classList.remove("nav-flash-target");
    }, 1000);
    if (history.pushState) {
      history.pushState(null, "", id);
    }
  };

  // Lenis owns the scroll position while it runs, so a jump has to go through
  // it; driving window.scrollTo underneath would fight its interpolation.
  if (lenis) {
    lenis.scrollTo(targetY, { duration, easing: easeOutExpo, onComplete });
    return;
  }

  animate(startY, targetY, {
    duration,
    ease: [0.16, 1, 0.3, 1],
    onUpdate: (v) => window.scrollTo(0, v),
    onComplete,
  });
}
