import { useEffect, useMemo, useState } from 'react';
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
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [sessionExamPredictions, setSessionExamPredictions] = useState<Record<string, PredictionResponse>>({});

  const queryClient = useQueryClient();
  const updatePatientMriMutation = useUpdatePatientMri();
  const { mutateAsync: predictMutation } = usePredict();

  const patient = patientRecord?.patient ?? null;

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

  // Set default selectedExamId to the last loaded exam whenever initialExamSources is available
  useEffect(() => {
    if (initialExamSources.length > 0) {
      setSelectedExamId((prev) => {
        if (prev && initialExamSources.some((exam) => exam.id === prev)) {
          return prev;
        }
        return initialExamSources[initialExamSources.length - 1].id;
      });
    }
  }, [initialExamSources]);

  const chronologicalPredictions = useMemo(() => {
    const predictions = patientRecord?.predictions ?? [];
    return [...predictions].sort(
      (left, right) => new Date(left.prediction_date).getTime() - new Date(right.prediction_date).getTime(),
    );
  }, [patientRecord?.predictions]);

  const activeExamIndex = useMemo(() => {
    if (initialExamSources.length === 0) return -1;
    if (!selectedExamId) return initialExamSources.length - 1;
    const idx = initialExamSources.findIndex((exam) => exam.id === selectedExamId);
    return idx >= 0 ? idx : initialExamSources.length - 1;
  }, [initialExamSources, selectedExamId]);

  const selectedExam = useMemo(() => {
    if (activeExamIndex >= 0 && activeExamIndex < initialExamSources.length) {
      return initialExamSources[activeExamIndex];
    }
    return initialExamSources[initialExamSources.length - 1] ?? null;
  }, [activeExamIndex, initialExamSources]);

  const currentPrediction = useMemo(() => {
    // 1. If we have a session prediction explicitly stored for this exam
    if (selectedExamId && sessionExamPredictions[selectedExamId]) {
      return sessionExamPredictions[selectedExamId];
    }

    // 2. Newly uploaded file in this session matching the current selected exam
    if (predictedAiAnalysis && selectedExam?.label === uploadedFile) {
      return predictedAiAnalysis;
    }

    // 3. Chronological match by exam index
    if (chronologicalPredictions.length > 0) {
      const idx = activeExamIndex >= 0 ? activeExamIndex : chronologicalPredictions.length - 1;
      const matched = chronologicalPredictions[idx] ?? chronologicalPredictions[chronologicalPredictions.length - 1];
      return matched ?? null;
    }

    // 4. Fallback to predictedAiAnalysis or patient.last_prediction
    if (predictedAiAnalysis) {
      return predictedAiAnalysis;
    }

    if (patient?.last_prediction) {
      return {
        patient_id: patient.id,
        prediction_date: patient.last_prediction.prediction_date,
        risk_score: patient.last_prediction.risk_score,
        classification: patient.last_prediction.classification,
        confidence: patient.last_prediction.confidence,
        probabilities: {
          [patient.last_prediction.classification]: patient.last_prediction.confidence,
        },
        explanation: null,
        model_version: 'resnet3d-oasis3',
      } as PredictionResponse;
    }

    return null;
  }, [
    activeExamIndex,
    chronologicalPredictions,
    patient,
    predictedAiAnalysis,
    selectedExam?.label,
    selectedExamId,
    sessionExamPredictions,
    uploadedFile,
  ]);

  const displayRecordId = patient?.id ?? '—';

  const uploadMriAndPredict = async (file: File) => {
    if (!patient?.id) {
      setUploadError('Paciente indisponível para envio do exame.');
      return;
    }

    setMriUploading(true);
    setUploadError(null);
    setUploadedFile(file.name);

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
      const tempExamId = `${file.name}-${initialExamSources.length}`;
      setSelectedExamId(tempExamId);
      setSessionExamPredictions((prev) => ({ ...prev, [tempExamId]: response }));

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
    selectedExamId,
    setSelectedExamId,
    selectedExam,
  };
}
