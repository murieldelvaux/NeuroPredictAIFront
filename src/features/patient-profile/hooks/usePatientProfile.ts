import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { PatientDetailResponse, PredictionResponse } from '../../../types';
import { getPatientQueryKey } from '../react-queries/useGetPatient';
import { useUpdatePatientMri } from '../react-queries/useUpdatePatientMri';
import { usePredict } from '../../prediction/react-queries/usePredict';

const normalizeBackendUrl = (url: string, baseUrl: string) => {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return new URL(url, baseUrl).toString();
};

export function usePatientProfile(patientRecord: PatientDetailResponse | null, apiBaseUrl: string) {
  const [activeTab, setActiveTab] = useState<'clinical' | 'imaging' | 'ai'>('clinical');
  const [sliceDepth, setSliceDepth] = useState<number>(45);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [mriUploading, setMriUploading] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [predictedAiAnalysis, setPredictedAiAnalysis] = useState<PredictionResponse | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const updatePatientMriMutation = useUpdatePatientMri();
  const { mutateAsync: predictMutation } = usePredict();

  const patient = patientRecord?.patient ?? null;
  const currentPrediction = useMemo(() => {
    if (predictedAiAnalysis) {
      return predictedAiAnalysis;
    }

    const predictions = patientRecord?.predictions ?? [];
    if (predictions.length === 0) {
      return null;
    }

    return [...predictions].sort(
      (left, right) => new Date(right.prediction_date).getTime() - new Date(left.prediction_date).getTime(),
    )[0] ?? null;
  }, [patientRecord?.predictions, predictedAiAnalysis]);

  const initialExamSources = useMemo(() => {
    const mriFiles = patient?.clinical_data?.mri_file ?? [];

    if (!patient || mriFiles.length === 0) {
      return [];
    }

    return mriFiles.map((mriFile, index) => {
      const urls = mriFile.url
        ? [normalizeBackendUrl(mriFile.url, apiBaseUrl)]
        : [
            `${apiBaseUrl}/patients/${patient.id}/${encodeURIComponent(mriFile.filename)}`,
            `${apiBaseUrl}/patients/${patient.id}/files/${encodeURIComponent(mriFile.filename)}`,
            `${apiBaseUrl}/files/${encodeURIComponent(mriFile.filename)}`,
            `${apiBaseUrl}/media/${encodeURIComponent(mriFile.filename)}`,
            `${apiBaseUrl}/uploads/${encodeURIComponent(mriFile.filename)}`,
          ];

      return {
        id: `${mriFile.filename}-${index}`,
        label: mriFile.filename,
        description: `${mriFile.content_type} • ${mriFile.size} bytes`,
        source: { type: 'url' as const, urls: [...new Set(urls)] },
      };
    });
  }, [apiBaseUrl, patient]);

  const displayRecordId = patient?.id ?? '—';

  const uploadMriAndPredict = async (file: File) => {
    if (!patient?.id) {
      setUploadError('Paciente indisponível para envio do exame.');
      return;
    }

    setMriUploading(true);
    setUploadError(null);
    setUploadedFile(file.name);
    setActiveTab('ai');

    try {
      await updatePatientMriMutation.mutateAsync({ patientId: patient.id, mriFile: file });

      const response = await predictMutation({
        patient_id: patient.id,
        mri_file: file,
        age: patient.age,
        mmse: patient.clinical_data?.mmse,
        cdr: patient.clinical_data?.cdr,
        cdrtot: patient.clinical_data?.cdrtot,
        prediction_date: new Date().toISOString().split('T')[0],
      });

      setPredictedAiAnalysis(response);
      await queryClient.invalidateQueries({ queryKey: [getPatientQueryKey, patient.id] });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao processar MRI';
      setUploadError(message);
    } finally {
      setMriUploading(false);
    }
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
    currentPrediction,
    uploadError,
    uploadMriAndPredict,
    initialExamSources,
    displayRecordId,
  };
}
