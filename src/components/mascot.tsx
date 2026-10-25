"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";

/**
 * Robot mascots, one per stack, ported from the GMC Experts Hub mascots:
 * the same CSS-built body (everything scales with --m-fs), with the bag
 * handle swapped for robot hardware.
 */
export type BotKind =
  | "ai"
  | "django"
  | "python"
  | "linux"
  | "rust"
  | "docker"
  | "react"
  | "bash"
  | "kubernetes"
  | "aws"
  | "azure"
  | "cpp"
  | "terraform"
  | "git"
  | "pytorch"
  | "postgres"
  | "javascript"
  | "typescript";

const BADGES: Partial<Record<BotKind, string>> = {
  ai: "AI",
  django: "dj",
  python: "py",
  rust: "rs",
  bash: ">_",
  kubernetes: "k8s",
  aws: "aws",
  cpp: "C++",
  terraform: "tf",
  git: "git",
  postgres: "pg",
  javascript: "JS",
  typescript: "TS",
};

/** What sits on the robot's head; anything not listed gets an antenna. */
function Hardware({ kind }: { kind: BotKind }) {
  switch (kind) {
    case "linux":
      return null;
    case "ai":
      return (
        <span className="mascot__antennas">
          <i />
          <i />
        </span>
      );
    case "docker":
      return (
        <span className="mascot__crates">
          <i />
          <i />
          <i />
          <i />
        </span>
      );
    case "rust":
      return (
        <span className="mascot__bolts">
          <i />
          <i />
        </span>
      );
    case "react":
      return <span className="mascot__orbit" />;
    case "kubernetes":
      return <span className="mascot__helm" />;
    case "azure":
      return <span className="mascot__cloud" />;
    case "pytorch":
      return <span className="mascot__flame" />;
    case "postgres":
      return (
        <span className="mascot__ears">
          <i />
          <i />
        </span>
      );
    default:
      return (
        <span className="mascot__antenna">
          <i />
        </span>
      );
  }
}

/** A stable per-instance blink offset, so a row of robots never blinks in
 *  unison. Derived from useId rather than Math.random to survive hydration. */
function delayFrom(id: string) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) | 0;
  return (Math.abs(h) % 40) / 10;
}

export function Mascot({
  kind,
  say,
  className,
  plain,
}: {
  kind: BotKind;
  say?: string;
  className?: string;
  /** Leave off the stack badge on the chest. */
  plain?: boolean;
}) {
  const id = useId();
  const badge = plain ? undefined : BADGES[kind];

  return (
    <span
      className={`mascot mascot--${kind}${className ? ` ${className}` : ""}`}
      data-mascot
      style={{ "--blink-delay": `-${delayFrom(id)}s` } as CSSProperties}
      aria-hidden
    >
      {say && <span className="mascot__say">{say}</span>}

      <Hardware kind={kind} />

      <span className="mascot__arms">
        <i />
        <i />
      </span>
      <span className="mascot__body">
        {kind === "linux" && <span className="mascot__tux" />}
        <span className="mascot__eyes">
          <i>
            <b />
          </i>
          <i>
            <b />
          </i>
        </span>
        <span className="mascot__cheeks">
          <i />
          <i />
        </span>
        <span className="mascot__mouth" />
        {badge && (
          <span className="mascot__badge">
            <b>{badge}</b>
          </span>
        )}
      </span>
      {kind === "react" && <span className="mascot__orbit mascot__orbit--front" />}
      <span className="mascot__feet">
        <i />
        <i />
      </span>
    </span>
  );
}

const CONFETTI = ["#ff9900", "#7c3aed", "#22d3ee", "#44b78b", "#ffd43b", "#2496ed"];

/** A burst of confetti from a point on screen, cleaned up as it lands. */
function confetti(x: number, y: number, n = 26) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < n; i++) {
    const c = document.createElement("span");
    c.className = "confetti";
    c.style.background = CONFETTI[i % CONFETTI.length];
    c.style.left = `${x}px`;
    c.style.top = `${y}px`;
    document.body.appendChild(c);
    const a = Math.random() * Math.PI * 2;
    const d = 60 + Math.random() * 120;
    const dx = Math.cos(a) * d;
    const dy = Math.sin(a) * d - 80;
    c.animate(
      [
        { transform: "translate(-50%,-50%) rotate(0deg)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${Math.random() * 720}deg)`, opacity: 1, offset: 0.55 },
        { transform: `translate(${dx * 1.2}px, ${dy + 160}px) rotate(${Math.random() * 900}deg)`, opacity: 0 },
      ],
      { duration: 1200 + Math.random() * 600, easing: "cubic-bezier(.2,.7,.3,1)" }
    ).onfinish = () => c.remove();
  }
}

/**
 * The big robot beside the name in the hero. It lands just after the name
 * rises, waves while it welcomes visitors, and cheers with confetti when
 * clicked.
 */
export function HeroBot({ className }: { className?: string }) {
  const [talking, setTalking] = useState(false);
  const [waving, setWaving] = useState(false);
  const [jumping, setJumping] = useState(false);
  const waveTimer = useRef(0);

  const wave = (ms: number) => {
    setWaving(true);
    window.clearTimeout(waveTimer.current);
    waveTimer.current = window.setTimeout(() => setWaving(false), ms);
  };

  useEffect(() => {
    const t = window.setTimeout(() => {
      setTalking(true);
      wave(2600);
    }, 1300);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(waveTimer.current);
    };
  }, []);

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setJumping(true);
    wave(2000);
    const r = e.currentTarget.getBoundingClientRect();
    confetti(r.left + r.width / 2, r.top + r.height * 0.3);
  };

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, y: 40, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.9 }}
      onClick={onClick}
      onAnimationEnd={(e) => {
        if (e.animationName === "mascot-jump") setJumping(false);
      }}
      className={`hero-bot cursor-pointer ${className ?? ""}`}
    >
      <Mascot
        kind="aws"
        plain
        say="Hello! Welcome to Ratul's portfolio 👋"
        className={`${talking ? "is-talking" : ""}${waving ? " is-happy" : ""}${jumping ? " is-jump" : ""}`}
      />
    </motion.div>
  );
}

/**
 * Pauses the page's robots while they're off screen and points their eyes
 * at the cursor.
 */
export function MascotDirector() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const seen = new Set<HTMLElement>();
    const mio = new IntersectionObserver((entries) =>
      entries.forEach((e) => {
        const m = e.target as HTMLElement;
        if (e.isIntersecting) seen.add(m);
        else seen.delete(m);
      })
    );
    document.querySelectorAll<HTMLElement>("[data-mascot]").forEach((m) => mio.observe(m));

    let px = 0;
    let py = 0;
    let queued = false;
    const look = () => {
      queued = false;
      seen.forEach((m) => {
        const r = m.getBoundingClientRect();
        const dx = px - (r.left + r.width / 2);
        const dy = py - (r.top + r.height * 0.4);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 300);
        m.style.setProperty("--px", `${((dx / d) * 0.06 * k).toFixed(3)}em`);
        m.style.setProperty("--py", `${((dy / d) * 0.07 * k).toFixed(3)}em`);
      });
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!queued) {
        queued = true;
        requestAnimationFrame(look);
      }
    };
    if (fine && !reduce) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      mio.disconnect();
    };
  }, []);

  return null;
}
