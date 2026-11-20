"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from "pdfjs-dist";

/** A link from the PDF, placed in percent of its page so it survives resizes. */
type PageLink = {
  href: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

type PageInfo = { width: number; height: number; links: PageLink[]; text: string };

type LinkAnnotation = {
  subtype?: string;
  url?: string;
  rect: number[];
};

let workerPort: Worker | null = null;

async function loadPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  if (!workerPort) {
    workerPort = new Worker(
      new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url),
      { type: "module" }
    );
    pdfjs.GlobalWorkerOptions.workerPort = workerPort;
  }
  return pdfjs;
}

const isSafeHref = (href: string) => /^(https?:|mailto:)/i.test(href);

/**
 * Draws every page of a PDF with PDF.js instead of the browser's own viewer:
 * in an iframe, iOS Safari and in-app browsers show only the first page and
 * Android Chrome shows nothing. The PDF's links stay clickable as anchors laid
 * over each page, and its text is kept for screen readers.
 */
export function CvViewer({ src, title }: { src: string; title: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvases = useRef<(HTMLCanvasElement | null)[]>([]);
  const docRef = useRef<PDFDocumentProxy | null>(null);
  const [pages, setPages] = useState<PageInfo[] | null>(null);
  const [failed, setFailed] = useState(false);

  // Load the document once and read each page's size, links and text.
  useEffect(() => {
    let cancelled = false;
    let loadingTask: PDFDocumentLoadingTask | undefined;
    (async () => {
      try {
        const pdfjs = await loadPdfjs();
        if (cancelled) return;
        loadingTask = pdfjs.getDocument({ url: src });
        const doc = await loadingTask.promise;
        if (cancelled) return;
        docRef.current = doc;

        const infos: PageInfo[] = [];
        for (let n = 1; n <= doc.numPages; n++) {
          const page = await doc.getPage(n);
          const viewport = page.getViewport({ scale: 1 });
          const annotations: LinkAnnotation[] = await page.getAnnotations({
            intent: "display",
          });
          const links = annotations
            .filter((a) => a.subtype === "Link" && a.url && isSafeHref(a.url))
            .map((a) => {
              const [x1, y1] = viewport.convertToViewportPoint(a.rect[0], a.rect[1]);
              const [x2, y2] = viewport.convertToViewportPoint(a.rect[2], a.rect[3]);
              return {
                href: a.url as string,
                left: (Math.min(x1, x2) / viewport.width) * 100,
                top: (Math.min(y1, y2) / viewport.height) * 100,
                width: (Math.abs(x2 - x1) / viewport.width) * 100,
                height: (Math.abs(y2 - y1) / viewport.height) * 100,
              };
            });
          const content = await page.getTextContent();
          const text = content.items
            .map((item) => ("str" in item ? item.str + (item.hasEOL ? "\n" : "") : ""))
            .join("");
          infos.push({ width: viewport.width, height: viewport.height, links, text });
        }
        if (!cancelled) setPages(infos);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
      void loadingTask?.destroy();
      docRef.current = null;
    };
  }, [src]);

  // Draw the pages at the box's width, sharp on high-density screens, and
  // again (debounced) whenever that width changes.
  useEffect(() => {
    const box = boxRef.current;
    const doc = docRef.current;
    if (!pages || !box || !doc) return;

    let generation = 0;
    let lastWidth = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let running: { cancel(): void; promise: Promise<void> }[] = [];

    const draw = async () => {
      const width = box.clientWidth;
      if (!width || width === lastWidth) return;
      lastWidth = width;
      const current = ++generation;

      // A canvas can't take a new render until the old one has stopped.
      const stale = running;
      running = [];
      stale.forEach((task) => task.cancel());
      await Promise.allSettled(stale.map((task) => task.promise));

      // At least 1600px wide so pinch-zoom on a phone stays readable; at most
      // 2400px to stay inside mobile Safari's canvas memory limits.
      const pixelWidth = Math.min(
        Math.max(width * (window.devicePixelRatio || 1), 1600),
        2400
      );
      for (let n = 1; n <= pages.length; n++) {
        if (current !== generation) return;
        const canvas = canvases.current[n - 1];
        if (!canvas) continue;
        const page = await doc.getPage(n);
        const viewport = page.getViewport({
          scale: pixelWidth / pages[n - 1].width,
        });
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const task = page.render({ canvas, viewport });
        running.push(task);
        await task.promise.catch(() => {});
      }
    };

    void draw();
    const observer = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => void draw(), 150);
    });
    observer.observe(box);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
      generation++;
      running.forEach((task) => task.cancel());
    };
  }, [pages]);

  if (failed) {
    return (
      <iframe
        src={`${src}#view=FitH`}
        title={title}
        className="h-[78dvh] min-h-[520px] w-full rounded-md border border-border-strong bg-canvas-subtle"
      />
    );
  }

  return (
    <div ref={boxRef} role="document" aria-label={title} className="flex flex-col gap-4">
      {pages ? (
        pages.map((page, i) => (
          <div
            key={i}
            className="relative w-full overflow-hidden rounded-md border border-border-strong bg-white shadow-sm"
            style={{ aspectRatio: `${page.width} / ${page.height}` }}
          >
            <canvas
              ref={(el) => {
                canvases.current[i] = el;
              }}
              aria-hidden="true"
              className="block h-full w-full"
            />
            {page.links.map((link, j) => (
              <a
                key={j}
                href={link.href}
                {...(link.href.startsWith("mailto:")
                  ? {}
                  : { target: "_blank", rel: "noreferrer" })}
                title={link.href}
                aria-label={link.href}
                className="absolute rounded-sm outline-offset-2 hover:bg-accent/10"
                style={{
                  left: `${link.left}%`,
                  top: `${link.top}%`,
                  width: `${link.width}%`,
                  height: `${link.height}%`,
                }}
              />
            ))}
            <p className="sr-only whitespace-pre-line">{page.text}</p>
          </div>
        ))
      ) : (
        <div
          aria-busy="true"
          className="aspect-[1/1.414] w-full animate-pulse rounded-md border border-border-strong bg-canvas-subtle"
        />
      )}
    </div>
  );
}
