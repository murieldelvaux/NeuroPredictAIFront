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
  education_years?: number | null;
};

export type PatientLastPrediction = {
  risk_score: number;
  classification: string;
  confidence: number;
  prediction_date: string;
};

export type PatientExamResponse = {
  scan_type?: string | null;
  scan_date?: string | null;
  slice_thickness?: string | null;
  magnetic_strength?: string | null;
};

export type PatientImagingAnalysisResponse = {
  left_hippocampal_volume?: number | null;
  right_hippocampal_volume?: number | null;
  hippocampal_volume_left?: number | null;
  hippocampal_volume_right?: number | null;
  ventricle_enlargement_ratio?: number | null;
  ventricle_ratio?: number | null;
  cortical_thickness_avg?: number | null;
  cortical_thickness?: number | null;
};

export type PatientAIAnalysisResponse = {
  classification?: string | null;
  confidence?: number | null;
  risk_score?: number | null;
  probability?: number | null;
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

export type PatientDetailResponse = {
  patient: PatientResponse;
  exam?: PatientExamResponse | null;
  imaging_analysis?: PatientImagingAnalysisResponse | null;
  ai_analysis?: PatientAIAnalysisResponse | null;
  predictions?: Record<string, unknown>[];
};
