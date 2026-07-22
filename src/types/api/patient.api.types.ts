import type { FeatureImportanceResponse } from './prediction.api.types';

// Tipos de API espelhando exatamente os schemas Pydantic do backend (snake_case)

export type HealthResponse = {
  status: string;
  version: string;
};

export type MRIFileMetadata = {
  filename: string;
  content_type: string;
  size: number;
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
  education_years?: number | null;
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
  mrn?: string | null;
  date_of_birth?: string | null;
  created_at: string;
  last_prediction?: PatientLastPrediction | null;
  clinical_data?: ClinicalDataPayload | null;
};

export type PatientDemographicsResponse = {
  id?: string | null;
  name?: string | null;
  age?: number | null;
  sex?: 'M' | 'F' | 'Male' | 'Female' | null;
  mrn?: string | null;
  date_of_birth?: string | null;
  phone?: string | null;
  email?: string | null;
};

export type PatientHistoryResponse = {
  symptoms?: string[] | null;
  active_presenting_symptoms?: string[] | null;
  alzheimers_relation?: string[] | null;
  family_history_relations?: string[] | null;
  dementia_count?: number | null;
  risk_factors?: string[] | null;
  apoe_biomarkers_risk_vectors?: string[] | null;
  comorbidities?: string[] | null;
  registered_comorbidities?: string[] | null;
  medications?: string[] | null;
  admitted_medications?: string[] | null;
};

export type PatientExamResponse = {
  id?: string | null;
  scan_type?: string | null;
  scan_date?: string | null;
  radiologist_notes?: string | null;
  status?: string | null;
  magnetic_strength?: string | null;
  slice_thickness?: string | null;
  repetition_time?: string | null;
  echo_time?: string | null;
};

export type PatientImagingAnalysisResponse = {
  scan_id?: string | null;
  status?: string | null;
  hippocampal_volume_left?: number | null;
  hippocampal_volume_right?: number | null;
  left_hippocampal_volume?: number | null;
  right_hippocampal_volume?: number | null;
  ventricle_enlargement_ratio?: number | null;
  ventricle_ratio?: number | null;
  cortical_thickness_avg?: number | null;
  cortical_thickness?: number | null;
  findings?: string[] | null;
};

export type PatientAIAnalysisResponse = {
  prediction_date?: string | null;
  probability?: number | null;
  score?: number | null;
  confidence_score?: number | null;
  confidence?: number | null;
  risk_category?: string | null;
  risk?: string | null;
  classification?: string | null;
  explanation?: FeatureImportanceResponse[] | null;
  explain?: FeatureImportanceResponse[] | null;
  date?: string | null;
  model_version?: string | null;
};

export type PatientResponseWithClinical = PatientResponse & {
  clinical_data?: ClinicalDataPayload | null;
};

export type PatientDetailResponse = {
  patient: PatientResponseWithClinical;
  exam?: PatientExamResponse | null;
  imaging_analysis?: PatientImagingAnalysisResponse | null;
  ai_analysis?: PatientAIAnalysisResponse | null;
  predictions?: Record<string, unknown>[];
};
