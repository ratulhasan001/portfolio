import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cinzel } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { ThemeProvider, themeInitScript } from "@/components/theme-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
import { profile } from "@/lib/data";
import { ogImage } from "@/lib/og";

// Geist and Geist Mono: a matched pair, so the mono labels sit with the
// body text instead of reading as a second voice. Both are variable fonts.
const sans = Geist({
  variable: "--font-sans-family",
  subsets: ["latin"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-mono-family",
  subsets: ["latin"],
  display: "swap",
});

/** Trajan-style capitals, used only for the footer's house words. */
const display = Cinzel({
  variable: "--font-display-family",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const description = profile.tagline;

export const metadata: Metadata = {
  // Needed for link previews: without it the Open Graph image URL is resolved
  // against localhost, so scrapers cannot fetch it.
  metadataBase: new URL(profile.website),
  title: "Ratul Hasan",
  description,
  openGraph: {
    type: "website",
    url: profile.website,
    siteName: "Ratul Hasan",
    title: "Ratul Hasan",
    description,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ratul Hasan",
    description,
    images: [ogImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const forceVisibleScript = `
(function() {
  setTimeout(function() {
    document.documentElement.classList.add('force-visible');
  }, 2500);
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${display.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: forceVisibleScript }} />
      </head>
      <body className="safe-bottom min-h-full flex flex-col bg-canvas text-fg-default">
        <ThemeProvider>
          <SmoothScroll />
          <div
            aria-hidden
            className="bg-grid-fixed pointer-events-none fixed inset-0 -z-10 opacity-70 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_0%,transparent_75%)]"
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
