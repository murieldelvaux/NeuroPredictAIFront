export interface UsePatientProfileReturn {
  activeTab: 'clinical' | 'imaging' | 'ai';
  setActiveTab: (tab: 'clinical' | 'imaging' | 'ai') => void;
  sliceDepth: number;
  setSliceDepth: (depth: number) => void;
  showHeatmap: boolean;
  setShowHeatmap: (show: boolean) => void;
  mriUploading: boolean;
  uploadedFile: string | null;
  simulateMriUpload: (fileName: string) => void;
}
