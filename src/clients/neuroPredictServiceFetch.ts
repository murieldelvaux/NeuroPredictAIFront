/**
 * Core fetch client for the NeuroPredict FastAPI backend.
 * Mirrors the pattern from next-marvel/src/app/clients/marvelServiceFetch.
 */

/// <reference types="vite/client" />

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

type FastApiValidationError = {
  msg: string;
  type: string;
  loc: string[];
};

type FastApiErrorBody = {
  detail: string | FastApiValidationError[];
};

const parseErrorMessage = (body: FastApiErrorBody, status: number): string => {
  if (typeof body.detail === 'string') return body.detail;
  if (Array.isArray(body.detail))
    return body.detail.map((e) => e.msg).join(', ');
  return `HTTP ${status}`;
};

export async function neuroPredictServiceFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res
      .json()
      .catch((): FastApiErrorBody => ({ detail: `HTTP ${res.status}` }));
    throw new Error(parseErrorMessage(body as FastApiErrorBody, res.status));
  }

  return res.json() as Promise<T>;
}
