import { neuroPredictServiceFetch } from '../../../clients/neuroPredictServiceFetch';
import type { PatientCreatePayload, PatientResponse } from '../../../types';

export const createPatient = async (payload: PatientCreatePayload): Promise<PatientResponse> =>
  neuroPredictServiceFetch<PatientResponse>('/patients', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
