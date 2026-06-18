import { useQuery } from '@tanstack/react-query';

export const imagingAnalysisQueryKey = 'imagingAnalysis';

export const useImagingAnalysis = (scanId: string) => {
  return useQuery({
    queryKey: [imagingAnalysisQueryKey, scanId],
    queryFn: async () => {
      const raw = localStorage.getItem('np_img_analysis');
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed[scanId] ?? null;
      }
      return null;
    },
    enabled: !!scanId,
    staleTime: 5000,
  });
};
