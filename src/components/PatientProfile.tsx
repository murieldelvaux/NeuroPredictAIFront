/**
 * NeuroPredict AI - Clinical Patient Profile Analyzer
 */
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Dna, 
  Activity, 
  FileText, 
  Brain, 
  Sliders, 
  Upload, 
  Sparkles, 
  AlertTriangle, 
  Compass, 
  User, 
  CheckCircle,
  FileSpreadsheet,
  TrendingUp,
  Cpu,
  Bookmark,
  ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine,
  Cell
} from 'recharts';
import { 
  Patient, 
  PatientDemographics, 
  ClinicalHistory, 
  CognitiveEvaluation, 
  ImagingExam, 
  ImagingAnalysisResult, 
  AIAnalysisResult 
} from '../types';

interface PatientProfileProps {
  patientRecord: {
    patient: Patient;
    demographics: PatientDemographics;
    history: ClinicalHistory;
    cognitive: CognitiveEvaluation;
    exam?: ImagingExam;
    imagingAnalysis?: ImagingAnalysisResult;
    aiAnalysis?: AIAnalysisResult;
  };
  onBack: () => void;
}

export default function PatientProfile({ patientRecord, onBack }: PatientProfileProps) {
  const { patient, demographics, history, cognitive, exam, imagingAnalysis, aiAnalysis } = patientRecord;
  const [activeTab, setActiveTab] = useState<'clinical' | 'imaging' | 'ai'>('clinical');
  const [sliceDepth, setSliceDepth] = useState<number>(45);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [mriUploading, setMriUploading] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // Cognitive Score evolution helper for charts
  const historySeries = cognitive.history.map(item => ({
    name: item.date,
    MMSE: item.mmse,
    MoCA: item.moca,
    CDR: item.cdr * 10 // scale CDR by 10 for better visualization on same axis
  }));

  // SHAP explanatory factor series helper for charts
  const shapData = aiAnalysis?.explainability.shapAttributions.map(item => ({
    name: item.featureName,
    value: Math.round(item.attributionValue * 100), // convert to percentage points
    category: item.category
  })) || [];

  // MRI scan simulation visualizer
  const renderInteractiveScan = () => {
    // Generate a beautiful, clinical circular scan slice depending on slice depth and heatmap toggles
    const radius = 60 + sliceDepth * 0.4; // dynamic size based on slider
    const contrastValue = 0.8 + (sliceDepth / 200);

    return (
      <div className="relative w-full aspect-square max-w-[340px] mx-auto bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden shadow-inner" id="mri-interactive-console">
        {/* Alignment concentric grids */}
        <div className="absolute inset-2 border border-slate-900 rounded-full pointer-events-none"></div>
        <div className="absolute inset-8 border border-slate-900/40 rounded-full pointer-events-none"></div>
        <div className="absolute inset-16 border border-slate-900/20 rounded-full pointer-events-none"></div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none mb-2">
          <div className="w-[1px] h-full bg-slate-900/30"></div>
          <div className="h-[1px] w-full bg-slate-900/30"></div>
        </div>

        {/* Digital display overlays */}
        <span className="absolute top-4 left-4 font-mono text-[9px] text-teal-500 font-semibold uppercase tracking-wider" id="mri-param-left">
          FLAIR_3D_CORONAL
        </span>
        <span className="absolute top-4 right-4 font-mono text-[9px] text-emerald-400" id="mri-param-right">
          SLICE_POS_Z: {sliceDepth}%
        </span>
        <span className="absolute bottom-4 left-4 font-mono text-[9px] text-slate-500">
          CON: {contrastValue.toFixed(2)}x
        </span>
        <span className="absolute bottom-4 right-4 font-mono text-[9px] text-slate-500">
          VOX_SIZE: 0.9 x 0.9 x 0.9 mm
        </span>

        {/* CSS Brain structures generator based on variables */}
        <div 
          className="relative rounded-full bg-slate-900/80 transition-all duration-150 flex items-center justify-center"
          style={{
            width: `${radius * 2}px`,
            height: `${radius * 2}px`,
            boxShadow: `inset 0 0 40px rgba(255,255,255,${0.04 * contrastValue})`,
            border: `2px solid rgba(255,255,255,${0.12 * contrastValue})`
          }}
          id="brain-contour-root"
        >
          {/* Inner temporal lobe shapes */}
          <div 
            className="absolute rounded-full border border-slate-700/40 transition-all duration-150"
            style={{
              width: `${radius * 1.3}px`,
              height: `${radius * 0.9 * (1.1 - sliceDepth/250)}px`,
              transform: 'rotate(-12deg)',
              background: 'radial-gradient(ellipse at center, rgba(30,41,59,0.3) 0%, rgba(15,23,42,0.9) 100%)'
            }}
          ></div>

          {/* Symmetrical left/right ventricles */}
          <div 
            className="absolute transition-all duration-150 border-t border-slate-600/40"
            style={{
              width: `${radius * 0.45}px`,
              height: `${radius * 0.35 + (sliceDepth % 15) * 0.5}px`,
              left: `${radius * 0.4}px`,
              top: `${radius * 0.65}px`,
              borderRadius: '60% 40% 41% 41% / 60% 40% 60% 40%',
              backgroundColor: '#020617',
              boxShadow: 'inset 0 0 10px rgba(255,255,255,0.05)'
            }}
          ></div>
          <div 
            className="absolute transition-all duration-150 border-t border-slate-600/40"
            style={{
              width: `${radius * 0.45}px`,
              height: `${radius * 0.35 + (sliceDepth % 15) * 0.5}px`,
              right: `${radius * 0.4}px`,
              top: `${radius * 0.65}px`,
              borderRadius: '40% 60% 41% 41% / 40% 60% 40% 60%',
              backgroundColor: '#020617',
              boxShadow: 'inset 0 0 10px rgba(255,255,255,0.05)'
            }}
          ></div>

          {/* Symmetrical Left/Right Hippocampus nodes */}
          <div 
            className={`absolute rounded-full transition-all duration-150 ${
              showHeatmap ? 'bg-rose-500/20 border-rose-500/50' : 'bg-slate-800 border-slate-700'
            } border`}
            style={{
              width: `${radius * 0.25}px`,
              height: `${radius * 0.4}px`,
              left: `${radius * 0.65}px`,
              top: `${radius * 1.1}px`,
              transform: 'rotate(-25deg)'
            }}
          >
            {showHeatmap && <span className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-15"></span>}
          </div>
          <div 
            className={`absolute rounded-full transition-all duration-150 ${
              showHeatmap ? 'bg-rose-500/20 border-rose-500/50' : 'bg-slate-800 border-slate-700'
            } border`}
            style={{
              width: `${radius * 0.25}px`,
              height: `${radius * 0.4}px`,
              right: `${radius * 0.65}px`,
              top: `${radius * 1.1}px`,
              transform: 'rotate(25deg)'
            }}
          >
            {showHeatmap && <span className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-15"></span>}
          </div>

          {/* AI Volumetric heat map overlay */}
          {showHeatmap && (
            <div 
              className="absolute bg-teal-500/10 border border-teal-400/30 rounded-xl transition-all duration-200"
              style={{
                width: `${radius * 1.1}px`,
                height: `${radius * 0.22}px`,
                top: `${radius * 0.4}px`,
                filter: 'blur(3px)'
              }}
            ></div>
          )}

          {/* Center reference core */}
          <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse opacity-75"></div>
        </div>
      </div>
    );
  };

  // Simulated MRI file drop
  const handleFileUploadSimulated = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMriUploading(true);
      setTimeout(() => {
        setMriUploading(false);
        setUploadedFile(file.name);
      }, 1500);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in" id={`patient-view-root-${patient.id}`}>
      {/* Back to list and Name display */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-3 gap-3" id="view-file-header-panel">
        <div className="flex items-start space-x-3">
          <button
            id="btn-back-to-queue"
            onClick={onBack}
            className="p-2 bg-white border border-slate-200 hover:border-slate-300 rounded-md text-slate-750 shadow-xs cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-800" id="profile-patient-name">
                {demographics.name}
              </h2>
              <span className="text-[10px] font-mono bg-sky-500/10 text-sky-800 font-bold px-1.5 py-0.5 rounded border border-sky-500/20">
                {demographics.mrn}
              </span>
            </div>
            
            {/* Demographics details pill list */}
            <div className="flex flex-wrap items-center gap-y-0.5 gap-x-3 mt-1 text-xs font-semibold text-slate-550" id="profile-demographics-pills">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                <span>{demographics.gender}</span>
              </span>
              <span className="text-slate-200">|</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Born {demographics.dob} ({demographics.age} y/o)</span>
              </span>
              <span className="text-slate-200">|</span>
              <span className="flex items-center gap-1">
                <Bookmark className="w-3 h-3 text-slate-400" />
                <span>Edu: {demographics.educationYears} Years</span>
              </span>
            </div>
          </div>
        </div>

        {/* Global Prognosis Card summarizing diagnostic parameters */}
        <div className="bg-white border border-slate-200 rounded-md px-4 py-2 flex items-center space-x-3 shadow-xs" id="header-clinical-risk-panel">
          <div>
            <span className="text-[9px] text-slate-400 font-mono block uppercase font-bold tracking-wider">AI Prognosis Factor</span>
            <div className="flex items-center space-x-1 mt-0.5" id="header-clinical-risk-score">
              <span className={`w-1.5 h-1.5 rounded-full ${
                patient.riskCategory === 'High' ? 'bg-rose-500 animate-pulse' : patient.riskCategory === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}></span>
              <span className="text-sm font-bold text-slate-800">
                {patient.status === 'Awaiting MRI' ? "Pending" : `${patient.riskScore}% risk`}
              </span>
            </div>
          </div>
          <div className="h-6 w-[1px] bg-slate-100"></div>
          <div>
            <span className="text-[9px] text-slate-400 font-mono block uppercase font-bold tracking-wider">Model Class</span>
            <span className={`text-[10px] font-bold block mt-0.5 px-1.5 py-0.5 rounded ${
              patient.riskCategory === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-100' : patient.riskCategory === 'Moderate' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            }`}>
              {patient.status === 'Awaiting MRI' ? "Incomplete" : `${patient.riskCategory} Risk`}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs list controls */}
      <div className="flex border-b border-slate-200" id="profile-tabs-wrapper">
        <button
          id="btn-tab-clinical-profile"
          onClick={() => setActiveTab('clinical')}
          className={`flex items-center space-x-1.5 px-4 py-2 border-b-2 font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'clinical' 
              ? 'border-sky-600 text-sky-600' 
              : 'border-transparent text-slate-500 hover:text-slate-850'
          }`}
        >
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span>Cognitive & History</span>
        </button>

        <button
          id="btn-tab-neuroimaging"
          onClick={() => setActiveTab('imaging')}
          className={`flex items-center space-x-1.5 px-4 py-2 border-b-2 font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'imaging' 
              ? 'border-sky-600 text-sky-600' 
              : 'border-transparent text-slate-500 hover:text-slate-850'
          }`}
        >
          <Brain className="w-3.5 h-3.5 shrink-0" />
          <span>Neuroimaging (MRI)</span>
        </button>

        <button
          id="btn-tab-explainable-ai"
          onClick={() => setActiveTab('ai')}
          className={`flex items-center space-x-1.5 px-4 py-2 border-b-2 font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'ai' 
              ? 'border-sky-600 text-sky-600' 
              : 'border-transparent text-slate-500 hover:text-slate-850'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-500" />
          <span>Explainable AI (SHAP)</span>
        </button>
      </div>

      {/* RENDER ACTIVE TAB */}

      {/* TAB 1: Clinical History & Cognitive Scores */}
      {activeTab === 'clinical' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" id="panel-clinical-root">
          {/* Main clinical columns (left & center) */}
          <div className="lg:col-span-2 space-y-4" id="clinical-left-column">
            
            {/* Cognitive assessment cards */}
            <div id="cognitive-assessment-segment" className="space-y-2">
              <h3 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <Sliders className="w-4 h-4 text-sky-600" />
                <span>Baseline Neuropsychological Assessments</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="cognitive-cards-container">
                {/* MMSE Card */}
                <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs" id="card-cog-mmse">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">MMSE Score</span>
                    <span className="text-[9px] bg-slate-100 text-slate-505 font-mono px-1 py-0.5 rounded">Max 30</span>
                  </div>
                  <div className="mt-2 flex items-baseline space-x-1.5">
                    <span className="text-2xl font-bold text-slate-850">{cognitive.mmse.score}</span>
                    <span className="text-slate-400 text-xs">/ 30</span>
                  </div>
                  <p className={`text-[10px] font-bold mt-2 inline-block px-1.5 py-0.5 rounded ${
                    cognitive.mmse.score >= 25 ? 'bg-emerald-50 text-emerald-700' : cognitive.mmse.score >= 15 ? 'bg-amber-50 text-amber-750' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {cognitive.mmse.status}
                  </p>
                </div>

                {/* MoCA Card */}
                <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs" id="card-cog-moca">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">MoCA Score</span>
                    <span className="text-[9px] bg-slate-100 text-slate-505 font-mono px-1 py-0.5 rounded">Max 30</span>
                  </div>
                  <div className="mt-2 flex items-baseline space-x-1.5">
                    <span className="text-2xl font-bold text-slate-850">{cognitive.moca.score}</span>
                    <span className="text-slate-400 text-xs">/ 30</span>
                  </div>
                  <p className={`text-[10px] font-bold mt-2 inline-block px-1.5 py-0.5 rounded ${
                    cognitive.moca.score >= 25 ? 'bg-emerald-50 text-emerald-700' : cognitive.moca.score >= 15 ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {cognitive.moca.status}
                  </p>
                </div>

                {/* CDR Clinical Dementia Rating Card */}
                <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs" id="card-cog-cdr">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CDR Core Index</span>
                    <span className="text-[9px] bg-slate-100 text-slate-505 font-mono px-1 py-0.5 rounded">Scale 0-3</span>
                  </div>
                  <div className="mt-2 flex items-baseline space-x-1.5">
                    <span className="text-2xl font-bold text-slate-850">{cognitive.cdr.score}</span>
                    <span className="text-slate-400 text-xs">/ 3.0</span>
                  </div>
                  <p className={`text-[10px] font-bold mt-2 inline-block px-1.5 py-0.5 rounded ${
                    cognitive.cdr.score === 0 ? 'bg-emerald-50 text-emerald-700' : cognitive.cdr.score === 0.5 ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {cognitive.cdr.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Historical Score Progression Chart */}
            <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs" id="cognitive-history-graph-card">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-1">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Historical Evolution Timeline</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Chronological tracking of clinical score conversions.</p>
                </div>
                <div className="flex items-center space-x-2.5 text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-0.5 bg-blue-600 inline-block"></span>
                    <span>MMSE</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-0.5 bg-sky-500 inline-block"></span>
                    <span>MoCA</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-1 border border-pink-500 bg-pink-500/10 inline-block"></span>
                    <span>CDR (x10)</span>
                  </span>
                </div>
              </div>

              <div className="h-44 filter drop-shadow-xs" id="cognitive-history-chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historySeries} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontStyle="italic" />
                    <YAxis domain={[0, 32]} stroke="#94a3b8" fontSize={9} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '4px', border: 'none', fontSize: '10px' }}
                      itemStyle={{ color: '#0ea5e9' }}
                    />
                    <Line type="monotone" dataKey="MMSE" stroke="#2563eb" strokeWidth={1.5} activeDot={{ r: 4 }} />
                    <Line type="monotone" dataKey="MoCA" stroke="#0ea5e9" strokeWidth={1.5} />
                    <Line type="monotone" dataKey="CDR" stroke="#ec4899" strokeWidth={1.5} strokeDasharray="3 3" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Demographics & Specific clinical indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="clinical-sub-details-grid">
              {/* Symptoms ledger list */}
              <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs" id="card-symptoms-ledger">
                <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2.5">Reported Active Symptoms</h4>
                {history.symptoms.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No symptoms registered in profile.</p>
                ) : (
                  <ul className="space-y-1.5" id="symptoms-list-element">
                    {history.symptoms.map((symptom, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-[11px] text-slate-700">
                        <span className="w-1 h-1 bg-rose-500 rounded-full mt-1.5 shrink-0"></span>
                        <span className="font-semibold leading-tight">{symptom}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Patient core medications */}
              <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs" id="card-medications-ledger">
                <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2.5">Therapeutic Medications Regimen</h4>
                {history.medications.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No prescription regimens declared.</p>
                ) : (
                  <ul className="space-y-1.5" id="medications-list-element">
                    {history.medications.map((med, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-[11px] text-slate-700">
                        <span className="w-1 h-1 bg-sky-500 rounded-full mt-1.5 shrink-0"></span>
                        <span className="font-mono leading-tight">{med}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Family history & Comorbidities */}
          <div className="space-y-4 animate-fade-in" id="clinical-right-column">
            
            {/* Comorbidities ledger */}
            <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs" id="card-comorbidities-ledger">
              <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-500" />
                <span>Comorbidities & System Factors</span>
              </h4>
              {history.comorbidities.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No comorbidities registered.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5" id="comorbidities-chips">
                  {history.comorbidities.map((item, idx) => (
                    <span key={idx} className="bg-indigo-50 text-indigo-800 border border-indigo-100 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Genetics & Heredity risks block */}
            <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs" id="card-genetics-risks">
              <h4 className="text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Dna className="w-4 h-4 text-emerald-500" />
                <span>Genetic Carrier Markers (ApoE)</span>
              </h4>
              
              <div className="space-y-2.5" id="genetics-factor">
                {/* Find if Apoe4 is positive */}
                {history.riskFactors.some(f => f.toLowerCase().includes('apoe4')) ? (
                  <div className="bg-rose-50 border border-rose-100 p-3 rounded-md flex items-start space-x-2.5">
                    <AlertTriangle className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-rose-800">Double Allele ε4/ε4 Flagged</p>
                      <p className="text-[10px] text-rose-605 mt-0.5 leading-tight">
                        Elevated genetic susceptibility to late-onset Alzheimer's pathway conversion confirmed.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-md flex items-start space-x-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-emerald-800">No Carrier Susceptibility</p>
                      <p className="text-[10px] text-emerald-650 mt-0.5 leading-tight">
                        Patient has typical ApoE standard-risk configuration (ε3/ε3). No genetic modifiers are flagged.
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100" id="family-pedigree-summary">
                  <p className="text-[9px] text-slate-400 font-mono tracking-wide uppercase font-bold">Family Pedigree Atrophy</p>
                  <p className="text-xl font-bold text-slate-800 mt-0.5">
                    {history.familyHistory.dementiaCount} <span className="text-xs font-normal text-slate-500">affected relatives</span>
                  </p>
                  
                  {history.familyHistory.alzheimersRelation.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {history.familyHistory.alzheimersRelation.map((rel, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 text-[9px] font-mono px-1.5 py-0.5 rounded">
                          {rel}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Risk Category Summary */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-lg shadow-xs" id="card-clinical-insight">
              <h4 className="text-[10px] font-bold text-sky-450 tracking-wider uppercase">Prognostic Context</h4>
              <p className="text-[11px] leading-relaxed text-slate-300 mt-2">
                This diagnostic dashboard merges multimodality data to determine conversion probability. Ensure all temporal lobe morphological metrics represent solid baseline standards before excluding progression paths.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-450">
                <span>Facility Protocol V2.14</span>
                <span>IEC-62304 Compliant</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: Neuroimaging SUPPORT Console */}
      {activeTab === 'imaging' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4" id="panel-imaging-root">
          
          {/* Interactive console simulator panel (Col span 5) */}
          <div className="lg:col-span-5 space-y-4" id="imaging-left-col">
            <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs" id="card-mri-render-frame">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-850">Virtual Slice Slice-Profiler</h4>
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                  <span className="text-[9px] font-mono font-bold text-slate-400">MONAI Voxel Pipeline</span>
                </div>
              </div>

              {renderInteractiveScan()}

              {/* Simulator UI controllers */}
              <div className="mt-4 space-y-4 border-t border-slate-100 pt-4" id="mri-sim-controllers">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Coronal Cross-Section Depth</span>
                    <span className="text-slate-800 font-mono font-bold">{sliceDepth}%</span>
                  </div>
                  <input
                    id="slider-mri-depth"
                    type="range"
                    min="10"
                    max="90"
                    value={sliceDepth}
                    onChange={(e) => setSliceDepth(parseInt(e.target.value))}
                    className="w-full accent-sky-600 bg-slate-100 rounded-md cursor-pointer h-1.5 border border-slate-200"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 block">AI Morphological Activation Heatmap</span>
                    <span className="text-[10px] text-slate-400">Overlay PyTorch layer features onto neural boundaries.</span>
                  </div>
                  <button
                    id="btn-toggle-mri-heatmap"
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      showHeatmap ? 'bg-sky-600' : 'bg-slate-200'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      showHeatmap ? 'translate-x-5' : 'translate-x-0'
                    }`}></span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Neuroimaging Metadata & Pipeline stats (Col span 7) */}
          <div className="lg:col-span-7 space-y-4" id="imaging-right-col">
            
            {/* MRI status block */}
            <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs" id="card-mri-analytical-factors">
              <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2.5">
                Structured Morphological Extraction
              </h4>

              {imagingAnalysis ? (
                <div className="space-y-4" id="mri-metrics-list">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" id="mri-quantitative-grid">
                    {/* Hippocampal volume L */}
                    <div className="p-3 bg-slate-50 rounded-md border border-slate-200/55">
                      <span className="text-[9px] text-slate-550 block font-bold font-mono">Hippocampal volume L</span>
                      <span className="text-md font-bold text-slate-800 block mt-0.5">
                        {imagingAnalysis.hippocampalVolumeLeft} <span className="text-[10px] font-normal text-slate-500">cm³</span>
                      </span>
                    </div>

                    {/* Hippocampal volume R */}
                    <div className="p-3 bg-slate-50 rounded-md border border-slate-200/55">
                      <span className="text-[9px] text-slate-550 block font-bold font-mono">Hippocampal volume R</span>
                      <span className="text-md font-bold text-slate-800 block mt-0.5">
                        {imagingAnalysis.hippocampalVolumeRight} <span className="text-[10px] font-normal text-slate-500">cm³</span>
                      </span>
                    </div>

                    {/* Ventricular index */}
                    <div className="p-3 bg-slate-50 rounded-md border border-slate-200/55">
                      <span className="text-[9px] text-slate-505 block font-bold font-mono">Ventricle index</span>
                      <span className="text-md font-bold text-slate-800 block mt-0.5">
                        {imagingAnalysis.ventricleEnlargementRatio}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3 space-y-2" id="mri-pathology-findings">
                    <p className="text-[9px] text-slate-400 font-mono tracking-wider uppercase font-bold">Convolutional Features (Voxel Segmentations)</p>
                    {imagingAnalysis.findings.map((find, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-[11px] text-slate-700">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{find}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-8 bg-slate-50 rounded-xl border border-slate-100 text-center text-slate-500" id="mri-no-metrics">
                  <p className="text-xs font-semibold">No extracted morphological features found for active patient file.</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Please utilize the DICOM portal below to complete dataset analysis.</p>
                </div>
              )}
            </div>

            {/* Simulated MRI upload drag area */}
            <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs" id="card-mri-upload-portal">
              <h4 className="text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-2.5">
                Clinical DICOM / NIfTI Imaging Portal
              </h4>

              <div 
                className="border border-dashed border-slate-300 hover:border-sky-500 rounded-md p-6 text-center transition-colors bg-slate-50/50 relative"
                id="dropzone-mri-upload"
              >
                <input
                  id="mri-file-hidden-input"
                  type="file"
                  accept=".nii,.nii.gz,.dcm,.zip"
                  onChange={handleFileUploadSimulated}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                
                {mriUploading ? (
                  <div className="flex flex-col items-center justify-center py-2 space-y-2">
                    <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[11px] font-semibold text-slate-600">Parsing DICOM headers & voxel indices...</span>
                  </div>
                ) : uploadedFile ? (
                  <div className="flex flex-col items-center justify-center space-y-1.5 py-2">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-full">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{uploadedFile}</p>
                      <p className="text-[9px] text-emerald-600 mt-0.5">Voxel structures processed successfully & registered inside PyTorch cache.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-1.5">
                    <div className="p-2 bg-slate-100 text-slate-400 rounded-full">
                      <Upload className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-750">Drag or browse local medical files</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">Accepts DICOM folders, NIfTI structural formats (.nii.gz) up to 250MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Exam record logs */}
            {exam && (
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg border border-slate-800 shadow-xs" id="card-mri-scan-metadata">
                <span className="text-[9px] text-sky-450 font-mono tracking-wider uppercase font-bold">Radiologist Clinical Documentation</span>
                <p className="text-xs leading-relaxed text-slate-300 mt-2 italic">
                  "{exam.radiologistNotes}"
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3.5 pt-3.5 border-t border-slate-800 text-[9px] font-mono text-slate-400" id="mri-metadata-list">
                  <div>
                    <span className="font-semibold block text-slate-500">EXAM DATE</span>
                    <span className="text-slate-300 block mt-0.5">{exam.scanDate}</span>
                  </div>
                  <div>
                    <span className="font-semibold block text-slate-500">STRENGTH</span>
                    <span className="text-slate-300 block mt-0.5">{exam.metadata.magneticStrength || "3.0T"}</span>
                  </div>
                  <div>
                    <span className="font-semibold block text-slate-500">SLICE_THICKNESS</span>
                    <span className="text-slate-300 block mt-0.5">{exam.metadata.sliceThickness}</span>
                  </div>
                  <div>
                    <span className="font-semibold block text-slate-500">TYPE</span>
                    <span className="text-slate-300 block mt-0.5">{exam.scanType}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* TAB 3: Explainable AI Analytics Panel */}
      {activeTab === 'ai' && (
        <div className="space-y-4" id="panel-ai-explainability-root">
          
          {/* Main Risk Prediction Gauge Section */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs" id="ai-prediction-dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center" id="ai-factors-header-layer">
              {/* Left Circular Risk Level gauge indicator */}
              <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200" id="ai-risk-gauge-container">
                <span className="text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase">Alzheimer's Conversion Path</span>
                <div className="relative w-32 h-32 mx-auto mt-4 flex items-center justify-center bg-white rounded-full border border-slate-200 shadow-xs" id="ai-percentage-dial">
                  {/* Decorative outer gradient frame ring */}
                  <div className="absolute inset-1.5 rounded-full border border-slate-100"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      {aiAnalysis ? `${Math.round(aiAnalysis.probability * 100)}%` : "N/A"}
                    </span>
                    <span className={`text-[9px] font-bold tracking-wider mt-1 px-2 py-0.5 rounded-full ${
                      patient.riskCategory === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-200' : patient.riskCategory === 'Moderate' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      {patient.riskCategory || "Low"} Risk
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-1.5 mt-3 text-[10px] font-mono text-slate-500">
                  <Cpu className="w-3.5 h-3.5 text-sky-600" />
                  <span>Dual-Core Neural Fusion Model</span>
                </div>
              </div>

              {/* Middle segment: reasoning summary paragraph and parameters */}
              <div className="lg:col-span-2 space-y-3" id="ai-reasoning-verbal-summary">
                <div className="flex items-center space-x-2" id="ai-confidence-indicator">
                  <span className="text-xs font-semibold text-slate-500 font-sans">Network Confidence Index:</span>
                  <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded-md border border-sky-100">
                    {aiAnalysis ? `${Math.round(aiAnalysis.confidenceScore * 100)}% Confidence` : "N/A"}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-slate-900 font-sans">Explainable AI Attributions Summary</h3>
                <p className="text-xs text-slate-650 leading-relaxed font-medium bg-slate-50/70 p-3 rounded-lg border border-slate-200/60">
                  {aiAnalysis?.explainability?.aiReasoningSummary || "Complete clinical information and diagnostic neuroimaging datasets are required before finalizing the explainability attributions metrics."}
                </p>

                <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                  <Compass className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Note: This is an AI clinical support platform – final diagnostics must be determined by clinical providers.</span>
                </div>  </div>
              </div>
            </div>
                    {/* Feature influence SHAP graph panel */}
          {aiAnalysis && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" id="ai-detailed-scoring-grid">
              {/* Left Bar Graph (Feature contributions SHAP value visualization) */}
              <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs" id="shap-bar-chart-card">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Variables Influence Attributes</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Primary variables pulling predicted risk up (+) or keeping risk levels baseline (-)</p>
                </div>

                <div className="h-60 mt-3.5 filter drop-shadow-xs" id="shap-chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={shapData}
                      layout="vertical"
                      margin={{ top: 2, right: 10, left: 10, bottom: 2 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} stroke="#f8fafc" />
                      <XAxis type="number" stroke="#94a3b8" fontSize={9} domain={[-20, 40]} />
                      <YAxis dataKey="name" type="category" stroke="#0f172a" fontSize={9} width={110} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '6px', border: 'none', fontSize: '10px' }}
                      />
                      <ReferenceLine x={0} stroke="#475569" strokeWidth={1} />
                      <Bar dataKey="value" strokeWidth={1}>
                        {shapData.map((entry, index) => {
                          const isPositive = entry.value > 0;
                          return (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={isPositive ? 'rgba(239, 68, 68, 0.85)' : 'rgba(16, 185, 129, 0.85)'} 
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Side: Key risk factors vs. Protective factors */}
              <div className="space-y-4" id="clinical-factor-columns">
                {/* Specific contributing risks list */}
                <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-lg shadow-xs" id="card-ai-risk-drivers">
                  <h4 className="text-[10px] font-bold text-rose-850 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                    <span>High Risk Drivers Identified</span>
                  </h4>
                  <ul className="space-y-1.5" id="risk-drivers-list">
                    {aiAnalysis.explainability.keyRiskDrivers.map((driver, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-[11px] text-rose-950 font-medium">
                        <span className="text-rose-500 mt-0.5">•</span>
                        <span>{driver}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specific protective parameters list */}
                <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-lg shadow-xs" id="card-ai-protective-drivers">
                  <h4 className="text-[10px] font-bold text-emerald-850 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <span>⚡ Protective Proportions Flagged</span>
                  </h4>
                  <ul className="space-y-1.5" id="protective-drivers-list">
                    {aiAnalysis.explainability.protectiveFactors.map((prot, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-[11px] text-emerald-950 font-medium">
                        <span className="text-emerald-550 mt-0.5">•</span>
                        <span>{prot}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
