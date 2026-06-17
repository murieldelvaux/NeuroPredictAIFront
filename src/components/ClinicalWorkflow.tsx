/**
 * NeuroPredict AI - Clinical Workflow Wizard Step-by-Step
 */
import React, { useState } from 'react';
import { 
  User, 
  FileText, 
  Sliders, 
  Brain, 
  Cpu, 
  Grid, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle,
  Activity,
  AlertCircle,
  HelpCircle,
  Clock,
  Terminal
} from 'lucide-react';
import { PatientDemographics, ClinicalHistory } from '../types';

interface ClinicalWorkflowProps {
  onSave: (data: {
    demographics: Omit<PatientDemographics, 'id'>;
    history: ClinicalHistory;
    cognitive: { mmse: number; moca: number; cdr: number };
    imaging?: { scanType: string; scanDate: string; radiologistNotes: string; fileUploaded?: string };
  }) => void;
  isSaving: boolean;
  onCancel: () => void;
}

export default function ClinicalWorkflow({ onSave, isSaving, onCancel }: ClinicalWorkflowProps) {
  const [step, setStep] = useState<number>(1);

  // STEP 1 State: Demographics
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState<number>(70);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [dob, setDob] = useState('1956-06-20');
  const [mrn, setMrn] = useState(`MRN-${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(10 + Math.random() * 89)}Z`);
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

  // STEP 4 State: Imaging Details
  const [scanType, setScanType] = useState<'MRI 3T' | 'PET-FDG' | 'CT Scan'>('MRI 3T');
  const [scanDate, setScanDate] = useState('2026-06-10');
  const [radiologistNotes, setRadiologistNotes] = useState('Subcortical vascular parameters are constant. No distinct cortical anomalies reported.');
  const [customFileUploaded, setCustomFileUploaded] = useState<string | null>(null);

  // STEP 5 State: AI Analysis Simulation & Terminal logs
  const [simulationPercentage, setSimulationPercentage] = useState<number>(0);
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  // Helpers for list additions
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

  // Run Simulated PyTorch & MONAI diagnostics pipeline
  const runAIPipeline = () => {
    setSimulationRunning(true);
    setSimulationPercentage(10);
    setTerminalLogs([
      "[SYSTEM] Initializing clinical telemetry handshake...",
      "[SYSTEM] Merging Patient Demographics: Age 70, Education 14y.",
      `[DATABASE] Registered diagnostic target under ${mrn}`
    ]);

    const steps = [
      { p: 25, log: "[CORE] Parsing MMSE (24) vs MoCA (22) cognitive scales..." },
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
          setStep(6); // automatically transition to Results Review!
        }
      }, (index + 1) * 800);
    });
  };

  // Steps headers for stepper component
  const stepsMetadata = [
    { num: 1, label: 'Patient Information', icon: User },
    { num: 2, label: 'Clinical History', icon: FileText },
    { num: 3, label: 'Cognitive Tests', icon: Sliders },
    { num: 4, label: 'Imaging Details', icon: Brain },
    { num: 5, label: 'AI Processor Request', icon: Cpu },
    { num: 6, label: 'Results Review', icon: Grid }
  ];

  const handleCreateAndSave = () => {
    onSave({
      demographics: {
        name: `${firstName} ${lastName}`.trim() || "Anonymous Patient",
        age,
        gender,
        mrn,
        dob,
        phone: "(555) 019-2091",
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@healthops.org`,
        educationYears
      },
      history: {
        symptoms: symptomsList,
        familyHistory: {
          alzheimersRelation: hasFamilyHistory ? [familyRelation] : [],
          dementiaCount: hasFamilyHistory ? dementiaCount : 0
        },
        riskFactors: selectedRiskFactors,
        comorbidities: selectedComorbidities,
        medications: medicationsList
      },
      cognitive: {
        mmse: mmseScore,
        moca: mocaScore,
        cdr: cdrScore
      },
      imaging: {
        scanType,
        scanDate,
        radiologistNotes,
        fileUploaded: customFileUploaded || undefined
      }
    });
  };

  return (
    <div className="space-y-8 bg-white border border-slate-200 p-8 rounded-2xl shadow-xs" id="workflow-wizard-wrapper">
      
      {/* Header bar and button */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-5" id="workflow-header-panel">
        <div>
          <h2 className="text-xl font-display font-semibold text-slate-900 tracking-tight">Active Patient Acquisition Intake</h2>
          <p className="text-xs text-slate-500 mt-1">Guided multimodality data ingestion matching HIPAA rules.</p>
        </div>
        <button
          id="btn-cancel-acquisition"
          onClick={onCancel}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 cursor-pointer"
        >
          Abandon Evaluation
        </button>
      </div>

      {/* Stepper progress indicator list */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 pb-4" id="workflow-progress-stepper">
        {stepsMetadata.map((stepMeta) => {
          const Icon = stepMeta.icon;
          const isDone = step > stepMeta.num;
          const isActive = step === stepMeta.num;

          return (
            <div 
              key={stepMeta.num}
              className={`p-3.5 rounded-xl border flex items-center space-x-2.5 transition-all text-left ${
                isActive 
                  ? 'border-slate-900 bg-slate-900 text-teal-400 font-bold' 
                  : isDone 
                    ? 'border-emerald-200 bg-emerald-500/5 text-emerald-700' 
                    : 'border-slate-100 bg-slate-50/50 text-slate-400'
              }`}
              id={`stepper-node-${stepMeta.num}`}
            >
              <div className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center font-bold font-mono ${
                isActive ? 'bg-teal-400 text-slate-950' : isDone ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {stepMeta.num}
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-mono leading-none font-bold uppercase tracking-wide">Step {stepMeta.num}</p>
                <p className="text-xs font-semibold mt-0.5 truncate max-w-[100px] text-current">{stepMeta.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* STEP 1: Demographics */}
      {step === 1 && (
        <div className="space-y-6" id="workflow-step-one">
          <div className="flex items-center space-x-2 text-slate-700 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-teal-600" />
            <h3 className="font-semibold text-base">Step 1: Patient Demographic Variables</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="demographics-form-fields">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5" htmlFor="input-first-name">FIRST NAME</label>
              <input
                id="input-first-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Arthur"
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500/25 focus:bg-white font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5" htmlFor="input-last-name">LAST NAME</label>
              <input
                id="input-last-name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Pendelton"
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500/25 focus:bg-white font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5" htmlFor="input-age">AGE (YEARS)</label>
              <input
                id="input-age"
                type="number"
                min="50"
                max="110"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500/25 focus:bg-white font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5" htmlFor="select-gender">BIOLOGICAL GENDER</label>
              <select
                id="select-gender"
                value={gender}
                onChange={(e: any) => setGender(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500/25 focus:bg-white font-semibold"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5" htmlFor="input-dob">DATE OF BIRTH</label>
              <input
                id="input-dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500/25 focus:bg-white font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5" htmlFor="input-education">FORMAL EDUCATION YEARS</label>
              <input
                id="input-education"
                type="number"
                min="0"
                max="30"
                value={educationYears}
                onChange={(e) => setEducationYears(parseInt(e.target.value))}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500/25 focus:bg-white font-semibold"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Clinical History */}
      {step === 2 && (
        <div className="space-y-6" id="workflow-step-two">
          <div className="flex items-center space-x-2 text-slate-700 border-b border-slate-100 pb-3">
            <FileText className="w-5 h-5 text-teal-600" />
            <h3 className="font-semibold text-base">Step 2: Medical Symptoms & Risk Profilers</h3>
          </div>

          <div className="space-y-6" id="clinical-history-form">
            {/* Symptoms lists inputs */}
            <div id="wrapper-symptoms-input-block">
              <label className="text-xs font-bold text-slate-500 block mb-1.5" htmlFor="input-symptom-tag">PRESENTING SYMPTOMS</label>
              <div className="flex gap-2">
                <input
                  id="input-symptom-tag"
                  type="text"
                  placeholder="e.g. Mild spatial disorientation, difficulty naming standard animals..."
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  className="flex-1 bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500/25 focus:bg-white font-semibold"
                />
                <button
                  id="btn-add-symptom"
                  type="button"
                  onClick={addSymptom}
                  className="bg-slate-900 text-white rounded-xl px-4 text-xs font-bold hover:bg-slate-800"
                >
                  Add
                </button>
              </div>

              {symptomsList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3" id="added-symptoms-chips">
                  {symptomsList.map((tag, i) => (
                    <span key={i} className="bg-slate-100 text-slate-800 px-2.5 py-1 text-[11px] font-bold rounded-lg flex items-center space-x-1.5 border border-slate-200">
                      <span>{tag}</span>
                      <button id={`btn-del-symptom-${i}`} onClick={() => removeSymptom(i)} className="text-slate-400 hover:text-red-600 font-bold">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Genetics Heredity checkbox */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="history-checkbox-grid">
              
              {/* Risk list checkboxes */}
              <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/20" id="card-genetic-selections">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">ApoE Biomarker configuration</span>
                <div className="space-y-2">
                  {[
                    "ApoE4 positive (ε3/ε4)",
                    "ApoE4 positive (ε4/ε4)",
                    "Family history of early onset AD",
                    "Sedentary lifestyle habits"
                  ].map(f => (
                    <label key={f} className="flex items-center space-x-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedRiskFactors.includes(f)}
                        onChange={() => toggleRiskFactor(f)}
                        className="rounded accent-slate-900"
                      />
                      <span>{f}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Comorbidities checkboxes */}
              <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/20" id="card-comorbidities-selections">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3">Global Comorbidities</span>
                <div className="space-y-2">
                  {[
                    "Hypertension",
                    "Type 2 Diabetes mellitus",
                    "Hypercholesterolemia",
                    "Chronic Kidney Disease"
                  ].map(c => (
                    <label key={c} className="flex items-center space-x-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedComorbidities.includes(c)}
                        onChange={() => toggleComorbidity(c)}
                        className="rounded accent-slate-900"
                      />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Meds details list */}
            <div id="wrapper-medications-input-block">
              <label className="text-xs font-bold text-slate-500 block mb-1.5" htmlFor="input-med-tag">PRESCRIBED MEDICATIONS</label>
              <div className="flex gap-2">
                <input
                  id="input-med-tag"
                  type="text"
                  placeholder="e.g. Donepezil 10mg once daily at bedtime..."
                  value={medicationsInput}
                  onChange={(e) => setMedicationsInput(e.target.value)}
                  className="flex-1 bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500/25 focus:bg-white font-semibold"
                />
                <button
                  id="btn-add-medication"
                  type="button"
                  onClick={addMedication}
                  className="bg-slate-900 text-white rounded-xl px-4 text-xs font-bold hover:bg-slate-800"
                >
                  Add
                </button>
              </div>

              {medicationsList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3" id="added-meds-chips">
                  {medicationsList.map((tag, i) => (
                    <span key={i} className="bg-slate-100 text-slate-800 px-2.5 py-1 text-[11px] font-bold rounded-lg flex items-center space-x-1.5 border border-slate-200">
                      <span>{tag}</span>
                      <button id={`btn-del-med-${i}`} onClick={() => removeMedication(i)} className="text-slate-400 hover:text-red-600 font-bold font-mono">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* STEP 3: Cognitive tests scores */}
      {step === 3 && (
        <div className="space-y-6" id="workflow-step-three">
          <div className="flex items-center space-x-2 text-slate-700 border-b border-slate-100 pb-3">
            <Sliders className="w-5 h-5 text-teal-600" />
            <h3 className="font-semibold text-base">Step 3: Quantitative Cognitive Assessments</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="cognitive-scales-fields">
            {/* MMSE */}
            <div className="bg-slate-50/45 border border-slate-200/60 p-6 rounded-2xl" id="input-range-mmse">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700" htmlFor="score-mmse">MMSE SCORE</label>
                <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono">0 - 30</span>
              </div>
              <input
                id="score-mmse"
                type="number"
                min="0"
                max="30"
                value={mmseScore}
                onChange={(e) => setMmseScore(Math.min(30, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold h-11"
              />
              <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                Mini-Mental State Exam. Baseline standards classify &lt;24 as symptomatic.
              </p>
            </div>

            {/* MoCA */}
            <div className="bg-slate-50/45 border border-slate-200/60 p-6 rounded-2xl" id="input-range-moca">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700" htmlFor="score-moca">MOCA SCORE</label>
                <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono">0 - 30</span>
              </div>
              <input
                id="score-moca"
                type="number"
                min="0"
                max="30"
                value={mocaScore}
                onChange={(e) => setMocaScore(Math.min(30, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold h-11"
              />
              <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                Montreal Cognitive Assessment. Highly responsive to initial executive latencies.
              </p>
            </div>

            {/* CDR */}
            <div className="bg-slate-50/45 border border-slate-200/60 p-6 rounded-2xl" id="input-range-cdr">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700" htmlFor="score-cdr">CDR SCORE INDEX</label>
                <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono">Scores: 0, 0.5, 1, 2, 3</span>
              </div>
              <select
                id="score-cdr"
                value={cdrScore}
                onChange={(e: any) => setCdrScore(parseFloat(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold h-11 focus:outline-hidden"
              >
                <option value="0">0.0 (Normal)</option>
                <option value="0.5">0.5 (Very Mild / Prodromal)</option>
                <option value="1">1.0 (Mild Dementia)</option>
                <option value="2">2.0 (Moderate Dementia)</option>
                <option value="3">3.0 (Severe Dementia)</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                Clinical Dementia Rating. Sourced via caregiver semi-structured interviews.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Neuroimaging specifications */}
      {step === 4 && (
        <div className="space-y-6" id="workflow-step-four">
          <div className="flex items-center space-x-2 text-slate-700 border-b border-slate-100 pb-3">
            <Brain className="w-5 h-5 text-teal-600" />
            <h3 className="font-semibold text-base">Step 4: Neuroimaging Modality & Radiologist Records</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="mri-details-formfields">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5" htmlFor="select-scan-type">IMAGE METRICS TYPE</label>
              <select
                id="select-scan-type"
                value={scanType}
                onChange={(e: any) => setScanType(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden font-semibold"
              >
                <option value="MRI 3T">MRI 3.0 Tesla Structural Scan</option>
                <option value="PET-FDG">PET Scan (FDG Metabolic Marker)</option>
                <option value="CT Scan">CT Scan Computed Tomography</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5" htmlFor="imaging-scan-date">SCAN ACQUISITION DATE</label>
              <input
                id="imaging-scan-date"
                type="date"
                value={scanDate}
                onChange={(e) => setScanDate(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden font-semibold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 block mb-1.5" htmlFor="textarea-radiologist-notes">RADIOLOGIST FINDINGS & CLINICAL NOTES</label>
              <textarea
                id="textarea-radiologist-notes"
                rows={4}
                value={radiologistNotes}
                onChange={(e) => setRadiologistNotes(e.target.value)}
                placeholder="Declare initial findings here..."
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden font-semibold"
              ></textarea>
            </div>

            <div className="md:col-span-2 border-2 border-dashed border-slate-200 rounded-xl p-8 hover:border-teal-500 text-center relative" id="wizard-mri-dropzone">
              <input
                id="wizard-mri-inner-input"
                type="file"
                accept=".nii,.nii.gz,.dcm"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setCustomFileUploaded(e.target.files[0].name);
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="text-xs font-extrabold text-slate-700 block">
                {customFileUploaded ? `✓ Attached File: ${customFileUploaded}` : "Browse MRI Voxel Datasets (Optional)"}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">Accepts DICOM folders, NIfTI structural formats (.nii.gz)</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: AI Analysis Simulation */}
      {step === 5 && (
        <div className="space-y-6" id="workflow-step-five">
          <div className="flex items-center space-x-2 text-slate-700 border-b border-slate-100 pb-3">
            <Cpu className="w-5 h-5 text-teal-600" />
            <h3 className="font-semibold text-base">Step 5: Explainable AI Pipeline Trigger</h3>
          </div>

          <div className="flex flex-col items-center justify-center p-8 border border-slate-100 rounded-2xl bg-slate-50/40 text-center" id="ai-processor-action-zone">
            {simulationRunning ? (
              <div className="space-y-4 w-full max-w-sm" id="processor-running-block">
                <div className="w-12 h-12 border-4 border-slate-900 border-t-teal-400 rounded-full animate-spin mx-auto"></div>
                <h4 className="text-sm font-bold text-slate-800">Processing voxel layers & clinical weights...</h4>
                
                {/* Visual loading bar */}
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-slate-900 h-2 rounded-full transition-all duration-300" style={{ width: `${simulationPercentage}%` }}></div>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-500">{simulationPercentage}% Compiled</span>
              </div>
            ) : (
              <div className="space-y-4" id="processor-idle-block">
                <div className="p-4 bg-teal-50 text-teal-700 rounded-full inline-block">
                  <Cpu className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Request Alzheimer's Prognostic Alignment</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  By clicking below, you submit this multimodality intake file to our dual-core PyTorch fusion models. This processes structural voxels and generates SHAP factor importance.
                </p>
                <button
                  id="btn-run-diagnostic-pipeline"
                  onClick={runAIPipeline}
                  className="bg-slate-900 text-teal-400 hover:bg-slate-800 px-6 py-3 rounded-xl text-xs font-bold border border-teal-500/20 cursor-pointer shadow-xs"
                >
                  Confirm and Run Diagnostic Core (PyTorch + MONAI)
                </button>
              </div>
            )}

            {/* Terminal outputs simulator */}
            {terminalLogs.length > 0 && (
              <div className="w-full mt-8 bg-slate-950 text-slate-300 p-5 rounded-xl text-left border border-slate-800 shadow-inner font-mono text-[10px] space-y-1 sm:space-y-1.5" id="pipeline-terminal-box">
                <div className="flex items-center space-x-1.5 text-teal-400 mb-2 border-b border-slate-800 pb-2">
                  <Terminal className="w-3.5 h-3.5" />
                  <span className="font-bold">PYTORCH INTERMEDIARY TERMINAL</span>
                </div>
                {terminalLogs.map((log, i) => (
                  <p key={i} className="leading-relaxed whitespace-pre-wrap">{log}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 6: Results Review & DB Commit */}
      {step === 6 && (
        <div className="space-y-6 animate-fade-in" id="workflow-step-six">
          <div className="flex items-center space-x-2 text-slate-700 border-b border-slate-100 pb-3">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold text-base">Step 6: Confirm Results & Commit Demographics</h3>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-6" id="results-review-dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="review-metrics-split">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">SUBJECT DEMOGRAPHICS</span>
                <p className="text-sm font-bold text-slate-800 mt-2">{firstName} {lastName}</p>
                <p className="text-xs text-slate-500">Born {dob} ({age} years selection) • {gender}</p>
                <p className="text-[11px] text-teal-600 font-mono mt-1">{mrn}</p>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">COGNITIVE INDEX</span>
                <div className="flex items-center space-x-4 mt-2" id="review-cognitive-values">
                  <div className="text-xs text-slate-700">
                    <span className="font-bold block">MMSE:</span>
                    <span>{mmseScore} / 30</span>
                  </div>
                  <div className="text-xs text-slate-700">
                    <span className="font-bold block">MoCA:</span>
                    <span>{mocaScore} / 30</span>
                  </div>
                  <div className="text-xs text-slate-700">
                    <span className="font-bold block">CDR Index:</span>
                    <span>{cdrScore} / 3.0</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200/60 pt-5" id="review-risk-projection-card">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">SIMULATED CLINICAL REPORT INSIGHT</span>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start space-x-3 mt-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-emerald-800">Pipeline Execution Complete</p>
                  <p className="text-[11px] text-emerald-600/90 mt-1 leading-normal">
                    This profile compiles correctly following all department criteria. Retrospective analysis can be re-run at any time. Click Save File to commit to the local registrar queue.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action footer controls */}
      <div className="flex justify-between items-center border-t border-slate-100 pt-6" id="workflow-nav-footer">
        {step > 1 && step < 5 ? (
          <button
            id="btn-step-prev"
            onClick={() => setStep(step - 1)}
            className="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>
        ) : (
          <div></div>
        )}

        {step < 5 ? (
          <button
            id="btn-step-next"
            onClick={() => setStep(step + 1)}
            className="flex items-center space-x-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-5 py-2.5 rounded-xl cursor-pointer"
          >
            <span>Next Segment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : step === 6 ? (
          <button
            id="btn-save-evaluation"
            disabled={isSaving}
            onClick={handleCreateAndSave}
            className="flex items-center space-x-2 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 disabled:bg-slate-200 px-6 py-2.5 rounded-xl cursor-pointer"
          >
            {isSaving ? "Syncing Workspace..." : "Commit and Save Patient"}
          </button>
        ) : (
          <div></div>
        )}
      </div>

    </div>
  );
}

// Sub-icons
function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
    </svg>
  );
}
