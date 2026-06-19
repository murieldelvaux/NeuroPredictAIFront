// Tipos de domínio interno (UI/estado) — não enviados diretamente ao backend

export type PatientSex = 'M' | 'F';

export type PatientStatus = 'Completed' | 'Pending Interpretation' | 'Awaiting MRI';

export type RiskCategory = 'High' | 'Moderate' | 'Low';

export type Patient = {
  id: string;
  name: string;
  age: number;
  sex: PatientSex;
  mrn: string;
  riskScore: number;
  riskCategory: RiskCategory;
  lastEvaluated: string;
  status: PatientStatus;
};

export type PatientDemographics = {
  id: string;
  name: string;
  age: number;
  sex: PatientSex;
  mrn: string;
  date_of_birth: string;
  phone: string;
  email: string;
};

export type ClinicalHistory = {
  symptoms: string[];
  familyHistory: {
    alzheimersRelation: string[];
    dementiaCount: number;
  };
  riskFactors: string[];
  comorbidities: string[];
  medications: string[];
};

export type CognitiveScoreRange = {
  score: number;
  maxScore: number;
  status: 'Normal' | 'Mild Cognitive Impairment' | 'Severe';
  assessmentDate: string;
};

export type CognitiveEvaluation = {
  patientId: string;
  mmse: CognitiveScoreRange;
  moca: CognitiveScoreRange;
  educationYears: number;
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
};

export type ImagingExam = {
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
};

export type ImagingAnalysisResult = {
  scanId: string;
  status: 'Success' | 'Processing' | 'Failed';
  hippocampalVolumeLeft: number;
  hippocampalVolumeRight: number;
  ventricleEnlargementRatio: number;
  corticalThicknessAvg: number;
  findings: string[];
};

export type PatientRecord = {
  patient: Patient;
  demographics?: PatientDemographics;
  history?: ClinicalHistory;
  cognitive?: CognitiveEvaluation;
  exam?: ImagingExam;
  imagingAnalysis?: ImagingAnalysisResult;
};
