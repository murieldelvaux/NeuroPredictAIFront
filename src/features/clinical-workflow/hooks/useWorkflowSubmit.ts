import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { PatientCreatePayload, PatientSex, PredictPayload, PredictionResponse } from '../../../types';
import { useCreatePatient } from '../../clinical-workflow/react-queries/useCreatePatient';
import { usePredict } from '../../prediction/react-queries/usePredict';
import { getPatientsQueryKey } from '../../dashboard/react-queries/useGetPatients';
import { getPatientQueryKey } from '../../patient-profile/react-queries/useGetPatient';

type WorkflowCallbacks = {
  onComplete: (patientId: string) => void;
  onError: (message: string) => void;
};

type WorkflowSubmitParams = {
  step: number;
  goToStep: (step: number) => void;
  firstName: string;
  lastName: string;
  age: number;
  sex: PatientSex;
  dateOfBirth: string;
  educationYears: number;
  symptomsList: string[];
  hasFamilyHistory: boolean;
  selectedRiskFactors: string[];
  selectedComorbidities: string[];
  medicationsList: string[];
  mmseScore: number;
  mocaScore: number;
  cdrScore: number;
  cdrtotScore: number;
  customFileUploaded: File | null;
  onComplete: (patientId: string) => void;
  onError: (message: string) => void;
};

export function useWorkflowSubmit({
  step,
  goToStep,
  firstName,
  lastName,
  age,
  sex,
  dateOfBirth,
  educationYears,
  symptomsList,
  hasFamilyHistory,
  selectedRiskFactors,
  selectedComorbidities,
  medicationsList,
  mmseScore,
  mocaScore,
  cdrScore,
  cdrtotScore,
  customFileUploaded,
  onComplete,
  onError,
}: WorkflowSubmitParams) {
  const queryClient = useQueryClient();
  const createPatientMutation = useCreatePatient();
  const predictMutation = usePredict();
  const [createdPatientId, setCreatedPatientId] = useState<string | null>(null);
  const [predictionResponse, setPredictionResponse] = useState<PredictionResponse | null>(null);
  const [simulationPercentage, setSimulationPercentage] = useState<number>(0);
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  const buildPatientPayload = (): PatientCreatePayload => ({
    name: `${firstName} ${lastName}`.trim() || 'Anonymous Patient',
    age,
    sex,
    date_of_birth: dateOfBirth,
    clinical_data: {
      mmse: mmseScore,
      moca: mocaScore,
      cdr: cdrScore,
      cdrtot: cdrtotScore,
      comorbidities: selectedComorbidities,
      family_history: hasFamilyHistory,
      education_years: educationYears,
      biomarkers: selectedRiskFactors,
      medications: medicationsList,
      symptoms: symptomsList,
    },
  });

  const buildPredictPayload = (patientId: string): PredictPayload => ({
    patient_id: patientId,
    mri_file: customFileUploaded,
    age,
    mmse: mmseScore,
    cdr: cdrScore,
    cdrtot: cdrtotScore,
    prediction_date: new Date().toISOString().split('T')[0],
  });

  const handleNextStep = async () => {
    if (step !== 4) {
      goToStep(step + 1);
      return;
    }

    try {
      const createdPatient = await createPatientMutation.mutateAsync({
        payload: buildPatientPayload(),
        mriFile: customFileUploaded,
      });

      setCreatedPatientId(createdPatient.id);
      goToStep(5);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível cadastrar o paciente.';
      onError(message);
    }
  };

  const runAIPipeline = async () => {
    if (!createdPatientId) {
      onError('Cadastre o paciente antes de solicitar a análise de IA.');
      return;
    }

    setSimulationRunning(true);
    setSimulationPercentage(15);
    setTerminalLogs([
      `[API] POST /predict iniciado para o paciente ${createdPatientId}`,
      customFileUploaded ? `[API] Arquivo anexado: ${customFileUploaded.name}` : '[API] Execução sem arquivo MRI adicional.',
    ]);

    try {
      const response = await predictMutation.mutateAsync(buildPredictPayload(createdPatientId));

      setPredictionResponse(response);
      setSimulationPercentage(100);
      setTerminalLogs((prev) => [...prev, `[API] Classificação: ${response.classification}`, `[API] Risk score: ${response.risk_score}`]);
      goToStep(6);

      await queryClient.invalidateQueries({ queryKey: [getPatientsQueryKey] });
      await queryClient.invalidateQueries({ queryKey: [getPatientQueryKey, createdPatientId] });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível executar a análise de IA.';
      setTerminalLogs((prev) => [...prev, `[ERROR] ${message}`]);
      onError(message);
    } finally {
      setSimulationRunning(false);
    }
  };

  const submitWorkflow = () => {
    if (!createdPatientId) {
      onError('O paciente ainda não foi cadastrado.');
      return;
    }

    onComplete(createdPatientId);
  };

  return {
    createdPatientId,
    predictionResponse,
    simulationPercentage,
    simulationRunning,
    terminalLogs,
    isCreatingPatient: createPatientMutation.isPending,
    isPredicting: predictMutation.isPending,
    isWorkflowBusy: createPatientMutation.isPending || predictMutation.isPending,
    handleNextStep,
    runAIPipeline,
    submitWorkflow,
  };
}