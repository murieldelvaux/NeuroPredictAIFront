import type { PatientCreatePayload, PatientResponse } from '@/src/types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

export const createPatient = (
  { payload, mriFile }: { payload: PatientCreatePayload; mriFile?: File | null },
): Promise<PatientResponse> => {
  const formData = new FormData();

  formData.append('name', payload.name);
  formData.append('age', String(payload.age));
  formData.append('sex', payload.sex);

  if (payload.date_of_birth) {
    formData.append('date_of_birth', payload.date_of_birth);
  }

  if (payload.clinical_data) {
    formData.append('clinical_data', JSON.stringify(payload.clinical_data));
  }

  if (mriFile instanceof File) {
    formData.append('mri_file', mriFile);
  }

  return fetch(`${BASE_URL}/patients`, {
    method: 'POST',
    body: formData,
  }).then(async (res) => {
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

    return res.json() as Promise<PatientResponse>;
  });
};
