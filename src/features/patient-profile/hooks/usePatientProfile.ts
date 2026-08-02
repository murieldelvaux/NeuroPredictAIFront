import { useMemo, useState } from 'react';
import type { PatientDetailResponse, PredictionResponse } from '../../../types';
import { usePredict } from '../../prediction/react-queries/usePredict';

export function usePatientProfile(patientRecord: PatientDetailResponse | null, apiBaseUrl: string) {
  const [activeTab, setActiveTab] = useState<'clinical' | 'imaging' | 'ai'>('clinical');
  const [sliceDepth, setSliceDepth] = useState<number>(45);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [mriUploading, setMriUploading] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [predictedAiAnalysis, setPredictedAiAnalysis] = useState<PredictionResponse | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { mutate: predictMutation } = usePredict();

  const patient = patientRecord?.patient ?? null;

  const initialExamSources = useMemo(() => {
    const mriFile = patient?.clinical_data?.mri_file;

    if (!patient || !mriFile?.filename) {
      return [];
    }

    const urls = mriFile.url
      ? [mriFile.url]
      : [
          `${apiBaseUrl}/patients/${patient.id}/mri-file`,
          `${apiBaseUrl}/patients/${patient.id}/mri`,
          `${apiBaseUrl}/files/${encodeURIComponent(mriFile.filename)}`,
          `${apiBaseUrl}/media/${encodeURIComponent(mriFile.filename)}`,
          `${apiBaseUrl}/uploads/${encodeURIComponent(mriFile.filename)}`,
        ];

    return [
      {
        id: mriFile.filename,
        label: mriFile.filename,
        description: `${mriFile.content_type} • ${mriFile.size} bytes`,
        source: { type: 'url' as const, urls },
      },
    ];
  }, [apiBaseUrl, patient]);

  const displayMrn = useMemo(() => {
    const mrn = (patient as any)?.mrn;
    return typeof mrn === 'string' && mrn.trim() ? mrn : '—';
  }, [patient]);

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
    setUploadedFile(file.name);
    setActiveTab('ai');

    predictMutation(
      {
        patient_id: patientId,
        mri_file: file,
        age,
        mmse,
        cdr,
        cdrtot,
        prediction_date: new Date().toISOString().split("T")[0], // deixar no formato dd-mm-yyyy
      },
      {
        onSuccess: (response) => {
          setPredictedAiAnalysis(response);
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : 'Erro ao processar MRI';
          setUploadError(message);
        },
        onSettled: () => {
          setMriUploading(false);
        },
      },
    );
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
    initialExamSources,
    displayMrn,
  };
}
