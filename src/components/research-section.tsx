"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, Clock, ExternalLink, FileText, Link2, Users } from "lucide-react";
import { publications, digitalLibraryLogos, type Publication } from "@/lib/data";
import { SectionTitle, StatusPill } from "./ui";
import { StaggerGroup, staggerItem } from "./fade-in";
import { TiltCard } from "./tilt-card";
import { PopWords } from "./pop-in";
import { ParallaxLayer } from "./parallax-layer";
import { Disclosure } from "./disclosure";

function PublicationCard({ pub }: { pub: Publication }) {
  const mark = pub.logo
    ? { src: pub.logo }
    : pub.digitalLibrary
      ? digitalLibraryLogos[pub.digitalLibrary]
      : undefined;
  // The status pill already says submitted / accepted / published, so the
  // headline only needs the year out of the full date.
  const year = pub.date.match(/\d{4}/)?.[0] ?? pub.date;

  return (
    <TiltCard
      variants={staggerItem}
      className="shimmer rounded-md border border-border-default bg-canvas-subtle p-4 transition-colors hover:border-accent/50"
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
            <motion.span
              whileHover={{ rotate: -10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="mt-0.5 hidden h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border-default bg-canvas text-accent sm:col-start-1 sm:row-start-1 sm:flex"
            >
              {pub.type === "journal" ? <FileText size={16} /> : <BookOpen size={16} />}
            </motion.span>

            <h3 className="min-w-0 text-[15px] font-semibold leading-snug text-fg-default transition-colors peer-hover:text-accent sm:col-start-2 sm:row-start-1 sm:text-base">
              <PopWords text={pub.title} inView stagger={0.018} />
            </h3>

            <div className="sm:col-start-2 sm:row-start-2">
              <StatusPill status={pub.status} />
            </div>

            {/* Publisher and year: a row under the title on phones, a column
                to the right of it once there is room. */}
            <div className="flex items-center gap-3 sm:col-start-3 sm:row-span-2 sm:row-start-1 sm:flex-col sm:items-end sm:gap-1.5">
              {mark && (
                <span
                  title={pub.digitalLibrary}
                  className="relative flex h-7 w-24 items-center justify-start sm:h-9 sm:w-32 sm:justify-end"
                >
                  <Image
                    src={mark.src}
                    alt={pub.digitalLibrary ?? "Publisher"}
                    fill
                    sizes="(min-width: 640px) 128px, 96px"
                    className={`object-contain object-left sm:object-right ${
                      mark.whitenOnDark ? "dark:brightness-0 dark:invert" : ""
                    }`}
                  />
                </span>
              )}
              <span className="mono text-[13px] text-fg-subtle">{year}</span>
            </div>
          </div>
        }
      >
        <p className="flex items-start gap-1.5 text-sm text-fg-muted">
          <Users size={12} className="mt-0.5 shrink-0" />
          {pub.authors}
        </p>
        <p className="mt-2 text-sm italic text-fg-muted">{pub.venue}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {pub.status === "accepted" && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-done/40 bg-done-subtle px-2.5 py-0.5 text-xs font-medium text-done">
              <Clock size={11} />
              To Be Published
            </span>
          )}
          {pub.link && (
            <a
              href={pub.link}
              target="_blank"
              rel="noreferrer"
              className="mono inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-canvas px-2.5 py-0.5 text-[11px] font-semibold text-success transition-colors hover:border-success hover:bg-success-subtle"
            >
              <Link2 size={11} />
              {pub.link.replace("https://doi.org/", "")}
              <ExternalLink size={10} />
            </a>
          )}
        </div>
      </Disclosure>
    </TiltCard>
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
