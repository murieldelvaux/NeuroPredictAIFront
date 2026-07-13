import { useQuery } from '@tanstack/react-query';
import { getPatient } from '../../patient-profile/requests/getPatient';
import type { PatientDetailResponse } from '../../../types';

export const aiAnalysisQueryKey = 'aiAnalysis';

export const useAIAnalysis = (patientId: string) =>
  useQuery<PatientDetailResponse>({
    queryKey: [aiAnalysisQueryKey, patientId],
    queryFn: async () => getPatient(patientId),
    enabled: !!patientId,
    staleTime: 5000,
  });
