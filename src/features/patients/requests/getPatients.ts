import { neuroPredictServiceFetch } from '@/clients/neuroPredictServiceFetch';
import type { PatientOut } from '@/types/api';

export const getPatients = (): Promise<PatientOut[]> =>
  neuroPredictServiceFetch<PatientOut[]>('/patients');
