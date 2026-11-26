/**
 * The portfolio sections the admin panel can edit. Each key matches an export of src/lib/data.ts or
 * src/lib/folionix.ts (see pick() there). Shared by the admin pages and the server.
 */
export interface SectionInfo {
  key: string;
  label: string;
  page: "Home" | "Folionix";
  hint: string;
  /** The field that names an item in the list (for arrays of objects). */
  itemTitle?: string;
  /** An object whose keys are names you choose (skill groups, library labels), not fixed fields. */
  map?: boolean;
}

export const SECTIONS: SectionInfo[] = [
  { key: "profile", label: "Profile", page: "Home", hint: "Name, headline, tagline, contact links, photo and CV file." },
  { key: "publications", label: "Publications", page: "Home", hint: "Papers, preprints and work under review.", itemTitle: "title" },
  { key: "education", label: "Education", page: "Home", hint: "Degrees, theses and scores.", itemTitle: "degree" },
  { key: "experience", label: "Experience", page: "Home", hint: "Research, teaching and industry roles.", itemTitle: "org" },
  { key: "projects", label: "Projects", page: "Home", hint: "Project cards.", itemTitle: "name" },
  { key: "skills", label: "Skills", page: "Home", hint: "Skill groups: each group is a list of skills.", map: true },
  { key: "certifications", label: "Certifications", page: "Home", hint: "Online courses and credentials.", itemTitle: "title" },
  { key: "achievements", label: "Achievements", page: "Home", hint: "Contest results and awards.", itemTitle: "text" },
  { key: "leadership", label: "Leadership", page: "Home", hint: "Clubs, societies and roles.", itemTitle: "org" },
  { key: "onlineJudges", label: "Online judges", page: "Home", hint: "Competitive programming profiles.", itemTitle: "platform" },
  { key: "experienceGroups", label: "Experience groups", page: "Home", hint: "The sub-lists of the Experience section.", itemTitle: "label" },
  { key: "digitalLibraryLabels", label: "Digital library labels", page: "Home", hint: "Short labels shown on publication cards.", map: true },
  { key: "folionix", label: "Folionix: intro", page: "Folionix", hint: "Title, pitch, journey and repository ownership." },
  { key: "milestones", label: "Folionix: milestones", page: "Folionix", hint: "The big steps of the project.", itemTitle: "title" },
  { key: "services", label: "Folionix: services", page: "Folionix", hint: "The application's services.", itemTitle: "name" },
  { key: "backing", label: "Folionix: backing services", page: "Folionix", hint: "Databases, queues and storage." },
  { key: "requestFlow", label: "Folionix: request flow", page: "Folionix", hint: "One submission's path through the system." },
  { key: "pipelineStages", label: "Folionix: pipeline stages", page: "Folionix", hint: "The CI/CD pipeline animation.", itemTitle: "name" },
  { key: "stack", label: "Folionix: tool stack", page: "Folionix", hint: "Tools in use now and later.", itemTitle: "group" },
];

export const sectionByKey = (key: string) => SECTIONS.find((s) => s.key === key);

export type TaskStatus = "todo" | "doing" | "done" | "skipped";
export const TASK_STATUSES: { id: TaskStatus; label: string }[] = [
  { id: "todo", label: "To do" },
  { id: "doing", label: "In progress" },
  { id: "done", label: "Done" },
  { id: "skipped", label: "Skipped" },
];

/** The kinds of proof a task or drill can link to. */
export const EVIDENCE_KINDS = [
  { id: "writeup", label: "Write-up" },
  { id: "video", label: "Video" },
  { id: "recording", label: "Terminal recording" },
  { id: "dashboard", label: "Dashboard / graph" },
  { id: "screenshot", label: "Screenshot" },
  { id: "commit", label: "Commit / PR" },
  { id: "postmortem", label: "Postmortem" },
  { id: "loadtest", label: "Load-test result" },
  { id: "other", label: "Other" },
] as const;
export type EvidenceKind = (typeof EVIDENCE_KINDS)[number]["id"];

export interface EvidenceLink {
  kind: EvidenceKind;
  url: string;
  label?: string;
}

/** Proof of a finished task or drill, shown on the public Folionix page. */
export interface Evidence {
  /** Shown as a card under "Drill reports" (pick your 8–10 best). */
  showcase?: boolean;
  /** What broke (or what was built), how it was found and fixed: a short paragraph. */
  summary?: string;
  /** The headline numbers: "Rebuild time" → "24 min", "Failed requests" → "0". */
  metrics?: { label: string; value: string }[];
  links?: EvidenceLink[];
}

export interface TaskProgress {
  status: TaskStatus;
  note?: string;
  evidence?: Evidence;
  /** ISO time of the last change. */
  at: string;
}

export const EVIDENCE_LIMITS = { summary: 1200, metrics: 8, metricLabel: 60, metricValue: 40, links: 12, linkLabel: 80, url: 500 };

const isHttps = (u: string) => {
  try {
    return new URL(u).protocol === "https:";
  } catch {
    return false;
  }
};

/** Keeps only well-formed evidence (https links, sizes within limits); returns undefined when nothing is left. */
export function cleanEvidence(raw: unknown): Evidence | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const L = EVIDENCE_LIMITS;
  const kinds = new Set<string>(EVIDENCE_KINDS.map((k) => k.id));
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const metrics = (Array.isArray(r.metrics) ? r.metrics : [])
    .map((m) => ({ label: str((m as { label?: unknown })?.label, L.metricLabel), value: str((m as { value?: unknown })?.value, L.metricValue) }))
    .filter((m) => m.label && m.value)
    .slice(0, L.metrics);
  const links = (Array.isArray(r.links) ? r.links : [])
    .map((l) => {
      const o = (l ?? {}) as Record<string, unknown>;
      const kind = (kinds.has(o.kind as string) ? o.kind : "other") as EvidenceKind;
      const label = str(o.label, L.linkLabel);
      return { kind, url: str(o.url, L.url), ...(label ? { label } : {}) };
    })
    .filter((l) => isHttps(l.url))
    .slice(0, L.links);
  const summary = str(r.summary, L.summary);
  const showcase = r.showcase === true;
  const e: Evidence = { ...(showcase ? { showcase } : {}), ...(summary ? { summary } : {}), ...(metrics.length ? { metrics } : {}), ...(links.length ? { links } : {}) };
  return Object.keys(e).length ? e : undefined;
}
export type Progress = Record<string, TaskProgress>;
