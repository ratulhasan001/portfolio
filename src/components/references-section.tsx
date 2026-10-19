"use client";

import { Mail, UserCheck } from "lucide-react";
import { profile } from "@/lib/data";
import { SectionTitle } from "./ui";
import { FadeIn } from "./fade-in";

const requestHref = `mailto:${profile.email}?subject=${encodeURIComponent(
  "Reference request"
)}`;

export function ReferencesSection() {
  return (
    <section
      id="references"
      className="relative mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-9"
    >
      <SectionTitle index="06" title="References" />

      <FadeIn>
        <div className="overflow-hidden rounded-2xl border border-border-strong bg-canvas">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
            <span className="flex min-w-0 items-center gap-2 text-[15px] text-fg-muted">
              <UserCheck size={15} className="shrink-0" />
              Available upon request.
            </span>
            <a
              href={requestHref}
              className="mono inline-flex items-center gap-1 text-[12px] text-fg-default underline decoration-fg-subtle underline-offset-4 transition-colors hover:decoration-fg-default"
            >
              <Mail size={11} />
              Request references
            </a>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
