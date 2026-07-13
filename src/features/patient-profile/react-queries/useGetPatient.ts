import { useQuery } from '@tanstack/react-query';
import type { PatientDetailResponse } from '@/src/types';
import { getPatient } from '../requests/getPatient';

export const getPatientQueryKey = 'patient';

export const useGetPatient = (id: string) =>
  useQuery<PatientDetailResponse>({
    queryKey: [getPatientQueryKey, id],
    queryFn: async () => getPatient(id),
    enabled: !!id,
    staleTime: 5_000,
  });
