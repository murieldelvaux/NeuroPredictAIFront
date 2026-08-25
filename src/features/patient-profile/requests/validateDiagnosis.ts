import { neuroPredictServiceFetch } from '@/src/clients/neuroPredictServiceFetch';
import type { PatientResponse, ValidateDiagnosisPayload } from '@/src/types';

export const validateDiagnosis = (
  patientId: string,
  payload: ValidateDiagnosisPayload,
): Promise<PatientResponse> =>
  neuroPredictServiceFetch<PatientResponse>(`/patients/${patientId}/validate-diagnosis`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
