import { useState } from 'react';

export function usePatientProfile() {
  const [activeTab, setActiveTab] = useState<'clinical' | 'imaging' | 'ai'>('clinical');
  const [sliceDepth, setSliceDepth] = useState<number>(45);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [mriUploading, setMriUploading] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const simulateMriUpload = (fileName: string) => {
    setMriUploading(true);
    setTimeout(() => {
      setUploadedFile(fileName);
      setMriUploading(false);
    }, 2500);
  };

  return {
    activeTab,
    setActiveTab,
    sliceDepth,
    setSliceDepth,
    showHeatmap,
    setShowHeatmap,
    mriUploading,
    uploadedFile,
    simulateMriUpload,
  };
}
