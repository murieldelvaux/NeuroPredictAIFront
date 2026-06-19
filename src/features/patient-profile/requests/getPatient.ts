import { neuroPredictServiceFetch } from '@/clients/neuroPredictServiceFetch';
import type { PatientDetailOut } from '@/types/api';

export const getPatient = (id: string): Promise<PatientDetailOut> =>
  neuroPredictServiceFetch<PatientDetailOut>(`/patients/${id}`);
