import {
  education,
  experience,
  onlineJudges,
  profile,
  projects,
  publications,
  skills,
} from "@/lib/data";

export const dynamic = "force-static";

const site = profile.website;

const link = (text: string, href?: string) =>
  href ? `[${text}](${href.startsWith("/") ? site + href : href})` : text;

// /llms.txt (llmstxt.org): a plain-Markdown summary for LLMs and AI search
// tools, built from the same data as the page so the two never disagree.
export function GET() {
  const lines = [
    `# ${profile.name}`,
    "",
    `> ${profile.tagline}.`,
    "",
    `${profile.headline} based in ${profile.location}. Research interests: ${skills["Research Interests"].join(", ")}.`,
    "",
    "## Profiles",
    `- ${link("Portfolio", site)}`,
    `- ${link("CV (PDF)", profile.cvFile || "/Ratul_Hasan_CV.pdf")}`,
    `- ${link("GitHub", profile.github)}`,
    `- ${link("LinkedIn", profile.linkedin)}`,
    `- ${link("ORCID", profile.orcid)}`,
    `- ${link("Google Scholar", profile.scholar)}`,
    ...onlineJudges.map((j) => `- ${link(j.platform, j.link)}: ${j.stat}`),
    "",
    "## Experience",
    ...experience.flatMap((e) => {
      const roles: { role: string; period: string }[] = e.positions ?? [e];
      return roles.map((r) => `- ${r.role}, ${e.org} (${r.period})`);
    }),
    "",
    "## Education",
    ...education.map((e) => {
      const score = e.score
        ? `, ${e.score.label} ${e.score.value.toFixed(2)}/${e.score.scale.toFixed(2)}`
        : "";
      return `- ${e.degree}, ${e.school} (${e.period}${score})`;
    }),
    "",
    "## Publications",
    ...publications.map((p) => {
      // Skip the status when the venue or date already says it ("Presented 2026").
      const status = p.status.replace(/-/g, " ");
      const said = `${p.venue} ${p.date}`.toLowerCase().includes(status);
      return `- ${link(p.title, p.link)}. ${p.authors.join(", ")}. ${p.venue}, ${p.date}${said ? "" : ` (${status})`}.`;
    }),
    "",
    "## Projects",
    ...projects.map(
      (p) => `- ${link(p.name, p.detailsHref ?? p.link)}: ${p.description}`
    ),
  ];

  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
