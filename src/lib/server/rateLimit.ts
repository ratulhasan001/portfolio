import { NextResponse } from "next/server";
import { db, dbEnabled, ensureSchema } from "./db";

/**
 * Simple sliding-window limits for admin actions (publishing, uploads). Each use is written down in pf_rate_hits; a
 * use over the limit is taken back, so waiting it out works.
 */
export async function allow(key: string, max: number, windowMinutes: number): Promise<boolean> {
  if (!dbEnabled()) return true;
  try {
    await ensureSchema();
    const [{ id }] = await db()<{ id: string }[]>`insert into pf_rate_hits (key) values (${key.slice(0, 200)}) returning id`;
    const [{ n }] = await db()<{ n: number }[]>`
      select count(*)::int as n from pf_rate_hits where key = ${key.slice(0, 200)} and at > now() - make_interval(mins => ${windowMinutes})`;
    if (n <= max) {
      if (Math.random() < 0.02) await db()`delete from pf_rate_hits where at < now() - interval '1 day'`; // tidy up now and then
      return true;
    }
    await db()`delete from pf_rate_hits where id = ${id}`;
    return false;
  } catch (e) {
    console.error("rate limit check failed", e); // a database hiccup mustn't block the owner
    return true;
  }
}

/** Whether `key` has already been used `max` times in the window (for limits counted only on success, with `record`). */
export async function reached(key: string, max: number, windowMinutes: number): Promise<boolean> {
  if (!dbEnabled()) return false;
  try {
    await ensureSchema();
    const [{ n }] = await db()<{ n: number }[]>`
      select count(*)::int as n from pf_rate_hits where key = ${key.slice(0, 200)} and at > now() - make_interval(mins => ${windowMinutes})`;
    return n >= max;
  } catch (e) {
    console.error("rate limit check failed", e);
    return false;
  }
}

export async function record(key: string) {
  if (dbEnabled()) await db()`insert into pf_rate_hits (key) values (${key.slice(0, 200)})`.catch(() => null);
}

export const tooMany = (message = "Too many tries in a short time. Please wait a few minutes and try again.") =>
  NextResponse.json({ error: "busy", message }, { status: 429 });
