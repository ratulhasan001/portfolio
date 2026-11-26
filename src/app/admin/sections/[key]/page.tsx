"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { ArrowLeft, Braces, RotateCcw, Save } from "lucide-react";
import { sectionByKey } from "@/lib/admin-sections";
import { adminApi, type PublishInfo } from "@/components/admin/api";
import { PublishBar } from "@/components/admin/PublishBar";
import { Button, Card, useToast } from "@/components/admin/kit";
import { ItemList, JsonField, MapEditor, ObjectFields, tidy, type Json } from "@/components/admin/ValueEditor";

interface SectionState {
  data: Json;
  saved: boolean;
  updatedAt: string | null;
}

export default function SectionEditor({ params }: { params: Promise<{ key: string }> }) {
  const { key } = use(params);
  const info = sectionByKey(key);
  const toast = useToast();
  const [state, setState] = useState<SectionState | null>(null);
  const [draft, setDraft] = useState<Json | null>(null);
  const [publish, setPublish] = useState<PublishInfo | null>(null);
  const [asJson, setAsJson] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  // bumped to rebuild the form after a save or reset (fresh field state)
  const [version, setVersion] = useState(0);

  useEffect(() => {
    adminApi<{ sections: Record<string, SectionState>; publish: PublishInfo }>("/api/admin/sections").then((b) => {
      const s = b.sections?.[key];
      if (s) {
        setState(s);
        setDraft(s.data);
        setPublish(b.publish);
      }
    });
  }, [key]);

  const dirty = state && draft !== null && JSON.stringify(draft) !== JSON.stringify(state.data);

  // leaving with unsaved edits asks first
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (!info) return <p>Unknown section.</p>;
  if (!state || draft === null) return <p className="text-fg-muted">Loading…</p>;

  const save = async () => {
    const data = tidy(draft);
    setBusy(true);
    const b = await adminApi<{ publish?: PublishInfo }>("/api/admin/sections", "PUT", { key, data });
    setBusy(false);
    if (!b.ok) return toast(b.message ?? "Couldn't save", "err");
    setState({ data, saved: true, updatedAt: new Date().toISOString() });
    setDraft(data);
    setVersion((v) => v + 1);
    if (b.publish) setPublish(b.publish);
    toast("Saved. Publish to put it on the site.");
  };

  const reset = async () => {
    setConfirmReset(false);
    setBusy(true);
    const b = await adminApi<{ publish?: PublishInfo }>("/api/admin/sections", "PUT", { key, reset: true });
    setBusy(false);
    if (!b.ok) return toast(b.message ?? "Couldn't reset", "err");
    const fresh = await adminApi<{ sections: Record<string, SectionState> }>("/api/admin/sections");
    const s = fresh.sections?.[key];
    if (s) {
      setState(s);
      setDraft(s.data);
      setVersion((v) => v + 1);
    }
    if (b.publish) setPublish(b.publish);
    toast("Back to the built-in version. Publish to put it on the site.");
  };

  return (
    <div className="pb-24">
      <Link href="/admin" className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-fg-muted hover:text-fg-default">
        <ArrowLeft className="size-4" /> Dashboard
      </Link>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{info.label}</h1>
          <p className="text-sm text-fg-muted">
            {info.hint} {state.saved ? "You have edited this section." : "This is the built-in version from the code."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => (setAsJson(!asJson), setVersion((v) => v + 1))}>
            <Braces className="size-4" /> {asJson ? "Form" : "JSON"}
          </Button>
          {state.saved &&
            (confirmReset ? (
              <Button size="sm" variant="danger" onClick={reset} loading={busy}>
                Really reset?
              </Button>
            ) : (
              <Button size="sm" variant="ghost" onClick={() => (setConfirmReset(true), setTimeout(() => setConfirmReset(false), 4000))}>
                <RotateCcw className="size-4" /> Built-in version
              </Button>
            ))}
        </div>
      </div>
      <PublishBar info={publish} onChange={setPublish} />

      <Card className="p-4" key={version}>
        {asJson ? (
          <JsonField value={draft} onChange={setDraft} />
        ) : Array.isArray(draft) ? (
          <ItemList items={draft} onChange={setDraft} itemTitle={info.itemTitle} />
        ) : info.map ? (
          <MapEditor obj={draft as Record<string, Json>} onChange={setDraft} />
        ) : (
          <ObjectFields obj={draft as Record<string, Json>} onChange={setDraft} />
        )}
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border-default bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-3 px-4 py-3">
          <span className="text-[13px] text-fg-muted">{dirty ? "Unsaved changes" : "All changes saved"}</span>
          <Button variant="secondary" disabled={!dirty || busy} onClick={() => (setDraft(state.data), setVersion((v) => v + 1))}>
            Undo changes
          </Button>
          <Button variant="primary" onClick={save} loading={busy} disabled={!dirty}>
            <Save className="size-4" /> Save
          </Button>
        </div>
      </div>
    </div>
  );
}
