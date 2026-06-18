import { neuroPredictServiceFetch } from '../../../clients/neuroPredictServiceFetch';
import type { PatientOut, PatientCreatePayload } from '../../../types/api';

export const createPatient = async (payload: PatientCreatePayload): Promise<PatientOut> => {
  return neuroPredictServiceFetch<PatientOut>('/patients', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
