import { neuroPredictServiceFetch } from '../../../clients/neuroPredictServiceFetch';
import type { PatientListItem } from '../../../types';

export const getPatients = async (): Promise<PatientListItem[]> =>
  neuroPredictServiceFetch<PatientListItem[]>('/patients', { method: 'GET' });
