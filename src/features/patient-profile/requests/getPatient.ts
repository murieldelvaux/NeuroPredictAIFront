import { neuroPredictServiceFetch } from '../../../clients/neuroPredictServiceFetch';
import type { PatientDetailOut } from '../../../types/api';

export const getPatient = async (id: string): Promise<PatientDetailOut> => {
  return neuroPredictServiceFetch<PatientDetailOut>(`/patients/${id}`, { method: 'GET' });
};
