import type { PredictionResponse } from './prediction.api.types';

// Tipos de API espelhando os schemas do backend.

export type HealthResponse = {
  status: string;
  version: string;
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
  mri_file?: MRIFileMetadata | null;
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
  last_prediction?: PatientLastPrediction | null;
  clinical_data?: ClinicalDataPayload | null;
};

export type PatientDetailResponse = {
  patient: PatientResponse;
  predictions?: PredictionResponse[];
};
