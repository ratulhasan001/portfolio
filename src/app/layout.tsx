import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, themeInitScript } from "@/components/theme-provider";
import { BootOverlay } from "@/components/boot-overlay";
import { profile } from "@/lib/data";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans-family",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-family",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const description =
  "Computer Science graduate working on Artificial Intelligence and Security";

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
    title: "Ratul Hasan — AI & Security Research",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Ratul Hasan — AI & Security Research",
    description,
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
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: forceVisibleScript }} />
      </head>
      <body className="safe-bottom min-h-full flex flex-col bg-canvas text-fg-default">
        <ThemeProvider>
          <div
            aria-hidden
            className="bg-grid-fixed pointer-events-none fixed inset-0 -z-10 opacity-70 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_0%,transparent_75%)]"
          />
          <BootOverlay />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
