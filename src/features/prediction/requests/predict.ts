import type { PredictPayload, PredictionResponse } from '@/src/types/api';

const BASE_URL =
  (import.meta as any).env?.VITE_API_URL ?? 'http://127.0.0.1:8000';

/**
 * POST /predict — multipart/form-data.
 * Cannot use neuroPredictServiceFetch here because that helper
 * forces Content-Type: application/json; the browser must set the
 * multipart boundary automatically.
 */
export const predict = async (payload: PredictPayload): Promise<PredictionResponse> => {
  const form = new FormData();

  form.append('patient_id', payload.patient_id);

  if (payload.mri_file instanceof File) {
    form.append('mri_file', payload.mri_file);
  }
  if (payload.age != null)    form.append('age',    String(payload.age));
  if (payload.mmse != null)   form.append('mmse',   String(payload.mmse));
  if (payload.cdr != null)    form.append('cdr',    String(payload.cdr));
  if (payload.cdrtot != null) form.append('cdrtot', String(payload.cdrtot));

  const res = await fetch(`${BASE_URL}/predict`, {
    method: 'POST',
    body: form,
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

  return res.json() as Promise<PredictionResponse>;
};
