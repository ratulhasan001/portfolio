import { education, experience, onlineJudges, profile, skills } from "@/lib/data";

const site = profile.website;
const current = experience.find((e) => e.current);

/**
 * schema.org description of the home page and the person behind it. Search
 * engines and AI tools use it to tell this Ratul Hasan apart from others with
 * the name: `sameAs` and the portrait tie the profiles to one identity.
 */
export const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${site}/#website`,
      url: site,
      name: profile.name,
      description: profile.tagline,
      inLanguage: "en",
      publisher: { "@id": `${site}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${site}/#profile`,
      url: site,
      name: profile.name,
      isPartOf: { "@id": `${site}/#website` },
      mainEntity: { "@id": `${site}/#person` },
      primaryImageOfPage: { "@id": `${site}/#portrait` },
    },
    {
      "@type": "Person",
      "@id": `${site}/#person`,
      name: profile.name,
      url: site,
      image: {
        "@type": "ImageObject",
        "@id": `${site}/#portrait`,
        url: `${site}${profile.photo}`,
        caption: `Portrait of ${profile.name}`,
      },
      description: profile.tagline,
      jobTitle: current?.role,
      worksFor: current && {
        "@type": "Organization",
        name: current.org,
        url: current.website,
      },
      homeLocation: { "@type": "Place", name: profile.location },
      alumniOf: education.map((e) => ({
        "@type": "EducationalOrganization",
        name: e.school,
      })),
      knowsAbout: skills["Research Interests"],
      sameAs: [
        profile.github,
        profile.linkedin,
        profile.orcid,
        profile.scholar,
        ...onlineJudges.map((j) => j.link),
      ],
    },
  ],
};
