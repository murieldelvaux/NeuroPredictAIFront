<<<<<<< HEAD
import { useState } from 'react';
import { predict } from '../requests/predict';
import { adaptPredictionOut } from '../requests/adaptPredictionOut';
import type { PredictPayload } from '@/types/api';
import type { AIAnalysisResult } from '@/types';

/**
 * usePredict gerencia o estado local do upload de MRI e chama POST /predict.
 * Não usa React Query porque:
 *  - é disparado por ação do usuário (não fetch automático)
 *  - o resultado não deve ser cacheado (cada upload gera nova predição)
 *  - precisa de estados locais específicos: mriUploading, uploadError, uploadedFile
 */
export const usePredict = () => {
  const [mriUploading, setMriUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [predictedAiAnalysis, setPredictedAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadMriAndPredict = async (payload: PredictPayload) => {
    setMriUploading(true);
    setUploadError(null);

    try {
      const response = await predict(payload);
      setUploadedFile(payload.mri_file instanceof File ? payload.mri_file.name : null);
      setPredictedAiAnalysis(adaptPredictionOut(response));
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao processar MRI';
      setUploadError(message);
      throw error;
    } finally {
      setMriUploading(false);
    }
  };

  return {
    mriUploading,
    uploadedFile,
    predictedAiAnalysis,
    uploadError,
    uploadMriAndPredict,
  };
};
=======
import { useMutation } from '@tanstack/react-query';
import { predict } from '../requests/predict';
import { adaptPredictionOut } from '@/clients/adapters';
import type { PredictPayload } from '@/types/api';

export const usePredict = () =>
  useMutation({
    mutationFn: (payload: PredictPayload) =>
      predict(payload).then(adaptPredictionOut),
  });
>>>>>>> 1bcdc574a8237f466f0f98432f6404c34165c7a4
