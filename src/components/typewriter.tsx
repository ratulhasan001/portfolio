"use client";

import { useEffect, useState } from "react";

const TYPE_MS = 55;
const DELETE_MS = 28;
const HOLD_MS = 1400;
const GAP_MS = 350;

export function Typewriter({
  words,
  className,
}: {
  words: string[];
  className?: string;
}) {
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(() => (reduced ? words[0] ?? "" : ""));
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">(
    "typing"
  );

  useEffect(() => {
    if (reduced) return;

    const word = words[index % words.length] ?? "";
    let timeout: number;

    if (phase === "typing") {
      if (text.length < word.length) {
        timeout = window.setTimeout(
          () => setText(word.slice(0, text.length + 1)),
          TYPE_MS
        );
      } else {
        timeout = window.setTimeout(() => setPhase("holding"), HOLD_MS);
      }
    } else if (phase === "holding") {
      timeout = window.setTimeout(() => setPhase("deleting"), 150);
    } else {
      if (text.length > 0) {
        timeout = window.setTimeout(
          () => setText(word.slice(0, text.length - 1)),
          DELETE_MS
        );
      } else {
        timeout = window.setTimeout(() => {
          setIndex((i) => (i + 1) % words.length);
          setPhase("typing");
        }, GAP_MS);
      }
    }

    return () => window.clearTimeout(timeout);
  }, [text, phase, index, words, reduced]);

  return (
    <span className={className}>
      {text}
      <span
        aria-hidden
        className="animate-caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] bg-current align-middle"
      />
    </span>
  );
}
