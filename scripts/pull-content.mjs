// Before each build: copy the sections saved in the admin panel (pf_docs, kind "section") into
// src/lib/content-overrides.json, which src/lib/data.ts and src/lib/folionix.ts prefer over their built-in content.
// Without DATABASE_URL (local builds) the file is left as it is, so the built-in content is used.
import { writeFileSync } from "node:fs";
import postgres from "postgres";

const out = new URL("../src/lib/content-overrides.json", import.meta.url);
const url = process.env.DATABASE_URL;
if (!url) {
  console.log("pull-content: no DATABASE_URL, using the built-in content");
  process.exit(0);
}
const sql = postgres(url, { ssl: /@(localhost|127\.0\.0\.1)[:/]/.test(url) ? false : "require", max: 1, prepare: false });
try {
  const rows = await sql`select id, data from pf_docs where kind = 'section'`.catch((e) => {
    if (e.code === "42P01") return []; // the admin panel hasn't created its tables yet
    throw e;
  });
  const sections = Object.fromEntries(rows.map((r) => [r.id, r.data]));
  writeFileSync(out, JSON.stringify(sections, null, 2) + "\n");
  console.log(`pull-content: ${rows.length} saved section(s): ${Object.keys(sections).join(", ") || "none"}`);
} finally {
  await sql.end();
}
