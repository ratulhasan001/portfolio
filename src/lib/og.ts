import { createHash } from "node:crypto";
import { profile } from "@/lib/data";

// Link-preview scrapers (LinkedIn, WhatsApp, ...) cache images by URL, so the
// URL carries a hash of the text drawn on the image: changing that text in
// data.ts gives the image a new URL and forces a fresh fetch.
// Shared because a page that sets its own openGraph replaces the layout's
// (Next merges metadata shallowly), so it must list the image again.
export const ogImage = {
  url: `/og?v=${createHash("sha256")
    .update([profile.name, profile.headline, profile.tagline, profile.website].join("\n"))
    .digest("hex")
    .slice(0, 12)}`,
  width: 1200,
  height: 630,
  alt: `${profile.name} · ${profile.headline}`,
};
