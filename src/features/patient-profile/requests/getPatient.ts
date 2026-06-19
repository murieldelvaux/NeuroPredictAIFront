import { neuroPredictServiceFetch } from '@/src/clients/neuroPredictServiceFetch';
import { PatientDetailResponse } from '@/src/types';

export const getPatient = (id: string): Promise<PatientDetailResponse
> =>
  neuroPredictServiceFetch<PatientDetailResponse>(`/patients/${id}`);
