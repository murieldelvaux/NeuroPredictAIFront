import type { PredictPayload, PredictionOut } from '@/types/api';

const BASE_URL =
  (import.meta as any).env?.VITE_API_URL ?? 'http://127.0.0.1:8000';

<<<<<<< HEAD
/**
 * POST /predict — multipart/form-data.
 * Cannot use neuroPredictServiceFetch here because that helper
 * forces Content-Type: application/json; the browser must set the
 * multipart boundary automatically.
 */
=======
>>>>>>> 1bcdc574a8237f466f0f98432f6404c34165c7a4
export const predict = async (payload: PredictPayload): Promise<PredictionOut> => {
  const form = new FormData();

  form.append('patient_id', payload.patient_id);

<<<<<<< HEAD
  if (payload.mri_file instanceof File) {
    form.append('mri_file', payload.mri_file);
  }
=======
  if (payload.mri_file instanceof File) form.append('mri_file', payload.mri_file);
>>>>>>> 1bcdc574a8237f466f0f98432f6404c34165c7a4
  if (payload.age != null)    form.append('age',    String(payload.age));
  if (payload.mmse != null)   form.append('mmse',   String(payload.mmse));
  if (payload.cdr != null)    form.append('cdr',    String(payload.cdr));
  if (payload.cdrtot != null) form.append('cdrtot', String(payload.cdrtot));

<<<<<<< HEAD
  const res = await fetch(`${BASE_URL}/predict`, {
    method: 'POST',
    body: form,
  });
=======
  // Não passar Content-Type — o browser define o boundary do multipart
  const res = await fetch(`${BASE_URL}/predict`, { method: 'POST', body: form });
>>>>>>> 1bcdc574a8237f466f0f98432f6404c34165c7a4

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
    const message =
      typeof err.detail === 'string'
        ? err.detail
        : Array.isArray(err.detail)
<<<<<<< HEAD
          ? err.detail.map((e: any) => e.msg).join(', ')
          : `HTTP ${res.status}`;
=======
        ? err.detail.map((e: any) => e.msg).join(', ')
        : `HTTP ${res.status}`;
>>>>>>> 1bcdc574a8237f466f0f98432f6404c34165c7a4
    throw new Error(message);
  }

  return res.json() as Promise<PredictionOut>;
};
