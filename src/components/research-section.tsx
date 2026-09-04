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

  return (
    <TiltCard
      variants={staggerItem}
      className="shimmer rounded-md border border-border-default bg-canvas-subtle p-4 transition-colors hover:border-accent/50"
    >
      <Disclosure
        title="Show publication details"
        summary={
          <div className="flex items-start gap-3">
            <motion.span
              whileHover={{ rotate: -10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border-default bg-canvas text-accent"
            >
              {pub.type === "journal" ? <FileText size={16} /> : <BookOpen size={16} />}
            </motion.span>

            {/* Left: what the paper is */}
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-semibold leading-snug text-fg-default sm:text-base">
                <PopWords text={pub.title} inView stagger={0.018} />
              </h3>
              <div className="mt-1.5">
                <StatusPill status={pub.status} />
              </div>
            </div>

            {/* Right: where, then when */}
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              {mark && (
                <span
                  title={pub.digitalLibrary}
                  className="relative flex h-6 w-28 items-center justify-end"
                >
                  <Image
                    src={mark.src}
                    alt={pub.digitalLibrary ?? "Publisher"}
                    fill
                    sizes="112px"
                    className={`object-contain object-right ${
                      mark.whitenOnDark ? "dark:brightness-0 dark:invert" : ""
                    }`}
                  />
                </span>
              )}
              <span className="mono text-[13px] text-fg-subtle">{pub.date}</span>
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

      <SectionTitle
        index="01"
        title="Research & Publications"
        subtitle="Peer-reviewed research spanning artificial intelligence, healthcare AI, computer vision, blockchain security, and trustworthy intelligent systems."
      />

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
