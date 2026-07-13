import { neuroPredictServiceFetch } from '@/src/clients/neuroPredictServiceFetch';
import type { PatientListItem } from '@/src/types';

export const getPatients = (): Promise<PatientListItem[]> =>
  neuroPredictServiceFetch<PatientListItem[]>('/patients');
