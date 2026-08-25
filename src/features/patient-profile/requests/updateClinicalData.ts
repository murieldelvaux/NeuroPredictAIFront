import { neuroPredictServiceFetch } from '@/src/clients/neuroPredictServiceFetch';
import type { PatientResponse, UpdateClinicalDataPayload } from '@/src/types';

export const updateClinicalData = (
  patientId: string,
  payload: UpdateClinicalDataPayload,
): Promise<PatientResponse> =>
  neuroPredictServiceFetch<PatientResponse>(`/patients/${patientId}/clinical-data`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
