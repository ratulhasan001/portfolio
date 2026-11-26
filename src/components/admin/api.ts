/** Calls one of the admin's /api endpoints; a 401 (session over) goes back to the login page. */
export async function adminApi<T = Record<string, unknown>>(
  path: string,
  method = "GET",
  body?: unknown,
): Promise<T & { error?: string; message?: string; ok?: boolean }> {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  const res = await fetch(path, {
    method,
    cache: "no-store",
    headers: body === undefined || isForm ? undefined : { "content-type": "application/json" },
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  }).catch(() => null);
  if (!res) return { error: "offline", message: "Can't connect. Check your internet." } as T & { error: string; message: string };
  if (res.status === 401) {
    window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`; // eslint-disable-line @next/next/no-location-assign-relative-destination -- full reload clears the session state
    return { error: "unauthorized" } as T & { error: string };
  }
  return ((await res.json().catch(() => null)) ?? { error: "failed", message: "Something went wrong. Try again." }) as T & { error?: string; message?: string };
}

export interface PublishInfo {
  ready: boolean;
  pending: boolean;
  changedAt: string | null;
  publishedAt: string | null;
}
