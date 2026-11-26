import type { MetadataRoute } from "next";
import { profile, projects } from "@/lib/data";

// URLs only: Google ignores changefreq and priority, and trusts lastmod only
// when it is accurate, which a build timestamp on every page would not be.
// Project pages come from `detailsHref`, so a new case study is listed as soon
// as its card links to it. The home entry names the portrait for image search.
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "/cv",
    ...projects.flatMap((p) => (p.detailsHref ? [p.detailsHref] : [])),
  ];
  return [
    { url: profile.website, images: [profile.photo.startsWith("http") ? profile.photo : `${profile.website}${profile.photo}`] },
    ...pages.map((path) => ({ url: `${profile.website}${path}` })),
  ];
}
