import { neuroPredictServiceFetch } from '@/src/clients/neuroPredictServiceFetch';
import type { PatientResponse } from '@/src/types';

export const getPatients = (): Promise<PatientResponse[]> =>
  neuroPredictServiceFetch<PatientResponse[]>('/patients');
