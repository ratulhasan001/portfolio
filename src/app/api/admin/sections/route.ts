import { NextResponse } from "next/server";
import { adminAuthed } from "@/lib/server/auth";
import { logEvent } from "@/lib/server/adminEvents";
import { dbEnabled } from "@/lib/server/db";
import { loadSections, publishStatus, resetSection, saveSection, sectionProblem } from "@/lib/server/content";

export const dynamic = "force-dynamic";

/** Every editable section (saved or built-in) and whether there are saved changes not yet published. */
export async function GET() {
  if (!(await adminAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ sections: await loadSections(), publish: await publishStatus(), db: dbEnabled() });
}

/** { key, data } saves a section; { key, reset: true } goes back to the built-in default. */
export async function PUT(req: Request) {
  if (!(await adminAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!dbEnabled()) return NextResponse.json({ error: "nodb", message: "Saving needs the database (DATABASE_URL)." }, { status: 503 });
  const body = (await req.json().catch(() => null)) as { key?: unknown; data?: unknown; reset?: unknown } | null;
  const key = typeof body?.key === "string" ? body.key : "";
  if (body?.reset === true) {
    const problem = sectionProblem(key, []);
    if (problem === "Unknown section.") return NextResponse.json({ error: "bad", message: problem }, { status: 400 });
    await resetSection(key);
    await logEvent(req, "content-changed", `${key}: back to the built-in version`);
    return NextResponse.json({ ok: true, publish: await publishStatus() });
  }
  const problem = sectionProblem(key, body?.data);
  if (problem) return NextResponse.json({ error: "bad", message: problem }, { status: 400 });
  await saveSection(key, body!.data);
  await logEvent(req, "content-changed", key);
  return NextResponse.json({ ok: true, publish: await publishStatus() });
}
