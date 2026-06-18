import type { AIAnalysisResult } from '../../../types';

export interface UsePatientProfileReturn {
  activeTab: 'clinical' | 'imaging' | 'ai';
  setActiveTab: (tab: 'clinical' | 'imaging' | 'ai') => void;
  sliceDepth: number;
  setSliceDepth: (depth: number) => void;
  showHeatmap: boolean;
  setShowHeatmap: (show: boolean) => void;
  mriUploading: boolean;
  uploadedFile: string | null;
  predictedAiAnalysis: AIAnalysisResult | null;
  uploadError: string | null;
  uploadMriAndPredict: (params: {
    patientId: string;
    file: File;
    age?: number | null;
    mmse?: number | null;
    cdr?: number | null;
    cdrtot?: number | null;
  }) => Promise<unknown>;
}
