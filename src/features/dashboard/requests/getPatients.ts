import { neuroPredictServiceFetch } from '../../../clients/neuroPredictServiceFetch';
import type { PatientOut } from '../../../types/api';

export const getPatients = async (): Promise<PatientOut[]> => {
  return neuroPredictServiceFetch<PatientOut[]>('/patients', { method: 'GET' });
};
