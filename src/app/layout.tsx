import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, themeInitScript } from "@/components/theme-provider";
import { BootOverlay } from "@/components/boot-overlay";
import { NeuralField } from "@/components/neural-field";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ratul Hasan — Researcher & CS Undergraduate",
  description:
    "Portfolio of Ratul Hasan — CSE undergraduate researching LLM reliability and biology-informed deep learning, applying for graduate research programs.",
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
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: forceVisibleScript }} />
      </head>
      <body className="safe-bottom min-h-full flex flex-col bg-canvas text-fg-default">
        <ThemeProvider>
          <NeuralField />
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
