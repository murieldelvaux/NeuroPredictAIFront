// Types matching the FastAPI backend schema (snake_case)

export interface HealthResponse {
  status: string;
  version: string;
}

export interface PatientOut {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  mrn: string;
  risk_score: number;
  risk_category: 'Low' | 'Moderate' | 'High';
  last_evaluated: string;
  status: 'Completed' | 'Pending Interpretation' | 'Awaiting MRI';
}

export interface PatientDetailOut extends PatientOut {
  demographics: Record<string, any>;
  history: Record<string, any>;
  cognitive: Record<string, any>;
  exam?: Record<string, any>;
  imaging_analysis?: Record<string, any>;
  ai_analysis?: Record<string, any>;
}

export interface PatientCreatePayload {
  name: string;
  age: number;
  gender: string;
  mrn: string;
  education_years: number;
  symptoms: string[];
  family_history: boolean;
  risk_factors: string[];
  comorbidities: string[];
  medications: string[];
  mmse: number;
  moca: number;
  cdr: number;
  scan_type?: string;
  scan_date?: string;
  radiologist_notes?: string;
}

/**
 * Payload sent to POST /predict (multipart/form-data).
 *
 * Backend fields (prediction.py):
 *   patient_id : str        — required
 *   mri_file   : File       — required for real inference (.nii / .nii.gz)
 *   age        : float      — optional
 *   mmse       : float      — optional (Mini-Mental State Examination)
 *   cdr        : float      — optional (Clinical Dementia Rating)
 *   cdrtot     : float      — optional (CDR sum-of-boxes)
 */
export interface PredictPayload {
  patient_id: string;
  mri_file?: File | null;
  age?: number | null;
  mmse?: number | null;
  cdr?: number | null;
  cdrtot?: number | null;
}

export interface PredictionExplanation {
  feature: string;
  impact: number;
  direction: 'risk' | 'protective';
}

export interface PredictionOut {
  patient_id: string;
  risk_score: number;
  classification: string;
  confidence: number;
  probabilities?: Record<string, number>;
  explanation: PredictionExplanation[];
  model_version?: string;
}
