import { revalidateTag, unstable_cache } from "next/cache";
import { dataDefaults } from "@/lib/data";
import { folionixDefaults } from "@/lib/folionix";
import { SECTIONS, cleanEvidence, sectionByKey, TASK_STATUSES, type Progress, type TaskStatus } from "@/lib/admin-sections";
import plan from "@/lib/folionix-plan.json";
import { db, dbEnabled, ensureSchema } from "./db";

const DEFAULTS: Record<string, unknown> = { ...dataDefaults, ...folionixDefaults };
const MAX_SECTION_BYTES = 400_000;

export interface SectionState {
  data: unknown;
  /** Saved in the admin panel (otherwise it is the built-in default). */
  saved: boolean;
  updatedAt: string | null;
}

/** Every editable section: the saved version from the database, or the built-in default. */
export async function loadSections(): Promise<Record<string, SectionState>> {
  const saved = new Map<string, { data: unknown; updated_at: Date }>();
  if (dbEnabled()) {
    await ensureSchema();
    const rows = await db()<{ id: string; data: unknown; updated_at: Date }[]>`select id, data, updated_at from pf_docs where kind = 'section'`;
    for (const r of rows) saved.set(r.id, r);
  }
  return Object.fromEntries(
    SECTIONS.map((s) => {
      const row = saved.get(s.key);
      return [s.key, { data: row ? row.data : DEFAULTS[s.key], saved: !!row, updatedAt: row ? row.updated_at.toISOString() : null }];
    }),
  );
}

/** Why this value can't be saved as the section, or null. Keeps the shape the page expects (list vs object). */
export function sectionProblem(key: string, data: unknown) {
  if (!sectionByKey(key)) return "Unknown section.";
  const def = DEFAULTS[key];
  if (Array.isArray(def) !== Array.isArray(data)) return Array.isArray(def) ? "This section must be a list." : "This section must be an object, not a list.";
  if (data === null || typeof data !== "object") return "This section must be a list or an object.";
  if (JSON.stringify(data).length > MAX_SECTION_BYTES) return "That's too much for one section.";
  return null;
}

export async function saveSection(key: string, data: unknown) {
  await ensureSchema();
  await db()`
    insert into pf_docs (kind, id, data, updated_at) values ('section', ${key}, ${db().json(data as never)}, now())
    on conflict (kind, id) do update set data = excluded.data, updated_at = now()`;
  await markUnpublished();
}

/** Forgets the saved version: the next build shows the built-in default again. */
export async function resetSection(key: string) {
  await ensureSchema();
  await db()`delete from pf_docs where kind = 'section' and id = ${key}`;
  await markUnpublished();
}

// ---------- publishing (a new Vercel build picks up the saved sections) ----------

interface PublishState {
  changedAt: string | null;
  publishedAt: string | null;
}

async function readPublish(): Promise<PublishState> {
  await ensureSchema();
  const [row] = await db()<{ data: PublishState }[]>`select data from pf_docs where kind = 'meta' and id = 'publish'`;
  return row?.data ?? { changedAt: null, publishedAt: null };
}

async function writePublish(p: PublishState) {
  await db()`
    insert into pf_docs (kind, id, data, updated_at) values ('meta', 'publish', ${db().json(p as never)}, now())
    on conflict (kind, id) do update set data = excluded.data, updated_at = now()`;
}

async function markUnpublished() {
  await writePublish({ ...(await readPublish()), changedAt: new Date().toISOString() });
}

export const publishReady = () => !!process.env.VERCEL_DEPLOY_HOOK_URL;

export async function publishStatus() {
  if (!dbEnabled()) return { ready: publishReady(), pending: false, changedAt: null, publishedAt: null };
  const p = await readPublish();
  const pending = !!p.changedAt && (!p.publishedAt || p.changedAt > p.publishedAt);
  return { ready: publishReady(), pending, ...p };
}

/** Starts a new production build through the Vercel deploy hook. */
export async function publish(): Promise<boolean> {
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hook || !/^https:\/\/api\.vercel\.com\//.test(hook)) return false;
  const ok = await fetch(hook, { method: "POST", signal: AbortSignal.timeout(10_000) })
    .then((r) => r.ok)
    .catch(() => false);
  if (ok) await writePublish({ ...(await readPublish()), publishedAt: new Date().toISOString() });
  return ok;
}

// ---------- the Folionix work plan (live: no build needed) ----------

export const PROGRESS_TAG = "folionix-progress";
const STATUSES = new Set(TASK_STATUSES.map((s) => s.id));
const TASK_IDS = new Set(plan.tasks.map((t) => t.id));

async function readProgress(): Promise<Progress> {
  if (!dbEnabled()) return {};
  await ensureSchema();
  const [row] = await db()<{ data: Progress }[]>`select data from pf_docs where kind = 'progress' and id = 'folionix'`;
  return row?.data ?? {};
}

/** The progress for the public page, cached until the admin changes it (and hourly as a backstop). */
const cachedProgress = unstable_cache(readProgress, ["folionix-progress-v1"], { tags: [PROGRESS_TAG], revalidate: 3600 });

export async function publicProgress(): Promise<Progress> {
  try {
    return dbEnabled() ? await cachedProgress() : {};
  } catch (e) {
    console.error("folionix progress failed", e);
    return {};
  }
}

export const adminProgress = readProgress;

/**
 * Sets the status (and optionally the note and the evidence) of some tasks at once. `evidence: null` removes it;
 * leaving it out keeps what is there. Returns the ids that weren't valid.
 */
export async function updateProgress(changes: { id: string; status: TaskStatus; note?: string; evidence?: unknown }[]) {
  const bad = changes.filter((c) => !TASK_IDS.has(c.id) || !STATUSES.has(c.status)).map((c) => c.id);
  const good = changes.filter((c) => !bad.includes(c.id));
  if (!good.length) return bad;
  await ensureSchema();
  await db().begin(async (sql) => {
    const [row] = await sql<{ data: Progress }[]>`select data from pf_docs where kind = 'progress' and id = 'folionix' for update`;
    const next: Progress = { ...(row?.data ?? {}) };
    const at = new Date().toISOString();
    for (const c of good) {
      const note = (c.note ?? next[c.id]?.note ?? "").slice(0, 500);
      const evidence = c.evidence === undefined ? next[c.id]?.evidence : c.evidence === null ? undefined : cleanEvidence(c.evidence);
      if (c.status === "todo" && !note && !evidence) delete next[c.id];
      else next[c.id] = { status: c.status, ...(note ? { note } : {}), ...(evidence ? { evidence } : {}), at };
    }
    await sql`
      insert into pf_docs (kind, id, data, updated_at) values ('progress', 'folionix', ${sql.json(next as never)}, now())
      on conflict (kind, id) do update set data = excluded.data, updated_at = now()`;
  });
  revalidateTag(PROGRESS_TAG, { expire: 0 });
  return bad;
}
