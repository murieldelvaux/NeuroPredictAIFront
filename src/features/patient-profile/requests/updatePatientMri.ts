import type { MRIFileMetadata } from '@/src/types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

export const updatePatientMri = async (patientId: string, mriFile: File): Promise<MRIFileMetadata> => {
  const formData = new FormData();
  formData.append('mri_file', mriFile);

  const res = await fetch(`${BASE_URL}/patients/${patientId}/mri-file`, {
    method: 'POST',
    body: formData,
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

  return res.json() as Promise<MRIFileMetadata>;
};