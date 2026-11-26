import postgres from "postgres";

/**
 * The portfolio's database (Neon Postgres, set up through Vercel's Storage tab, which adds DATABASE_URL).
 *
 * - pf_docs(kind, id, data): the editable content. kind "section" holds one portfolio section per row (id =
 *   "publications", "projects"…); kind "task" holds one Folionix work-plan item per row (id = "F-36a"…).
 * - pf_admin_*: the admin login (sessions, settings, history, one-time tokens, passkeys), kept apart so password
 *   hashes and tokens never travel with the content.
 * - pf_login_fails / pf_rate_hits: counters for lockouts and rate limits.
 *
 * Without DATABASE_URL (local development) the site shows the built-in content from src/lib/data.ts and
 * src/lib/folionix.ts, and the admin panel is read-only.
 */
export const dbEnabled = () => !!process.env.DATABASE_URL;

type Sql = ReturnType<typeof postgres>;
const g = globalThis as unknown as { __pfSql?: Sql; __pfSchema?: Promise<unknown> };

export function db(): Sql {
  if (!g.__pfSql) {
    const url = process.env.DATABASE_URL!;
    const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
    g.__pfSql = postgres(url, {
      ssl: local ? false : "require",
      max: 3,
      prepare: false, // required for Neon's pooled (pgbouncer) connection string
      idle_timeout: 20,
    });
  }
  return g.__pfSql;
}

/** Bump whenever a table, column or index in migrate() changes: the next server to start runs every step again. */
const SCHEMA_VERSION = 1;

async function schemaUpToDate(): Promise<boolean> {
  try {
    const [row] = await db()<{ v: number }[]>`select v from pf_schema`;
    return (row?.v ?? 0) >= SCHEMA_VERSION;
  } catch (e) {
    if ((e as { code?: string }).code === "42P01") return false; // no pf_schema table yet
    throw e;
  }
}

const migrate = () =>
  db().begin(async (sql) => {
    await sql`select pg_advisory_xact_lock(4711)`;
    await sql`
      create table if not exists pf_docs (
        kind text not null,
        id text not null,
        data jsonb not null,
        updated_at timestamptz not null default now(),
        primary key (kind, id)
      )`;
    await sql`
      create table if not exists pf_login_fails (
        id bigserial,
        ip text not null,
        scope text not null default 'admin',
        at timestamptz not null default now()
      )`;
    await sql`
      create table if not exists pf_admin_sessions (
        token_hash text primary key,
        id text not null unique,
        device text not null default '',
        ip text not null default '',
        ua text not null default '',
        how text not null default '',
        country text not null default '',
        created_at timestamptz not null default now(),
        last_seen timestamptz not null default now(),
        expires_at timestamptz not null
      )`;
    await sql`
      create table if not exists pf_admin_settings (
        k text primary key,
        v jsonb not null,
        updated_at timestamptz not null default now()
      )`;
    await sql`
      create table if not exists pf_admin_events (
        id bigserial primary key,
        at timestamptz not null default now(),
        kind text not null,
        ip text not null default '',
        device text not null default '',
        device_id text not null default '',
        detail text not null default ''
      )`;
    await sql`
      create table if not exists pf_admin_tokens (
        token_hash text primary key,
        kind text not null,
        data jsonb not null default '{}',
        created_at timestamptz not null default now(),
        expires_at timestamptz not null
      )`;
    await sql`
      create table if not exists pf_admin_passkeys (
        id text primary key,
        public_key bytea not null,
        counter bigint not null default 0,
        transports jsonb,
        name text not null default 'Passkey',
        created_at timestamptz not null default now(),
        last_used timestamptz
      )`;
    await sql`
      create table if not exists pf_rate_hits (
        id bigserial primary key,
        key text not null,
        at timestamptz not null default now()
      )`;
    await sql`create index if not exists pf_rate_hits_key_at on pf_rate_hits (key, at)`;
    await sql`create table if not exists pf_schema (v int not null)`;
    await sql`delete from pf_schema`;
    await sql`insert into pf_schema (v) values (${SCHEMA_VERSION})`;
  });

/** Makes sure the tables exist, once per server instance. */
export function ensureSchema() {
  g.__pfSchema ??= schemaUpToDate()
    .then((ok) => (ok ? undefined : migrate()))
    .catch((e) => {
      g.__pfSchema = undefined;
      throw e;
    });
  return g.__pfSchema;
}
