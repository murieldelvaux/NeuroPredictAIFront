/**
 * NeuroPredict AI - Shared clinical domain types
 */

export interface Patient {
  id: string;
  name: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  mrn: string;
  riskScore: number; // 0 - 100
  riskCategory: 'High' | 'Moderate' | 'Low';
  lastEvaluated: string;
  status: 'Completed' | 'Pending Interpretation' | 'Awaiting MRI';
}

export interface PatientDemographics {
  id: string;
  name: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  mrn: string;
  dob: string;
  phone: string;
  email: string;
  educationYears: number;
}

export interface ClinicalHistory {
  symptoms: string[];
  familyHistory: {
    alzheimersRelation: string[];
    dementiaCount: number;
  };
  riskFactors: string[];
  comorbidities: string[];
  medications: string[];
}

export interface CognitiveScoreRange {
  score: number;
  maxScore: number;
  status: 'Normal' | 'Mild Cognitive Impairment' | 'Severe';
  assessmentDate: string;
}

export interface CognitiveEvaluation {
  patientId: string;
  mmse: CognitiveScoreRange;
  moca: CognitiveScoreRange;
  cdr: {
    score: number;
    status: string;
    assessmentDate: string;
  };
  history: {
    date: string;
    mmse: number;
    moca: number;
    cdr: number;
  }[];
}

export interface ImagingExam {
  id: string;
  scanType: 'MRI 3T' | 'PET-FDG' | 'CT Scan';
  scanDate: string;
  radiologistNotes: string;
  status: 'Completed' | 'Pending AI Processing' | 'Artifact Detected';
  metadata: {
    magneticStrength?: string;
    sliceThickness: string;
    repetitionTime?: string;
    echoTime?: string;
  };
}

export interface ImagingAnalysisResult {
  scanId: string;
  status: 'Success' | 'Processing' | 'Failed';
  hippocampalVolumeLeft: number;
  hippocampalVolumeRight: number;
  ventricleEnlargementRatio: number;
  corticalThicknessAvg: number;
  findings: string[];
}

export interface AIAnalysisResult {
  patientId: string;
  predictionDate: string;
  probability: number;
  riskCategory: 'High' | 'Moderate' | 'Low';
  confidenceScore: number;
  explainability: {
    shapAttributions: {
      featureName: string;
      attributionValue: number;
      category: 'Cognitive' | 'Imaging' | 'Clinical' | 'Demographic';
    }[];
    aiReasoningSummary: string;
    keyRiskDrivers: string[];
    protectiveFactors: string[];
  };
}

export interface MedicalWorkflowSession {
  currentStep: number;
  patientDemographics?: Partial<PatientDemographics>;
  clinicalHistory?: Partial<ClinicalHistory>;
  cognitiveScores?: {
    mmse: number;
    moca: number;
    cdr: number;
  };
  imagingInfo?: {
    scanType: string;
    scanDate: string;
    radiologistNotes: string;
    fileUploaded?: string;
  };
}

/**
 * Aggregate type returned by usePatient — combines the core Patient
 * record with all related clinical sub-documents.
 */
export interface PatientRecord {
  patient: Patient;
  demographics?: PatientDemographics;
  history?: ClinicalHistory;
  cognitive?: CognitiveEvaluation;
  exam?: ImagingExam;
  imagingAnalysis?: ImagingAnalysisResult;
  aiAnalysis?: AIAnalysisResult | null;
}
