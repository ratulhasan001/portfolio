"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, ExternalLink, FileText, Library, Users } from "lucide-react";
import { publications, type Publication } from "@/lib/data";
import { SectionTitle, StatusPill } from "./ui";
import { StaggerGroup, staggerItem } from "./fade-in";
import { TiltCard } from "./tilt-card";
import { PopIn, PopWords } from "./pop-in";

function PublicationCard({ pub }: { pub: Publication }) {
  return (
    <TiltCard
      variants={staggerItem}
      className="shimmer rounded-md border border-border-default bg-canvas-subtle p-5 transition-colors hover:border-accent/50 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <motion.span
            whileHover={{ rotate: -10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border-default bg-canvas text-accent"
          >
            {pub.type === "journal" ? (
              <FileText size={15} />
            ) : (
              <BookOpen size={15} />
            )}
          </motion.span>
          <div>
            <h3 className="text-base font-semibold text-fg-default sm:text-lg">
              {pub.link ? (
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[linear-gradient(var(--color-accent),var(--color-accent))] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size,color] duration-300 hover:bg-[length:100%_1px] hover:text-accent"
                >
                  <PopWords text={pub.title} inView stagger={0.018} />
                  <ExternalLink
                    size={13}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </a>
              ) : (
                <PopWords text={pub.title} inView stagger={0.018} />
              )}
            </h3>
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-fg-muted">
              <Users size={12} />
              {pub.authors}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill status={pub.status} />
          {pub.status === "accepted" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6, y: -4 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 420, damping: 15, delay: 0.15 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-done/40 bg-done-subtle px-2.5 py-0.5 text-xs font-medium text-done"
            >
              <Clock size={11} />
              To Be Published
            </motion.span>
          )}
          {pub.digitalLibrary && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6, y: -4 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 420, damping: 15, delay: 0.22 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border-default bg-canvas px-2.5 py-0.5 text-xs font-medium text-fg-muted"
            >
              <Library size={11} />
              {pub.digitalLibrary}
            </motion.span>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 pl-11 text-xs text-fg-muted">
        <span className="italic">{pub.venue}</span>
        <span className="h-1 w-1 rounded-full bg-fg-subtle" />
        <span className="mono text-accent/80">{pub.date}</span>
      </div>
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
      <div className="mb-4 flex items-center gap-2">
        <PopIn as="span" inView scale={0.5} className="flex text-accent">
          {icon}
        </PopIn>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-fg-muted">
          {title}
        </h3>
        <span className="mono rounded-full border border-border-default bg-canvas-subtle px-1.5 py-0.5 text-[11px] text-fg-subtle">
          {items.length}
        </span>
      </div>
      <StaggerGroup className="space-y-4">
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
    <section id="research" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <SectionTitle
        index="03"
        title="Research & Publications"
        subtitle="Peer-reviewed and in-progress work spanning LLM reliability, biology-informed deep learning, and applied blockchain systems."
      />

      <div className="space-y-10">
        <PublicationGroup
          title="Journal Publications"
          icon={<FileText size={15} />}
          items={journals}
        />
        <PublicationGroup
          title="Conference Publications"
          icon={<BookOpen size={15} />}
          items={conferences}
        />
      </div>
    </section>
  );
}
