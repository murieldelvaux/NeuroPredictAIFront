import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { PatientCreatePayload, PatientSex, PredictPayload, PredictionResponse } from '../types';
import { useCreatePatient } from '../features/clinical-workflow/react-queries/useCreatePatient';
import { usePredict } from '../features/prediction/react-queries/usePredict';
import { getPatientsQueryKey } from '../features/dashboard/react-queries/useGetPatients';
import { getPatientQueryKey } from '../features/patient-profile/react-queries/useGetPatient';

type WorkflowCallbacks = {
  onComplete: (patientId: string) => void;
  onError: (message: string) => void;
};

export function useClinicalWorkflow({ onComplete, onError }: WorkflowCallbacks) {
  const queryClient = useQueryClient();
  const createPatientMutation = useCreatePatient();
  const predictMutation = usePredict();
  const [step, setStep] = useState<number>(1);
  const [createdPatientId, setCreatedPatientId] = useState<string | null>(null);
  const [predictionResponse, setPredictionResponse] = useState<PredictionResponse | null>(null);

  // STEP 1 State: Demographics
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState<number>(70);
  const [sex, setSex] = useState<PatientSex>('M');
  const [date_of_birth, setDateOfBirth] = useState('1956-06-20');
  const [mrn] = useState<string>(() => `MRN-${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(10 + Math.random() * 89)}Z`);
  const [educationYears, setEducationYears] = useState<number>(14);

  // STEP 2 State: Clinical History
  const [symptomsInput, setSymptomsInput] = useState<string>('');
  const [symptomsList, setSymptomsList] = useState<string[]>([
    "Mild word retrieval delays",
    "Subjective short term recall deficits"
  ]);
  const [hasFamilyHistory, setHasFamilyHistory] = useState<boolean>(true);
  const [familyRelation, setFamilyRelation] = useState<string>('Grandmother');
  const [dementiaCount, setDementiaCount] = useState<number>(1);
  const [selectedRiskFactors, setSelectedRiskFactors] = useState<string[]>(["ApoE4 positive (ε3/ε4)"]);
  const [selectedComorbidities, setSelectedComorbidities] = useState<string[]>(["Hypertension"]);
  const [medicationsInput, setMedicationsInput] = useState<string>('');
  const [medicationsList, setMedicationsList] = useState<string[]>(["Lisinopril 10mg daily"]);

  // STEP 3 State: Cognitive Tests
  const [mmseScore, setMmseScore] = useState<number>(24);
  const [mocaScore, setMocaScore] = useState<number>(22);
  const [cdrScore, setCdrScore] = useState<number>(0.5);
  const [cdrtotScore, setCdrtotScore] = useState<number>(0.5);

  // STEP 4 State: Imaging Details
  const [scanType, setScanType] = useState<string>('MRI 3T');
  const [scanDate, setScanDate] = useState('2026-06-10');
  const [radiologistNotes, setRadiologistNotes] = useState('Subcortical vascular parameters are constant. No distinct cortical anomalies reported.');
  const [customFileUploaded, setCustomFileUploaded] = useState<File | null>(null);

  // STEP 5 State: AI Analysis Simulation & Terminal logs
  const [simulationPercentage, setSimulationPercentage] = useState<number>(0);
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  const buildPatientPayload = (): PatientCreatePayload => ({
    name: `${firstName} ${lastName}`.trim() || 'Anonymous Patient',
    age,
    sex,
    date_of_birth,
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

  const addSymptom = () => {
    if (symptomsInput.trim()) {
      setSymptomsList([...symptomsList, symptomsInput.trim()]);
      setSymptomsInput('');
    }
  };

  const removeSymptom = (idx: number) => {
    setSymptomsList(symptomsList.filter((_, i) => i !== idx));
  };

  const addMedication = () => {
    if (medicationsInput.trim()) {
      setMedicationsList([...medicationsList, medicationsInput.trim()]);
      setMedicationsInput('');
    }
  };

  const removeMedication = (idx: number) => {
    setMedicationsList(medicationsList.filter((_, i) => i !== idx));
  };

  const toggleRiskFactor = (factor: string) => {
    if (selectedRiskFactors.includes(factor)) {
      setSelectedRiskFactors(selectedRiskFactors.filter(f => f !== factor));
    } else {
      setSelectedRiskFactors([...selectedRiskFactors, factor]);
    }
  };

  const toggleComorbidity = (item: string) => {
    if (selectedComorbidities.includes(item)) {
      setSelectedComorbidities(selectedComorbidities.filter(c => c !== item));
    } else {
      setSelectedComorbidities([...selectedComorbidities, item]);
    }
  };

  const handleNextStep = async () => {
    if (step !== 4) {
      setStep(step + 1);
      return;
    }

    try {
      const createdPatient = await createPatientMutation.mutateAsync({
        payload: buildPatientPayload(),
        mriFile: customFileUploaded,
      });

      setCreatedPatientId(createdPatient.id);
      setStep(5);
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
      customFileUploaded
        ? `[API] Arquivo anexado: ${customFileUploaded.name}`
        : '[API] Execução sem arquivo MRI adicional.',
    ]);

    try {
      const response = await predictMutation.mutateAsync(buildPredictPayload(createdPatientId));

      setPredictionResponse(response);
      setSimulationPercentage(100);
      setTerminalLogs((prev) => [
        ...prev,
        `[API] Classificação: ${response.classification}`,
        `[API] Risk score: ${response.risk_score}`,
      ]);
      setStep(6);

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
    step,
    setStep,
    createdPatientId,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    age,
    setAge,
    sex,
    setSex,
    date_of_birth,
    setDateOfBirth,
    mrn,
    educationYears,
    setEducationYears,
    symptomsInput,
    setSymptomsInput,
    symptomsList,
    addSymptom,
    removeSymptom,
    hasFamilyHistory,
    setHasFamilyHistory,
    familyRelation,
    setFamilyRelation,
    dementiaCount,
    setDementiaCount,
    selectedRiskFactors,
    toggleRiskFactor,
    selectedComorbidities,
    toggleComorbidity,
    medicationsInput,
    setMedicationsInput,
    medicationsList,
    addMedication,
    removeMedication,
    mmseScore,
    setMmseScore,
    mocaScore,
    setMocaScore,
    cdrScore,
    setCdrScore,
    cdrtotScore,
    setCdrtotScore,
    scanType,
    setScanType,
    scanDate,
    setScanDate,
    radiologistNotes,
    setRadiologistNotes,
    customFileUploaded,
    setCustomFileUploaded,
    simulationPercentage,
    simulationRunning,
    terminalLogs,
    predictionResponse,
    isCreatingPatient: createPatientMutation.isPending,
    isPredicting: predictMutation.isPending,
    isWorkflowBusy: createPatientMutation.isPending || predictMutation.isPending,
    handleNextStep,
    runAIPipeline,
    submitWorkflow,
  };
}
