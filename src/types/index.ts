/**
 * NeuroPredict AI - Shared clinical domain types
 */

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  mrn: string; // Medical Record Number
  riskScore: number; // 0 - 100
  riskCategory: 'High' | 'Moderate' | 'Low';
  lastEvaluated: string;
  status: 'Completed' | 'Pending Interpretation' | 'Awaiting MRI';
}

export interface PatientDemographics {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  mrn: string;
  dob: string;
  phone: string;
  email: string;
  educationYears: number;
}

export interface ClinicalHistory {
  symptoms: string[];
  familyHistory: {
    alzheimersRelation: string[]; // e.g., "Mother", "Maternal Grandfather"
    dementiaCount: number;
  };
  riskFactors: string[]; // e.g., "ApoE4 positive", "Hypertension", "Cardiovascular"
  comorbidities: string[]; // e.g., "Type 2 Diabetes", "Hypercholesterolemia"
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
    score: number; // Clinical Dementia Rating (0, 0.5, 1, 2, 3)
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
  hippocampalVolumeLeft: number; // in cm3
  hippocampalVolumeRight: number; // in cm3
  ventricleEnlargementRatio: number; // ratio
  corticalThicknessAvg: number; // in mm
  findings: string[];
}

export interface AIAnalysisResult {
  patientId: string;
  predictionDate: string;
  probability: number; // 0.0 - 1.0 (e.g. 0.78)
  riskCategory: 'High' | 'Moderate' | 'Low';
  confidenceScore: number; // 0.0 - 1.0 (e.g. 0.94)
  explainability: {
    shapAttributions: {
      featureName: string;
      attributionValue: number; // Positive = pushes risk up, Negative = pushes risk down
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
