import overrides from "./content-overrides.json";

/**
 * Every section below has a built-in default. The admin panel (admin.ratulhasan.dev) saves edited sections in the
 * database; scripts/pull-content.mjs writes them into content-overrides.json before each build, and pick() prefers
 * them. Publishing from the admin panel starts a new build, so the site stays fully static.
 */
const saved = overrides as Record<string, unknown>;
function pick<T>(key: string, fallback: T): T {
  return key in saved ? (saved[key] as T) : fallback;
}

/**
 * Content for the Folionix case-study page (/projects/folionix). Kept apart
 * from data.ts because none of it is shared with the home page.
 */

export type MilestoneState = "done" | "in-progress" | "planned";

const defaultFolionix = {
  title: "Folionix",
  subtitle: "Cloud-Native DevOps & Platform Engineering",
  tagline: "Research & thesis repository platform",
  origin:
    "Originally built as the BAUET Project & Thesis Archive (CSE-3110), re-engineered as a cloud-native platform.",
  pitch:
    "Folionix is a 5-service platform where students submit theses, supervisors review them and curators publish them to a searchable archive. The application is finished; what I am working on now is everything around it, starting with containers and CI/CD.",
  journey:
    "I have just started my DevOps journey and I am in the learning phase. Folionix is where I practise what I learn, so I will work on it from time to time and tick off the steps below one by one.",
  ownership: [
    {
      repo: "folionix/app",
      label: "Application",
      text: "React, Django and FastAPI services built with AI assistance and reviewed by me. Frozen at v1.1.1.",
    },
    {
      repo: "folionix/platform",
      label: "Platform",
      text: "Dockerfiles, CI/CD and, step by step, the infrastructure around it, written by me as I learn.",
    },
  ],
};

const defaultMilestones: {
  when: string;
  title: string;
  state: MilestoneState;
  items: string[];
}[] = [
  {
    when: "Step 1",
    title: "Application built & frozen",
    state: "done",
    items: [
      "5 services, 18 fictional institutions, role-based moderation",
      "300+ automated tests, Playwright end-to-end smoke tests",
      "Tagged app-v1.1.1",
    ],
  },
  {
    when: "Step 2",
    title: "Containers & CI/CD",
    state: "in-progress",
    items: [
      "Multi-stage, non-root, multi-arch Dockerfiles + compose.yaml",
      "PR pipeline: lint, test, build, Trivy scan, Playwright",
      "Release pipeline: SBOM, cosign signing, push to GHCR, deploy PR",
    ],
  },
  {
    when: "Step 3",
    title: "Deploy to Kubernetes",
    state: "planned",
    items: ["Run it on a small Kubernetes cluster and open a public demo"],
  },
  {
    when: "Step 4",
    title: "Infrastructure as code",
    state: "planned",
    items: ["Manage the cloud setup with Terraform"],
  },
  {
    when: "Step 5",
    title: "Monitoring & reliability",
    state: "planned",
    items: ["Metrics, logs and alerts, then practise breaking and fixing it"],
  },
  {
    when: "Step 6",
    title: "Going further",
    state: "planned",
    items: ["Security, scaling and other advanced topics, chosen when I get there"],
  },
];

const defaultServices = [
  {
    name: "frontend",
    tech: "React · Vite · TypeScript",
    role: "Static SPA served by nginx / CDN",
  },
  {
    name: "core-api",
    tech: "Django 5.2 · DRF",
    role: "Auth, submissions, moderation, presigned uploads, live progress (SSE)",
  },
  {
    name: "worker",
    tech: "Celery 5",
    role: "PDF pipeline: validate, thumbnail, extract text, summarise",
  },
  {
    name: "search-svc",
    tech: "FastAPI · Meilisearch",
    role: "Indexes approved work only; stateful workload",
  },
  {
    name: "ai-svc",
    tech: "FastAPI · Ollama",
    role: "Summaries from a small local model; can scale to zero",
  },
];

const defaultBacking = ["PostgreSQL 17", "Redis 7.4", "S3 / R2 storage", "Mailpit"];

/** One submission's path through the system, used for the flow strip. */
const defaultRequestFlow = [
  "Browser",
  "core-api",
  "Object storage",
  "worker",
  "ai-svc",
  "Curator approves",
  "search-svc",
];

const defaultPipelineStages = [
  { name: "Lint & unit tests", detail: "ruff, eslint, pytest, vitest", gate: "pr" },
  { name: "Build images", detail: "multi-arch, multi-stage", gate: "pr" },
  { name: "Trivy scan", detail: "fail on critical CVEs", gate: "pr" },
  { name: "Playwright smoke", detail: "ephemeral environment", gate: "pr" },
  { name: "SBOM", detail: "Syft", gate: "release" },
  { name: "Sign", detail: "cosign keyless (OIDC)", gate: "release" },
  { name: "Push", detail: "ghcr.io/folionix/*", gate: "release" },
  { name: "Deploy PR", detail: "bump tag in folionix/platform", gate: "release" },
  { name: "ArgoCD sync", detail: "GitOps rollout to the cluster", gate: "release" },
] as const;

/** Tools split by whether I am using them yet; later ones render dashed. */
const defaultStack = [
  {
    group: "Learning now (Step 2)",
    later: false,
    tools: ["Docker", "GitHub Actions", "Trivy", "Syft", "cosign", "GHCR"],
  },
  {
    group: "Later steps",
    later: true,
    tools: ["Kubernetes", "Helm", "ArgoCD", "Terraform", "AWS", "Prometheus", "Grafana"],
  },
];

// ---- Published values: the admin panel's saved version of a section, or the default above ----

/** The built-in content, for the admin panel (it shows these until a section is first saved). */
export const folionixDefaults = {
  folionix: defaultFolionix,
  milestones: defaultMilestones,
  services: defaultServices,
  backing: defaultBacking,
  requestFlow: defaultRequestFlow,
  pipelineStages: defaultPipelineStages,
  stack: defaultStack,
};

export const folionix = pick("folionix", defaultFolionix);
export const milestones = pick("milestones", defaultMilestones);
export const services = pick("services", defaultServices);
export const backing = pick("backing", defaultBacking);
export const requestFlow = pick("requestFlow", defaultRequestFlow);
export const pipelineStages = pick("pipelineStages", defaultPipelineStages);
export const stack = pick("stack", defaultStack);
