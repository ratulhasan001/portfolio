"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, ExternalLink, FileText, Link2, Users } from "lucide-react";
import {
  publications,
  digitalLibraryLabels,
  profile,
  type Publication,
} from "@/lib/data";
import { SectionTitle, StatusPill } from "./ui";
import { StaggerGroup, staggerItem } from "./fade-in";
import { PopWords } from "./pop-in";
import { ParallaxLayer } from "./parallax-layer";
import { Disclosure } from "./disclosure";

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

function PublicationCard({ pub }: { pub: Publication }) {
  // The status pill already says submitted / accepted / published, so the
  // headline only needs the year out of the full date.
  const year = pub.date.match(/\d{4}/)?.[0] ?? pub.date;
  const library = pub.digitalLibrary
    ? digitalLibraryLabels[pub.digitalLibrary]
    : undefined;

  return (
    <motion.article
      variants={staggerItem}
      // Deliberately flat: a pure canvas panel inside a hard rule, so the
      // only things carrying weight are the title, the status dot and the
      // publisher mark.
      className="rounded-md border border-border-strong bg-canvas p-4 transition-colors duration-300 hover:border-fg-subtle"
    >
      <Disclosure
        title="Show publication details"
        summary={
          <div className="relative grid grid-cols-1 items-start gap-x-3 gap-y-2 sm:grid-cols-[auto_1fr_auto]">
            {/* Published work: the whole headline row opens the DOI. The
                chevron sits outside this row, so it stays clickable. */}
            {pub.link && (
              <a
                href={pub.link}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open "${pub.title}" at ${pub.link.replace("https://doi.org/", "doi ")}`}
                className="peer absolute inset-0 z-20 rounded-md"
              />
            )}
            <span className="mt-0.5 hidden h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-border-default text-fg-muted sm:col-start-1 sm:row-start-1 sm:flex">
              {pub.type === "journal" ? <FileText size={14} /> : <BookOpen size={14} />}
            </span>

            <h3 className="min-w-0 text-[15px] font-semibold leading-snug text-fg-default underline-offset-4 transition-colors peer-hover:underline sm:col-start-2 sm:row-start-1 sm:text-base">
              <PopWords text={pub.title} inView stagger={0.018} />
            </h3>

            <div className="sm:col-start-2 sm:row-start-2">
              <StatusPill status={pub.status} />
            </div>

            {/* Digital library and year, set as one typographic chip —
                under the title on phones, to its right once there is room. */}
            <div className="sm:col-start-3 sm:row-span-2 sm:row-start-1 sm:flex sm:justify-end">
              <span
                title={pub.digitalLibrary}
                className="mono inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded border border-border-default bg-canvas-subtle px-2 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-fg-muted"
              >
                {library ?? pub.venue}
                <span aria-hidden className="text-fg-subtle">
                  ·
                </span>
                <span className="text-fg-default">{year}</span>
              </span>
            </div>
          </div>
        }
      >
        <div className="space-y-3 border-t border-border-default pt-3">
          <div>
            <p className="mono mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
              <Users size={11} />
              Authors
            </p>
            <Byline authors={pub.authors} />
          </div>

          <div>
            <p className="mono mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
              Venue
            </p>
            <p className="text-sm italic text-fg-muted">{pub.venue}</p>
          </div>

          {(pub.status === "accepted" || pub.link) && (
            <div className="flex flex-wrap items-center gap-2">
              {pub.status === "accepted" && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-status-accepted/50 px-2.5 py-0.5 text-xs font-medium text-status-accepted">
                  <Clock size={11} />
                  To Be Published
                </span>
              )}
              {pub.link && (
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mono inline-flex items-center gap-1.5 rounded-full border border-status-published/40 px-2.5 py-0.5 text-[11px] font-semibold text-status-published transition-colors hover:border-status-published"
                >
                  <Link2 size={11} />
                  {pub.link.replace("https://doi.org/", "")}
                  <ExternalLink size={10} />
                </a>
              )}
            </div>
          )}
        </div>
      </Disclosure>
    </motion.article>
  );
}

function PublicationGroup({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: Publication[];
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="mono mb-3 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-fg-subtle">
        {icon}
        {title}
        <span className="text-fg-subtle/70">({items.length})</span>
      </h3>
      <StaggerGroup className="space-y-2.5">
        {items.map((pub) => (
          <PublicationCard key={pub.title} pub={pub} />
        ))}
      </StaggerGroup>
    </div>
  );
}

export function ResearchSection() {
  const journals = publications.filter((p) => p.type === "journal");
  const conferences = publications.filter((p) => p.type === "conference");

  return (
    <section id="research" className="relative mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9">
      <ParallaxLayer speed={35}>
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_10%,transparent_70%)]" />
      </ParallaxLayer>

      <SectionTitle index="01" title="Research & Publications" />

      <div className="space-y-6">
        <PublicationGroup
          title="Journal Publications"
          icon={<FileText size={13} />}
          items={journals}
        />
        <PublicationGroup
          title="Conference Publications"
          icon={<BookOpen size={13} />}
          items={conferences}
        />
      </div>
    </section>
  );
}
