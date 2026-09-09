"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Pixel art, drawn here rather than borrowed: two frames that differ only in
 * which foot is planted, which is enough to read as a run cycle.
 */
const DINO_FRAMES = [
  [
    "...............######.",
    "..............########",
    "..............###.####",
    "..............########",
    "..............#######.",
    "..............######..",
    "..............####....",
    "#.............#####...",
    "##...........######...",
    "###.........#######...",
    "####.......########...",
    "#####.############....",
    "################......",
    ".###############......",
    "..##############......",
    "...############.......",
    "....##########........",
    ".....#########........",
    ".....####.####........",
    ".....###..####........",
    ".....###....##........",
    ".....###..............",
  ],
  [
    "...............######.",
    "..............########",
    "..............###.####",
    "..............########",
    "..............#######.",
    "..............######..",
    "..............####....",
    "#.............#####...",
    "##...........######...",
    "###.........#######...",
    "####.......########...",
    "#####.############....",
    "################......",
    ".###############......",
    "..##############......",
    "...############.......",
    "....##########........",
    ".....#########........",
    ".....####.####........",
    ".....###..####........",
    ".....###....##........",
    "............##........",
  ],
] as const;

const CACTUS = [
  "..###..",
  "..###..",
  "#.###..",
  "#.###.#",
  "#####.#",
  "..###.#",
  "..#####",
  "..###..",
  "..###..",
  "..###..",
] as const;

const CLOUD = ["..####....", ".######..#", "##########", ".########."] as const;

const DINO_ROWS = DINO_FRAMES[0].length;
const CACTUS_ROWS = CACTUS.length;
const CACTUS_COLS = CACTUS[0].length;

/** Collision boxes, in sprite cells. Deliberately tighter than the artwork so
 *  a near miss reads as a miss. */
const DINO_HIT = { x: 5, w: 14, y: 2, h: DINO_ROWS - 2 };
const CACTUS_HIT = { x: 1.5, w: 4 };

const SPEED = 190;
/** Play mode winds up to this over RAMP_SECONDS; the demo stays at SPEED. */
const SPEED_MAX = 380;
const RAMP_SECONDS = 75;
const GRAVITY = 1460;
const JUMP_V = -452;
const AIR_TIME = (2 * -JUMP_V) / GRAVITY;

/** Obstacle spacing has to grow with pace, or at speed the next cactus
 *  arrives before the dino has landed from the last one. */
function gapFor(speed: number) {
  const stretch = 0.6 + (0.4 * speed) / SPEED;
  return (250 + Math.random() * 230) * stretch;
}

type Sprite = readonly string[];
type Mode = "demo" | "playing" | "over";
type Obstacle = { x: number; scale: number };

function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: Sprite | undefined,
  x: number,
  y: number,
  px: number
) {
  if (!sprite) return;
  for (let row = 0; row < sprite.length; row++) {
    const line = sprite[row];
    for (let col = 0; col < line.length; col++) {
      if (line[col] === "#") {
        // +1 closes the hairline seams antialiasing leaves between cells.
        ctx.fillRect(x + col * px, y + row * px, px + 1, px + 1);
      }
    }
  }
}

/**
 * An endless runner that plays itself until someone takes over. In demo mode
 * the jumps are timed off the distance to the next cactus; in play mode the
 * jump is the visitor's and a collision ends the run.
 */
export function DinoRunner({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("demo");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  const modeRef = useRef<Mode>("demo");
  const bestRef = useRef(0);
  const jumpRef = useRef<() => void>(() => {});
  const startRef = useRef<() => void>(() => {});

  // Surfacing the stored best happens on the click that starts a run rather
  // than in an effect, so no state is set while merely mounting.
  const start = useCallback(() => {
    setBest(bestRef.current);
    startRef.current();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let ink = getComputedStyle(canvas).color;
    const themeWatcher = new MutationObserver(() => {
      ink = getComputedStyle(canvas).color;
    });
    themeWatcher.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    try {
      const stored = Number(window.localStorage.getItem("dino-best") || 0);
      if (Number.isFinite(stored)) bestRef.current = stored;
    } catch {
      /* storage can be unavailable; the run just starts without a best. */
    }

    let cssW = 0;
    let cssH = 0;
    const px = 3;
    let groundY = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      cssW = rect.width;
      cssH = rect.height;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      groundY = cssH - px * 6;
    };
    resize();

    let dinoY = 0;
    let vy = 0;
    let airborne = false;
    let distance = 0;
    let speed = SPEED;
    let shown = 0;
    let obstacles: Obstacle[] = [];
    let clouds: { x: number; y: number }[] = [];
    let nextGap = 320;

    const dinoLeft = () => Math.max(20, cssW * 0.12);

    const seed = () => {
      dinoY = 0;
      vy = 0;
      airborne = false;
      distance = 0;
      speed = SPEED;
      shown = 0;
      nextGap = 320;
      obstacles = [{ x: Math.max(cssW * 0.72, dinoLeft() + 260), scale: 1 }];
      clouds = [
        { x: cssW * 0.34, y: 0.16 },
        { x: cssW * 0.82, y: 0.34 },
      ];
    };
    seed();

    const boxes = (o: Obstacle) => {
      const s = px * o.scale;
      return {
        x: o.x + CACTUS_HIT.x * s,
        w: CACTUS_HIT.w * s,
        top: groundY - CACTUS_ROWS * s,
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.fillStyle = ink;

      const dinoH = DINO_ROWS * px;
      const x0 = dinoLeft();

      ctx.globalAlpha = 0.26;
      for (const c of clouds) drawSprite(ctx, CLOUD, c.x, cssH * c.y, px);
      ctx.globalAlpha = 1;

      ctx.fillRect(0, groundY, cssW, Math.max(1, px / 2));
      ctx.globalAlpha = 0.45;
      for (let i = 0; i < 26; i++) {
        const span = cssW + 140;
        const gx = (((i * 137 - distance * 0.9) % span) + span) % span - 70;
        ctx.fillRect(gx, groundY + px * (1 + (i % 3)), px * (1 + (i % 2)), Math.max(1, px / 2));
      }
      ctx.globalAlpha = 1;

      for (const o of obstacles) {
        const s = px * o.scale;
        drawSprite(ctx, CACTUS, o.x, groundY - CACTUS_ROWS * s, s);
      }

      // Legs only shuffle while the dino is on the ground. Positive modulo:
      // a negative index would land on undefined.
      const frame =
        airborne || modeRef.current === "over"
          ? 0
          : Math.abs(Math.floor(distance / 26)) % 2;
      drawSprite(ctx, DINO_FRAMES[frame], x0, groundY - dinoH + dinoY, px);
    };

    let lastWidth = cssW;
    const ro = new ResizeObserver(() => {
      resize();
      if (Math.abs(cssW - lastWidth) > 1) {
        lastWidth = cssW;
        seed();
      }
      // Resizing resets the backing store, so repaint rather than leaving the
      // scene blank until the next frame (which may be a long way off in a
      // background tab).
      draw();
    });
    ro.observe(canvas);

    const jump = () => {
      if (airborne) return;
      vy = JUMP_V;
      airborne = true;
    };
    jumpRef.current = () => {
      if (modeRef.current === "playing") jump();
    };

    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      // rAF reports the frame start, which can predate the timestamp taken
      // just before scheduling; an unclamped dt would run time backwards.
      const dt = Math.max(0, Math.min((now - last) / 1000, 1 / 30));
      last = now;

      const running = modeRef.current !== "over";

      if (running) {
        if (modeRef.current === "playing") {
          speed = Math.min(
            SPEED_MAX,
            speed + ((SPEED_MAX - SPEED) / RAMP_SECONDS) * dt
          );
        }
        distance += speed * dt;

        for (const o of obstacles) o.x -= speed * dt;
        for (const c of clouds) c.x -= speed * 0.25 * dt;

        obstacles = obstacles.filter((o) => o.x + CACTUS_COLS * px * o.scale > -40);
        clouds = clouds.filter((c) => c.x + CLOUD[0].length * px > -40);

        const tail = obstacles[obstacles.length - 1];
        if (!tail || cssW - tail.x > nextGap) {
          obstacles.push({ x: cssW + 40, scale: Math.random() < 0.3 ? 1.25 : 1 });
          nextGap = gapFor(speed);
        }
        if (clouds.length < 2 && Math.random() < 0.012) {
          clouds.push({ x: cssW + 40, y: 0.12 + Math.random() * 0.3 });
        }

        const hitX = dinoLeft() + DINO_HIT.x * px;
        const hitW = DINO_HIT.w * px;

        if (modeRef.current === "demo") {
          // Centre the apex over the overlap window, so the arc clears the
          // cactus rather than relying on a hand-tuned trigger distance.
          const next = obstacles.find((o) => boxes(o).x + boxes(o).w > hitX);
          if (!airborne && next) {
            const b = boxes(next);
            const lead = speed * (AIR_TIME / 2) - (hitW + b.w) / 2;
            if (b.x - (hitX + hitW) <= lead) jump();
          }
        }

        if (airborne) {
          vy += GRAVITY * dt;
          dinoY += vy * dt;
          if (dinoY >= 0) {
            dinoY = 0;
            vy = 0;
            airborne = false;
          }
        }

        if (modeRef.current === "playing") {
          const dinoH = DINO_ROWS * px;
          const top = groundY - dinoH + dinoY + DINO_HIT.y * px;
          const bottom = top + DINO_HIT.h * px;
          for (const o of obstacles) {
            const b = boxes(o);
            if (hitX + hitW > b.x && hitX < b.x + b.w && bottom > b.top) {
              modeRef.current = "over";
              setMode("over");
              bestRef.current = Math.max(bestRef.current, shown);
              setBest(bestRef.current);
              try {
                window.localStorage.setItem("dino-best", String(bestRef.current));
              } catch {
                /* nothing to do if storage is unavailable */
              }
              break;
            }
          }

          const s = Math.floor(distance / 12);
          if (s !== shown) {
            shown = s;
            setScore(s);
          }
        }
      }

      draw();
      raf = requestAnimationFrame(step);
    };

    startRef.current = () => {
      seed();
      shown = 0;
      setScore(0);
      modeRef.current = "playing";
      setMode("playing");
    };

    // Only burn frames while the scene is actually on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !raf && !reduced) {
          last = performance.now();
          raf = requestAnimationFrame(step);
        } else if (!entry.isIntersecting && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    draw();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      themeWatcher.disconnect();
    };
  }, []);

  // Space and the arrow keys only belong to the game while a run is on.
  useEffect(() => {
    if (mode === "demo") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" && e.code !== "ArrowUp") return;
      e.preventDefault();
      if (mode === "over") start();
      else jumpRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, start]);

  return (
    <div className={className}>
      <div className="relative">
        <canvas
          ref={canvasRef}
          aria-hidden
          onPointerDown={() => {
            if (mode === "playing") jumpRef.current();
            else if (mode === "over") start();
          }}
          className={`h-[180px] w-full text-fg-default sm:h-[200px] ${
            mode === "playing" ? "cursor-pointer" : ""
          }`}
        />

        {mode !== "demo" && (
          <div
            aria-live="polite"
            className="mono pointer-events-none absolute right-0 top-0 text-[11px] uppercase tracking-[0.14em] text-fg-subtle"
          >
            {String(score).padStart(5, "0")}
            <span className="ml-3 text-fg-subtle/60">
              HI {String(best).padStart(5, "0")}
            </span>
          </div>
        )}

        {mode === "over" && (
          <div className="pointer-events-none absolute inset-x-0 top-[38%] text-center">
            <p className="mono text-[12px] uppercase tracking-[0.26em] text-fg-default">
              Game Over
            </p>
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={start}
          className="mono rounded-full border border-border-strong px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-muted transition-colors hover:border-fg-default hover:text-fg-default"
        >
          {mode === "demo" ? "Play" : "Restart"}
        </button>
        {mode !== "demo" && (
          <span className="mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
            Space or tap to jump
          </span>
        )}
      </div>
    </div>
  );
}
