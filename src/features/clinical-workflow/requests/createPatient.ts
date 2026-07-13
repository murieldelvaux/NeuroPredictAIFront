import { neuroPredictServiceFetch } from '@/src/clients/neuroPredictServiceFetch';
import type { PatientCreatePayload, PatientResponse } from '@/src/types';
export const createPatient = (payload: PatientCreatePayload): Promise<PatientResponse> => {
  return neuroPredictServiceFetch<PatientResponse>('/patients', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
