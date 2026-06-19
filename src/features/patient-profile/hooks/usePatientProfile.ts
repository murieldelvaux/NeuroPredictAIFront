import { useState } from 'react';
import type { AIAnalysisResult } from '../../../types';
import { usePredict } from '../../prediction/react-queries/usePredict';
import { adaptPredictionOut } from '@/src/clients/adapters';

export function usePatientProfile() {
  const [activeTab, setActiveTab] = useState<'clinical' | 'imaging' | 'ai'>('clinical');
  const [sliceDepth, setSliceDepth] = useState<number>(45);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [mriUploading, setMriUploading] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [predictedAiAnalysis, setPredictedAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { mutate: predictMutation}= usePredict();
  

  const uploadMriAndPredict = async ({
    patientId,
    file,
    age,
    mmse,
    cdr,
    cdrtot,
  }: {
    patientId: string;
    file: File;
    age?: number | null;
    mmse?: number | null;
    cdr?: number | null;
    cdrtot?: number | null;
  }) => {
    setMriUploading(true);
    setUploadError(null);
    console.log(patientId, file, age, mmse, cdr, cdrtot);
      setUploadedFile(file.name);
      setActiveTab('ai');

      predictMutation({
        patient_id: patientId,
        mri_file: file,
        age,
        mmse,
        cdr,
        cdrtot,
      }, {
        onSuccess: (response) => {
          console.log('Prediction response:', response);
          setPredictedAiAnalysis(adaptPredictionOut(response));
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : 'Erro ao processar MRI';
          setUploadError(message);
        },
      });
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
    predictedAiAnalysis,
    uploadError,
    uploadMriAndPredict,
  };
}
