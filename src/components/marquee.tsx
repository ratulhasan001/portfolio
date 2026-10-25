"use client";

import { publications } from "@/lib/data";

const accepted = publications.filter(
  (p) => p.status === "published" || p.status === "accepted"
).length;

/** Kept short: three credentials, then three fields, a word or two each. */
const items = [
  `${accepted} Publications`,
  "Codeforces Expert",
  "ICPC Regionalist",
  "AI",
  "Cybersecurity",
  "Blockchain",
];

function Track({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <ul
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center gap-8 pr-8 sm:gap-10 sm:pr-10"
    >
      {items.map((item) => (
        <li
          key={item}
          className="flex shrink-0 items-center gap-8 whitespace-nowrap sm:gap-10"
        >
          <span className="mono text-[13px] font-medium uppercase tracking-[0.14em] text-fg-muted transition-colors duration-200 hover:text-fg-default sm:text-sm">
            {item}
          </span>
          <span
            aria-hidden
            className="h-1.5 w-1.5 shrink-0 rotate-45 bg-fg-subtle"
          />
        </li>
      ))}
    </ul>
  );
}

export function Marquee() {
  return (
    <div
      className="marquee relative flex w-full overflow-hidden border-y border-border-default bg-canvas-subtle py-3.5"
      style={{ ["--marquee-duration" as string]: `${items.length * 3.2}s` }}
    >
      <div className="marquee-track flex w-max shrink-0 items-center">
        <Track />
        {/* Second copy: purely visual, so it stays out of the a11y tree. */}
        <Track ariaHidden />
      </div>
    </div>
  );
}
