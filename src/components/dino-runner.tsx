"use client";

import { useEffect, useRef } from "react";

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
];

const CACTUS = [
  "..###..",
  "..###..",
  "..###..",
  "#.###..",
  "#.###.#",
  "#.###.#",
  "#####.#",
  "..###.#",
  "..#####",
  "..###..",
  "..###..",
  "..###..",
  "..###..",
  "..###..",
];

const CLOUD = [
  "..####....",
  ".######..#",
  "##########",
  ".########.",
];

type Sprite = readonly string[];

function spriteWidth(s: Sprite) {
  return s[0].length;
}

function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: Sprite,
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

type Obstacle = { x: number; scale: number };

/**
 * A decorative endless runner. It plays itself — there is no input handling,
 * the jumps are timed off the distance to the next cactus.
 */
export function DinoRunner({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    let cssW = 0;
    let cssH = 0;
    let px = 4;
    let groundY = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      cssW = rect.width;
      cssH = rect.height;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      px = cssW < 480 ? 3 : 4;
      groundY = cssH - px * 6;
    };
    resize();

    const dinoRows = DINO_FRAMES[0].length;
    const dinoCols = spriteWidth(DINO_FRAMES[0]);

    const SPEED = 190;
    const GRAVITY = 1500;
    const JUMP_V = -470;

    let dinoY = 0;
    let vy = 0;
    let airborne = false;
    let distance = 0;
    let obstacles: Obstacle[] = [];
    let clouds: { x: number; y: number }[] = [];
    let nextGap = 320;

    const seed = () => {
      obstacles = [{ x: cssW * 0.75, scale: 1 }];
      clouds = [
        { x: cssW * 0.3, y: 0.18 },
        { x: cssW * 0.8, y: 0.34 },
      ];
    };
    seed();

    let lastWidth = cssW;
    const ro = new ResizeObserver(() => {
      resize();
      if (Math.abs(cssW - lastWidth) > 1) {
        lastWidth = cssW;
        seed();
      }
    });
    ro.observe(canvas);

    const draw = () => {
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.fillStyle = ink;

      const dinoH = dinoRows * px;
      const dinoW = dinoCols * px;
      const dinoX = Math.max(24, cssW * 0.12);

      // Clouds, drifting slower than the ground for a little depth.
      ctx.globalAlpha = 0.28;
      for (const c of clouds) {
        drawSprite(ctx, CLOUD, c.x, cssH * c.y, px);
      }
      ctx.globalAlpha = 1;

      // Ground line plus scrolling grit.
      ctx.fillRect(0, groundY, cssW, Math.max(1, px / 2));
      ctx.globalAlpha = 0.5;
      for (let i = 0; i < 26; i++) {
        const gx = ((i * 137 - distance * 0.9) % (cssW + 140) + cssW + 140) % (cssW + 140) - 70;
        const gy = groundY + px * (1 + (i % 3));
        ctx.fillRect(gx, gy, px * (1 + (i % 2)), Math.max(1, px / 2));
      }
      ctx.globalAlpha = 1;

      for (const o of obstacles) {
        const s = px * o.scale;
        drawSprite(ctx, CACTUS, o.x, groundY - CACTUS.length * s, s);
      }

      // Legs only shuffle while the dino is on the ground.
      // Positive modulo: a negative frame index would land on undefined.
      const frame = airborne ? 0 : Math.abs(Math.floor(distance / 34)) % 2;
      drawSprite(ctx, DINO_FRAMES[frame], dinoX, groundY - dinoH + dinoY, px);

      return { dinoX, dinoW };
    };

    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.max(0, Math.min((now - last) / 1000, 1 / 30));
      last = now;

      distance += SPEED * dt;

      const dinoX = Math.max(24, cssW * 0.12);
      const dinoW = dinoCols * px;

      for (const o of obstacles) o.x -= SPEED * dt;
      for (const c of clouds) c.x -= SPEED * 0.25 * dt;

      obstacles = obstacles.filter((o) => o.x + spriteWidth(CACTUS) * px * o.scale > -40);
      clouds = clouds.filter((c) => c.x + spriteWidth(CLOUD) * px > -40);

      const lastObstacle = obstacles[obstacles.length - 1];
      if (!lastObstacle || cssW - lastObstacle.x > nextGap) {
        obstacles.push({ x: cssW + 40, scale: Math.random() < 0.3 ? 1.35 : 1 });
        nextGap = 260 + Math.random() * 220;
      }
      if (clouds.length < 2 && Math.random() < 0.01) {
        clouds.push({ x: cssW + 40, y: 0.12 + Math.random() * 0.3 });
      }

      // Jump when the next cactus is close enough that the arc clears it.
      const next = obstacles.find((o) => o.x + spriteWidth(CACTUS) * px * o.scale > dinoX);
      if (!airborne && next && next.x - (dinoX + dinoW * 0.6) < 82) {
        vy = JUMP_V;
        airborne = true;
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

      draw();
      raf = requestAnimationFrame(step);
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

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`w-full text-fg-default ${className ?? ""}`}
    />
  );
}
