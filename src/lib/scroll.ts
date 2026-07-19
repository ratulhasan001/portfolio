import { animate } from "framer-motion";

const NAV_OFFSET = 56;

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

  animate(startY, targetY, {
    duration,
    ease: [0.16, 1, 0.3, 1],
    onUpdate: (v) => window.scrollTo(0, v),
    onComplete: () => {
      el.classList.add("nav-flash");
      window.setTimeout(() => {
        el.classList.remove("nav-flash");
        el.classList.remove("nav-flash-target");
      }, 1000);
      if (history.pushState) {
        history.pushState(null, "", id);
      }
    },
  });
}
