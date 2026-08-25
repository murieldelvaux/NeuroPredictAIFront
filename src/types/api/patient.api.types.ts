import type { PredictionResponse } from './prediction.api.types';

// Tipos de API espelhando os schemas do backend.

export type HealthResponse = {
  status: string;
  version: string;
};

export type ValidatedDiagnosisType = 'CN' | 'MCI' | 'DEM' | 'AD';

export type ValidateDiagnosisPayload = {
  diagnosis: 'CN' | 'MCI' | 'DEM';
};

export type CognitiveHistoryItem = {
  date: string;
  mmse?: number | null;
  moca?: number | null;
  cdr?: number | null;
  cdrtot?: number | null;
  notes?: string | null;
};

export type UpdateClinicalDataPayload = {
  assessment_date: string;
  mmse?: number | null;
  moca?: number | null;
  cdr?: number | null;
  cdrtot?: number | null;
  symptoms?: string[];
  medications?: string[];
  comorbidities?: string[];
  biomarkers?: string[];
  family_history?: boolean | null;
  education_years?: number | null;
  notes?: string | null;
};

export type MRIFileMetadata = {
  filename: string;
  content_type: string;
  size: number;
  url?: string | null;
};

export type ClinicalDataPayload = {
  mmse?: number | null;
  moca?: number | null;
  cdr?: number | null;
  cdrtot?: number | null;
  comorbidities: string[];
  biomarkers: string[];
  symptoms: string[];
  medications: string[];
  family_history?: boolean | null;
  education_years?: number | null;
  mri_file?: MRIFileMetadata[] | null;
  cognitive_history?: CognitiveHistoryItem[] | null;
};

export type PatientCreatePayload = {
  name: string;
  age: number;
  sex: 'M' | 'F';
  date_of_birth?: string | null;
  clinical_data?: ClinicalDataPayload | null;
};

export type PatientLastPrediction = {
  risk_score: number;
  classification: string;
  confidence: number;
  prediction_date: string;
};

export type PatientResponse = {
  id: string;
  name: string;
  age: number;
  sex: 'M' | 'F' | 'Male' | 'Female';
  date_of_birth?: string | null;
  created_at: string;
  validated_diagnosis?: ValidatedDiagnosisType | string | null;
  validated_at?: string | null;
  last_prediction?: PatientLastPrediction | null;
  clinical_data?: ClinicalDataPayload | null;
};

export type PatientDetailResponse = {
  patient: PatientResponse;
  predictions?: PredictionResponse[];
};

