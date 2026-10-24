/**
 * Content for the Folionix case-study page (/projects/folionix). Kept apart
 * from data.ts because none of it is shared with the home page.
 */

export type MilestoneState = "done" | "in-progress" | "planned";

export const folionix = {
  title: "Folionix",
  subtitle: "Cloud-Native DevOps & Platform Engineering",
  tagline: "Research & thesis repository platform",
  origin:
    "Originally built as the BAUET Project & Thesis Archive (CSE-3110), re-engineered as a cloud-native platform.",
  pitch:
    "Folionix is a 5-service platform where students submit theses, supervisors review them and curators publish them to a searchable archive. The application is finished; the project now is everything around it: containers, CI/CD, GitOps on Kubernetes, Terraform-managed cloud, observability and documented failure drills.",
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
      text: "Dockerfiles, CI/CD, Terraform, Helm, ArgoCD, observability, policies, runbooks and postmortems, written and run by me.",
    },
  ],
};

export const milestones: {
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
    title: "Public demo on Kubernetes",
    state: "planned",
    items: [
      "k3s on Oracle Cloud ARM behind Cloudflare Tunnel",
      "Helm chart deployed by ArgoCD (GitOps)",
      "Nightly reset CronJob, public status page",
    ],
  },
  {
    when: "Step 4",
    title: "Terraform & AWS",
    state: "planned",
    items: [
      "All infrastructure as code: dev, demo and prod environments",
      "Cost guardrails, GitHub OIDC (no long-lived keys)",
      "Drift detection, secret rotation, database disaster recovery",
    ],
  },
  {
    when: "Step 5",
    title: "Reliability & scaling",
    state: "planned",
    items: [
      "Canary releases with automated rollback (Argo Rollouts)",
      "KEDA queue-based autoscaling, NetworkPolicies, SLO alerts",
      "Full cluster rebuild from zero in under 30 minutes",
    ],
  },
  {
    when: "Step 6",
    title: "Platform engineering",
    state: "planned",
    items: [
      "AWS → Azure failover, signed-image admission (Kyverno)",
      "Runtime security (Falco), cost reporting (OpenCost)",
      "Backstage golden-path template for new services",
    ],
  },
];

export const services = [
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

export const backing = ["PostgreSQL 17", "Redis 7.4", "S3 / R2 storage", "Mailpit"];

/** One submission's path through the system, used for the flow strip. */
export const requestFlow = [
  "Browser",
  "core-api",
  "Object storage",
  "worker",
  "ai-svc",
  "Curator approves",
  "search-svc",
];

export const pipelineStages = [
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

export const demoUrls = [
  { host: "demo.folionix.dev", what: "The live app, three one-click demo accounts" },
  { host: "status.folionix.dev", what: "Public uptime and status page" },
  { host: "grafana.folionix.dev", what: "Read-only dashboards: traffic, p95 latency, queues, SLOs" },
  { host: "demo.folionix.dev/api/docs", what: "Interactive OpenAPI documentation" },
];

export const demoRules = [
  "Fictional data only, reset every night",
  "One-click student, supervisor and curator accounts",
  "PDF uploads only, ≤ 5 MB, strict rate limits",
  "No real email is sent",
];

export const drills: { id: string; title: string }[] = [
  { id: "S-1", title: "Zero-downtime rolling deploy under k6 load" },
  { id: "S-2", title: "Expand/contract database migration across 3 releases" },
  { id: "S-3", title: "Terraform drift detection and state recovery" },
  { id: "S-5", title: "Secret leak drill: detect with gitleaks, rotate without downtime" },
  { id: "S-24", title: "Database + object-storage disaster recovery, measured RTO/RPO" },
  { id: "S-6", title: "Canary release with automated rollback on error rate" },
  { id: "S-7", title: "KEDA: 1,000 PDF uploads scale workers on queue depth" },
  { id: "S-10", title: "SLO burn-rate alert → trace → fix → postmortem" },
  { id: "S-12", title: "Poison message → dead-letter queue → replay" },
  { id: "S-15", title: "Delete the whole cluster, rebuild with Terraform + ArgoCD < 30 min" },
  { id: "S-16", title: "AWS → Azure failover with DNS health checks" },
  { id: "S-17", title: "Admit only signed images without critical CVEs (Kyverno)" },
];

export const stack = {
  "Containers & CI/CD": ["Docker", "GitHub Actions", "Trivy", "Syft", "cosign", "GHCR"],
  "Kubernetes & GitOps": ["k3s", "EKS", "AKS", "Helm", "ArgoCD", "Argo Rollouts", "KEDA"],
  "Infrastructure": ["Terraform", "AWS", "Azure", "Oracle Cloud", "Cloudflare"],
  "Observability": ["Prometheus", "Grafana", "Loki", "Tempo", "OpenTelemetry"],
  "Security & policy": ["Kyverno", "Checkov", "gitleaks", "External Secrets", "Falco"],
};
