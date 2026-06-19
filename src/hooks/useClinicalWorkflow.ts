import { useState } from 'react';
import type {
  PatientDemographics,
  ClinicalHistory,
  ImagingExam,
  ClinicalDataPayload,
} from '../types';

type WorkflowOnSave = (data: {
  demographics: Omit<PatientDemographics, 'id'>;
  history: ClinicalHistory;
  cognitive: ClinicalDataPayload;
  imaging?: Pick<ImagingExam, 'scanType' | 'scanDate' | 'radiologistNotes'> & { fileUploaded?: string };
}) => void;

export function useClinicalWorkflow(onSave: WorkflowOnSave) {
  const [step, setStep] = useState<number>(1);

  // STEP 1 State: Demographics
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState<number>(70);
  const [sex, setSex] = useState<PatientDemographics['sex']>('M');
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
  const [scanType, setScanType] = useState<ImagingExam['scanType']>('MRI 3T');
  const [scanDate, setScanDate] = useState('2026-06-10');
  const [radiologistNotes, setRadiologistNotes] = useState('Subcortical vascular parameters are constant. No distinct cortical anomalies reported.');
  const [customFileUploaded, setCustomFileUploaded] = useState<string | null>(null);

  // STEP 5 State: AI Analysis Simulation & Terminal logs
  const [simulationPercentage, setSimulationPercentage] = useState<number>(0);
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

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

  const runAIPipeline = () => {
    setSimulationRunning(true);
    setSimulationPercentage(10);
    setTerminalLogs([
      "[SYSTEM] Initializing clinical telemetry handshake...",
      `[SYSTEM] Merging Patient Demographics: Age ${age}, Education ${educationYears}y.`,
      `[DATABASE] Registered diagnostic target under ${mrn}`
    ]);

    const steps = [
      { p: 25, log: "[CORE] Parsing MMSE vs MoCA cognitive scales..." },
      { p: 40, log: "[CORE] Calibrating ApoE biomarker weights..." },
      { p: 60, log: "[IMAGING] Standardizing coronal cross-slices to 256x256 voxel tensor..." },
      { p: 75, log: "[ML-ENGINE] Deploying PyTorch late-onset diagnostic classifier models..." },
      { p: 90, log: "[SHAP] Backpropagating attribution gradients..." },
      { p: 100, log: "[SYSTEM] Diagnostic interpretation matrix finalized successfully." }
    ];

    steps.forEach((stepItem, index) => {
      setTimeout(() => {
        setSimulationPercentage(stepItem.p);
        setTerminalLogs(prev => [...prev, stepItem.log]);
        if (stepItem.p === 100) {
          setSimulationRunning(false);
          setStep(6);
        }
      }, (index + 1) * 800);
    });
  };

  const submitWorkflow = () => {
    onSave({
      demographics: {
        name: `${firstName} ${lastName}`.trim() || "Anonymous Patient",
        age,
        sex,
        mrn,
        date_of_birth,
        phone: "(555) 019-2091",
        email: `${firstName.toLocaleLowerCase()}.${lastName.toLocaleLowerCase()}@healthops.org`,
      },
      history: {
        symptoms: symptomsList,
        familyHistory: {
          alzheimersRelation: hasFamilyHistory ? [familyRelation] : [],
          dementiaCount: hasFamilyHistory ? dementiaCount : 0,
        },
        riskFactors: selectedRiskFactors,
        comorbidities: selectedComorbidities,
        medications: medicationsList,
      },
      cognitive: {
        mmse: mmseScore,
        moca: mocaScore,
        cdr: cdrScore,
        cdrtot: cdrtotScore,
        comorbidities: selectedComorbidities,
        family_history: hasFamilyHistory,
        education_years: educationYears,
      },
      imaging: {
        scanType,
        scanDate,
        radiologistNotes,
        fileUploaded: customFileUploaded || undefined,
      },
    });
  };

  return {
    step,
    setStep,
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
    runAIPipeline,
    submitWorkflow,
  };
}
