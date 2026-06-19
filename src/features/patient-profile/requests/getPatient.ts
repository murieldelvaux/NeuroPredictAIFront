import { neuroPredictServiceFetch } from '../../../clients/neuroPredictServiceFetch';
import type { PatientDetailResponse } from '../../../types';

export const getPatient = async (id: string): Promise<PatientDetailResponse> =>
  neuroPredictServiceFetch<PatientDetailResponse>(`/patients/${id}`, { method: 'GET' });
