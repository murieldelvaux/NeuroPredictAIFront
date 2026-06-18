import { useQuery } from '@tanstack/react-query';
import { getPatient } from '../../patient-profile/requests/getPatient';

export const aiAnalysisQueryKey = 'aiAnalysis';

export const useAIAnalysis = (patientId: string) => {
  return useQuery({
    queryKey: [aiAnalysisQueryKey, patientId],
    queryFn: async () => {
      const state = await getPatient(patientId);
      return state.ai_analysis ?? null;
    },
    enabled: !!patientId,
    staleTime: 5000,
  });
};
