/** Calls one of the admin's /api/security endpoints; a 401 (session over) goes back to the login page. */
export async function api<T = Record<string, unknown>>(path: string, method = "GET", body?: unknown): Promise<T & { error?: string; message?: string; ok?: boolean }> {
  const res = await fetch(`/api/security/${path}`, {
    method,
    cache: "no-store",
    headers: body === undefined ? undefined : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  }).catch(() => null);
  if (!res) return { error: "offline", message: "Can't connect. Check your internet." } as T & { error: string; message: string };
  if (res.status === 401) {
    window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`; // eslint-disable-line @next/next/no-location-assign-relative-destination -- full reload clears the session state
    return { error: "unauthorized" } as T & { error: string };
  }
  return ((await res.json().catch(() => null)) ?? { error: "failed", message: "Something went wrong. Try again." }) as T & { error?: string; message?: string };
}

const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
export const when = (iso: string) => fmt.format(new Date(iso));

/** "in 2 h 10 min", "5 min ago"… */
export function relative(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  const m = Math.round(Math.abs(ms) / 60_000);
  const t = m < 1 ? "less than a minute" : m < 60 ? `${m} min` : m < 60 * 24 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}` : `${Math.round(m / 1440)} days`;
  return ms >= 0 ? `in ${t}` : `${t} ago`;
}
