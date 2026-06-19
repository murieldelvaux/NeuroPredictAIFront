import { neuroPredictServiceFetch } from '@/src/clients/neuroPredictServiceFetch';
import { Patient } from '@/src/types';

export const getPatients = (): Promise<Patient[]> =>
  neuroPredictServiceFetch<Patient[]>('/patients');
