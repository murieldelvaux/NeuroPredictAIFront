/**
 * Core fetch client for the NeuroPredict FastAPI backend.
 * Mirrors the pattern from next-marvel/src/app/clients/marvelServiceFetch.
 */

const BASE_URL =
  (import.meta as any).env?.VITE_API_URL ?? 'http://127.0.0.1:8000';

export async function neuroPredictServiceFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
    const message =
      typeof err.detail === 'string'
        ? err.detail
        : Array.isArray(err.detail)
          ? err.detail.map((e: any) => e.msg).join(', ')
          : `HTTP ${res.status}`;
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}
