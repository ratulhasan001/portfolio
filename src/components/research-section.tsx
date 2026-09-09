"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ChevronDown, ExternalLink, FileText } from "lucide-react";
import {
  publications,
  digitalLibraryLabels,
  profile,
  type Publication,
} from "@/lib/data";
import { SectionTitle } from "./ui";
import { FadeIn } from "./fade-in";
import { WipeWords } from "./wipe-in";
import { ParallaxLayer } from "./parallax-layer";

const statusMeta = {
  published: { label: "Published", dot: "bg-status-published" },
  accepted: { label: "Accepted", dot: "bg-status-accepted" },
  "under-review": { label: "Under Review", dot: "bg-status-review" },
} as const;

/** Full byline, with Ratul's own name carrying the emphasis. */
function Byline({ authors }: { authors: string[] }) {
  return (
    <p className="text-sm leading-relaxed text-fg-muted">
      {authors.map((author, i) => (
        <span key={author}>
          <span
            className={
              author === profile.name
                ? "font-semibold text-fg-default underline decoration-fg-subtle underline-offset-2"
                : undefined
            }
          >
            {author}
          </span>
          {i < authors.length - 1 && ", "}
        </span>
      ))}
    </p>
  );
}

/** Inline separator. Hidden on phones, where the meta row wraps onto
 *  several lines and the dots would be left dangling at the line ends. */
function Dot() {
  return (
    <span aria-hidden className="hidden text-fg-subtle sm:inline">
      ·
    </span>
  );
}

function PublicationRow({ pub }: { pub: Publication }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const status = statusMeta[pub.status];
  const library = pub.digitalLibrary
    ? digitalLibraryLabels[pub.digitalLibrary]
    : undefined;

  return (
    <li className="px-4 py-4 sm:px-5 sm:py-5">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1.5">
        <h3 className="min-w-0 flex-1 text-[17px] font-semibold leading-snug tracking-tight text-fg-default sm:text-xl">
          <WipeWords text={pub.title} inView stagger={0.018} />
        </h3>
        <span className="mono mt-0.5 flex shrink-0 items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-fg-muted sm:text-[11px]">
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-2">
        <span className="mono rounded-full border border-border-default px-3 py-1 text-[10px] uppercase tracking-[0.1em] text-fg-muted sm:text-[11px]">
          {pub.date}
        </span>

        {library && (
          <>
            <Dot />
            <span className="mono text-[10px] uppercase tracking-[0.1em] text-fg-subtle sm:text-[11px]">
              {library}
            </span>
          </>
        )}

        {pub.link && (
          <>
            <Dot />
            <a
              href={pub.link}
              target="_blank"
              rel="noreferrer"
              className="mono inline-flex items-center gap-1 text-[12px] text-fg-default underline decoration-fg-subtle underline-offset-4 transition-colors hover:decoration-fg-default"
            >
              {pub.link.replace("https://doi.org/", "doi ")}
              <ExternalLink size={11} />
            </a>
          </>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Hide details" : "Show details"}
          title={open ? "Hide details" : "Show details"}
          className={`ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
            open
              ? "border-fg-default bg-fg-default text-canvas"
              : "border-border-default text-fg-muted hover:border-fg-subtle hover:text-fg-default"
          }`}
        >
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex"
          >
            <ChevronDown size={14} />
          </motion.span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3 border-t border-border-default pt-3">
              <div>
                <p className="mono mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                  Authors
                </p>
                <Byline authors={pub.authors} />
              </div>
              <div>
                <p className="mono mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                  Venue
                </p>
                <p className="text-sm italic leading-relaxed text-fg-muted">
                  {pub.venue}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/** One panel per publication type: a header rail naming the group, then every
 *  paper in it stacked underneath and separated by rules. */
function PublicationGroup({
  label,
  icon,
  items,
}: {
  label: string;
  icon: React.ReactNode;
  items: Publication[];
}) {
  if (items.length === 0) return null;
  return (
    <FadeIn>
      <div className="overflow-hidden rounded-2xl border border-border-strong bg-canvas">
        <div className="flex items-center justify-between gap-3 border-b border-border-default px-4 py-2.5 sm:px-5">
          <span className="mono flex min-w-0 items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-fg-muted sm:text-[11px]">
            {icon}
            <span className="truncate">{label}</span>
          </span>
          <span className="mono shrink-0 text-[10px] uppercase tracking-[0.16em] text-fg-subtle sm:text-[11px]">
            {items.length} {items.length === 1 ? "Paper" : "Papers"}
          </span>
        </div>

        <ul className="divide-y divide-border-default">
          {items.map((pub) => (
            <PublicationRow key={pub.title} pub={pub} />
          ))}
        </ul>
      </div>
    </FadeIn>
  );
}

export function ResearchSection() {
  const conferences = publications.filter((p) => p.type === "conference");
  const journals = publications.filter((p) => p.type === "journal");

  return (
    <section id="research" className="relative mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-9">
      <ParallaxLayer speed={35}>
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_10%,transparent_70%)]" />
      </ParallaxLayer>

      <SectionTitle index="01" title="Research & Publications" />

      <div className="space-y-4">
        <PublicationGroup
          label="Conference Papers"
          icon={<BookOpen size={13} className="shrink-0" />}
          items={conferences}
        />
        <PublicationGroup
          label="Journal Papers"
          icon={<FileText size={13} className="shrink-0" />}
          items={journals}
        />
      </div>
    </section>
  );
}
