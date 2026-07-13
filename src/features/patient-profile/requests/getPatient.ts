import { neuroPredictServiceFetch } from '@/src/clients/neuroPredictServiceFetch';
import type { PatientDetailResponse } from '@/src/types';

export const getPatient = (id: string): Promise<PatientDetailResponse> =>
  neuroPredictServiceFetch<PatientDetailResponse>(`/patients/${id}`);
