import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { profile } from "@/lib/data";

const CV_FILE = "/Ratul_Hasan_CV.pdf";

export const metadata: Metadata = {
  title: "CV — Ratul Hasan",
  description: `Curriculum vitae of ${profile.name}.`,
};

export default function CvPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="safe-top sticky top-0 z-10 border-b border-border-default bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-2.5 text-fg-default"
          >
            <span className="mono flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-fg-default bg-fg-default text-[13px] font-bold leading-none tracking-tight text-canvas transition-colors duration-200 group-hover:bg-canvas group-hover:text-fg-default">
              RH
            </span>
            <span className="flex min-w-0 items-center gap-1.5 text-sm font-semibold tracking-tight">
              <ArrowLeft
                size={14}
                className="shrink-0 text-fg-subtle transition-transform duration-200 group-hover:-translate-x-0.5"
              />
              <span className="truncate">Back to portfolio</span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={CV_FILE}
              target="_blank"
              rel="noreferrer"
              className="mono hidden items-center gap-1.5 rounded-md border border-border-default px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-fg-muted transition-colors hover:border-fg-subtle hover:text-fg-default sm:inline-flex"
            >
              Open
              <ExternalLink size={12} />
            </a>
            <a
              href={CV_FILE}
              download
              className="mono inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-on-accent transition-opacity hover:opacity-85"
            >
              <Download size={12} />
              Download
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-5 sm:px-6 sm:py-7">
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-fg-default sm:text-3xl">
            Curriculum Vitae
          </h1>
          <p className="mono mt-1 text-[12px] uppercase tracking-[0.1em] text-fg-subtle">
            {profile.name} · {profile.location}
          </p>
        </div>

        {/* An iframe renders the PDF far more reliably than <object> across
            browsers; the link below covers viewers that block embedding
            (most mobile browsers) and doubles as a plain "open it" escape. */}
        <iframe
          src={`${CV_FILE}#view=FitH`}
          title={`Curriculum vitae of ${profile.name}`}
          className="h-[78dvh] min-h-[520px] w-full rounded-md border border-border-strong bg-canvas-subtle"
        />

        <p className="mt-3 text-[13px] text-fg-subtle">
          Not seeing the document?{" "}
          <a
            href={CV_FILE}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-fg-default underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            Open the PDF directly
          </a>
          .
        </p>
      </main>
    </div>
  );
}
