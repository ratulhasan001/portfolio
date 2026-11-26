"use client";

import { useId, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, Plus, Trash2, Upload } from "lucide-react";
import { adminApi } from "./api";
import { Switch, cx, useToast } from "./kit";

/**
 * A form for any section, built from the shape of its data: text, numbers, switches, lists of lines, lists of items
 * (each a card that can be added, removed and moved) and nested objects. New items start from the fields the other
 * items have, so optional fields (a certificate, a link) can be filled in too.
 */
export type Json = string | number | boolean | null | Json[] | { [k: string]: Json };
type Obj = { [k: string]: Json };

const isObj = (v: unknown): v is Obj => !!v && typeof v === "object" && !Array.isArray(v);
const humanize = (k: string) => k.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());

/** An empty value of the same shape. */
export function blankLike(v: Json | undefined): Json {
  if (typeof v === "string") return "";
  if (typeof v === "number") return 0;
  if (typeof v === "boolean") return false;
  if (Array.isArray(v)) return [];
  if (isObj(v)) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, blankLike(x)]));
  return "";
}

/** Every field any of the items has, with a sample value for each (the first non-empty one). */
function unionSample(items: Json[]): Obj {
  const out: Obj = {};
  for (const it of items) {
    if (!isObj(it)) continue;
    for (const [k, v] of Object.entries(it)) {
      const cur = out[k];
      const empty = cur === undefined || cur === "" || (Array.isArray(cur) && cur.length === 0);
      if (empty) out[k] = v;
      else if (Array.isArray(cur) && Array.isArray(v) && cur.length === 0) out[k] = v;
    }
  }
  return out;
}

/** Fields every item has: the page may rely on them, so they are never dropped when empty. */
function requiredKeys(items: Json[]): Set<string> {
  const objs = items.filter(isObj);
  if (!objs.length) return new Set();
  return new Set(Object.keys(objs[0]!).filter((k) => objs.every((o) => k in o)));
}

/** Drops empty optional fields ("" or false or []) so the page treats them as not set. */
export function tidy(v: Json, required?: Set<string>): Json {
  if (Array.isArray(v)) {
    const req = requiredKeys(v);
    return v.map((x) => tidy(x, req));
  }
  if (isObj(v)) {
    const out: Obj = {};
    for (const [k, x] of Object.entries(v)) {
      const t = tidy(x);
      const empty = t === "" || t === false || (Array.isArray(t) && t.length === 0);
      if (empty && required && !required.has(k)) continue;
      out[k] = t;
    }
    return out;
  }
  return v;
}

const LONG = /abstract|description|pitch|journey|tagline|detail|origin|text|role$/i;
const FILE = /logo|photo|certificate|image|file|avatar/i;

export function FileButton({ onDone }: { onDone: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="application/pdf,image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (!f) return;
          setBusy(true);
          const form = new FormData();
          form.append("file", f);
          const b = await adminApi<{ url?: string }>("/api/admin/upload", "POST", form);
          setBusy(false);
          if (b.url) {
            onDone(b.url);
            toast("Uploaded");
          } else toast(b.message ?? "Upload failed", "err");
        }}
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={busy}
        className="flex shrink-0 items-center gap-1 rounded-lg border border-border-default px-2.5 text-[12px] font-semibold text-fg-muted hover:text-fg-default disabled:opacity-50"
      >
        <Upload className="size-3.5" /> {busy ? "Uploading…" : "Upload"}
      </button>
    </>
  );
}

const inputCls = "w-full rounded-lg border border-border-default bg-canvas px-3 py-2 text-[14px] text-fg-default outline-none focus:border-fg-default";

function StringField({ name, value, onChange, options }: { name: string; value: string; onChange: (v: string) => void; options?: string[] }) {
  const list = useId();
  const long = LONG.test(name) || value.length > 90 || value.includes("\n");
  return (
    <div className="flex gap-2">
      {long ? (
        <textarea className={cx(inputCls, "min-h-[84px]")} rows={Math.min(10, Math.max(3, Math.ceil(value.length / 90)))} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <>
          <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} list={options?.length ? list : undefined} />
          {options?.length ? (
            <datalist id={list}>
              {options.map((o) => (
                <option key={o} value={o} />
              ))}
            </datalist>
          ) : null}
        </>
      )}
      {FILE.test(name) && <FileButton onDone={onChange} />}
    </div>
  );
}

function Lines({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [text, setText] = useState(value.join("\n"));
  return (
    <div>
      <textarea
        className={cx(inputCls, "min-h-[84px]")}
        rows={Math.min(12, Math.max(3, value.length + 1))}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean));
        }}
      />
      <p className="mt-1 text-[11.5px] text-fg-subtle">One per line.</p>
    </div>
  );
}

function JsonField({ value, onChange }: { value: Json; onChange: (v: Json) => void }) {
  const [text, setText] = useState(JSON.stringify(value, null, 2));
  const [bad, setBad] = useState(false);
  return (
    <div>
      <textarea
        className={cx(inputCls, "min-h-[120px] font-mono text-[12.5px]", bad && "border-red-500")}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          try {
            onChange(JSON.parse(e.target.value) as Json);
            setBad(false);
          } catch {
            setBad(true);
          }
        }}
      />
      {bad && <p className="mt-1 text-[12px] text-red-600">Not valid JSON yet - it isn&apos;t applied until it is.</p>}
    </div>
  );
}

/** One field: picks the right control for the value's type. `siblings` are the same field's values in sibling items. */
function FieldValue({ name, value, sample, onChange, siblings }: { name: string; value: Json; sample?: Json; onChange: (v: Json) => void; siblings?: string[] }) {
  const shape = value === "" || value === undefined || (Array.isArray(value) && value.length === 0) ? (sample ?? value) : value;
  if (typeof shape === "boolean") return <Switch checked={!!value} onChange={onChange} label={humanize(name)} />;
  if (typeof shape === "number") return <input type="number" step="any" className={cx(inputCls, "max-w-[160px]")} value={typeof value === "number" ? value : 0} onChange={(e) => onChange(Number(e.target.value))} />;
  if (Array.isArray(shape)) {
    const arr = Array.isArray(value) ? value : [];
    const sampleArr = shape as Json[];
    if (sampleArr.every((x) => typeof x === "string")) return <Lines value={arr as string[]} onChange={onChange} />;
    if (sampleArr.every(isObj)) return <ItemList items={arr} sampleItems={sampleArr} onChange={onChange} />;
    return <JsonField value={arr} onChange={onChange} />;
  }
  if (isObj(shape)) return <ObjectFields obj={isObj(value) ? value : (blankLike(shape) as Obj)} sample={shape} onChange={onChange} />;
  return <StringField name={name} value={typeof value === "string" ? value : value == null ? "" : String(value)} onChange={onChange} options={siblings} />;
}

export function ObjectFields({ obj, sample, onChange, siblingsOf }: { obj: Obj; sample?: Obj; onChange: (v: Obj) => void; siblingsOf?: (k: string) => string[] }) {
  const keys = [...new Set([...Object.keys(sample ?? {}), ...Object.keys(obj)])];
  return (
    <div className="grid gap-3">
      {keys.map((k) => (
        <div key={k} className="grid gap-1">
          <span className="text-[12px] font-semibold text-fg-muted">{humanize(k)}</span>
          <FieldValue name={k} value={obj[k] ?? blankLike(sample?.[k])} sample={sample?.[k]} siblings={siblingsOf?.(k)} onChange={(v) => onChange({ ...obj, [k]: v })} />
        </div>
      ))}
    </div>
  );
}

const titleOf = (it: Json, key?: string) => {
  if (!isObj(it)) return String(it);
  const v = (key && it[key]) || Object.values(it).find((x) => typeof x === "string" && x);
  return typeof v === "string" && v ? v : "(untitled)";
};

/** A list of items, each a card that opens to its fields. */
export function ItemList({ items, sampleItems, onChange, itemTitle }: { items: Json[]; sampleItems?: Json[]; onChange: (v: Json[]) => void; itemTitle?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const sample = unionSample([...(sampleItems ?? []), ...items]);
  // the values each short text field has across the items: suggestions for fields like "status" or "type"
  const siblingsOf = (k: string) => [...new Set(items.map((it) => (isObj(it) && typeof it[k] === "string" ? (it[k] as string) : "")).filter((s) => s && s.length < 40))];
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange(next);
    setOpen(open === i ? j : open);
  };
  const add = (top: boolean) => {
    const blank = blankLike(sample);
    onChange(top ? [blank, ...items] : [...items, blank]);
    setOpen(top ? 0 : items.length);
  };
  return (
    <div className="grid gap-2">
      <button type="button" onClick={() => add(true)} className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-border-strong py-2 text-[13px] font-semibold text-fg-muted hover:text-fg-default">
        <Plus className="size-4" /> Add at the top
      </button>
      {items.map((it, i) => (
        <div key={i} className="rounded-xl border border-border-default bg-canvas">
          <div className="flex items-center gap-1 px-3 py-2">
            <button type="button" onClick={() => setOpen(open === i ? null : i)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
              <ChevronDown className={cx("size-4 shrink-0 transition", open === i ? "" : "-rotate-90")} />
              <span className="truncate text-[14px] font-semibold">{titleOf(it, itemTitle)}</span>
            </button>
            <button type="button" aria-label="Move up" onClick={() => move(i, -1)} className="rounded p-1 text-fg-muted hover:bg-canvas-subtle hover:text-fg-default">
              <ArrowUp className="size-4" />
            </button>
            <button type="button" aria-label="Move down" onClick={() => move(i, 1)} className="rounded p-1 text-fg-muted hover:bg-canvas-subtle hover:text-fg-default">
              <ArrowDown className="size-4" />
            </button>
            <RemoveButton onRemove={() => onChange(items.filter((_, j) => j !== i))} />
          </div>
          {open === i && (
            <div className="border-t border-border-default px-3 py-3">
              {isObj(it) ? (
                <ObjectFields obj={it} sample={sample} siblingsOf={siblingsOf} onChange={(v) => onChange(items.map((x, j) => (j === i ? v : x)))} />
              ) : (
                <JsonField value={it} onChange={(v) => onChange(items.map((x, j) => (j === i ? v : x)))} />
              )}
            </div>
          )}
        </div>
      ))}
      {items.length > 0 && (
        <button type="button" onClick={() => add(false)} className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-border-strong py-2 text-[13px] font-semibold text-fg-muted hover:text-fg-default">
          <Plus className="size-4" /> Add at the bottom
        </button>
      )}
    </div>
  );
}

/** Two taps to remove, so a slip doesn't delete an item. */
function RemoveButton({ onRemove }: { onRemove: () => void }) {
  const [armed, setArmed] = useState(false);
  return (
    <button
      type="button"
      onClick={() => (armed ? onRemove() : (setArmed(true), setTimeout(() => setArmed(false), 3000)))}
      className={cx("flex items-center gap-1 rounded px-1.5 py-1 text-[12px] font-semibold", armed ? "bg-red-600 text-white" : "text-fg-muted hover:bg-canvas-subtle hover:text-red-600")}
    >
      <Trash2 className="size-4" /> {armed ? "Remove?" : ""}
    </button>
  );
}

/** An object whose keys you name yourself: skill groups, library labels. */
export function MapEditor({ obj, onChange }: { obj: Obj; onChange: (v: Obj) => void }) {
  const entries = Object.entries(obj);
  const sample = entries.find(([, v]) => v !== "")?.[1] ?? "";
  const [newKey, setNewKey] = useState("");
  const rename = (from: string, to: string) => {
    if (!to || to === from || to in obj) return;
    onChange(Object.fromEntries(entries.map(([k, v]) => [k === from ? to : k, v])));
  };
  return (
    <div className="grid gap-3">
      {entries.map(([k, v]) => (
        <div key={k} className="rounded-xl border border-border-default bg-canvas p-3">
          <div className="mb-2 flex items-center gap-2">
            <input className={cx(inputCls, "font-semibold")} defaultValue={k} onBlur={(e) => rename(k, e.target.value.trim())} aria-label="Name" />
            <RemoveButton onRemove={() => onChange(Object.fromEntries(entries.filter(([x]) => x !== k)))} />
          </div>
          <FieldValue name={k} value={v} sample={sample} onChange={(nv) => onChange({ ...obj, [k]: nv })} />
        </div>
      ))}
      <div className="flex gap-2">
        <input className={inputCls} placeholder="New name" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
        <button
          type="button"
          disabled={!newKey.trim() || newKey.trim() in obj}
          onClick={() => {
            onChange({ ...obj, [newKey.trim()]: blankLike(sample) });
            setNewKey("");
          }}
          className="flex shrink-0 items-center gap-1 rounded-lg border border-border-default px-3 text-[13px] font-semibold disabled:opacity-40"
        >
          <Plus className="size-4" /> Add
        </button>
      </div>
    </div>
  );
}

export { JsonField };
