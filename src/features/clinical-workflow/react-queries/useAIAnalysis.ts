import { useQuery } from '@tanstack/react-query';
import { getPatient } from '../../patient-profile/requests/getPatient';
import type { AIAnalysisResult } from '../../../types';
import { mapAIAnalysis } from '../../../lib/mappers/patient.mappers';

export const aiAnalysisQueryKey = 'aiAnalysis';

export const useAIAnalysis = (patientId: string) =>
  useQuery({
    queryKey: [aiAnalysisQueryKey, patientId],
    queryFn: async (): Promise<AIAnalysisResult | null> => {
      const detail = await getPatient(patientId);
      return mapAIAnalysis(detail);
    },
    enabled: !!patientId,
    staleTime: 5000,
  });
