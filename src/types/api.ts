/**
 * NeuroPredict AI — API contract types
 * Aligned with FastAPI backend schemas (app/schemas/)
 */

// ─── Health ──────────────────────────────────────────────────────────────────

export interface HealthResponse {
  status: 'ok' | 'degraded';
  model_loaded: boolean;
}

// ─── Patients ────────────────────────────────────────────────────────────────

/** Matches backend PatientOut schema */
export interface PatientOut {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  mrn: string;
  risk_score: number;          // 0–100
  risk_category: 'High' | 'Moderate' | 'Low';
  last_evaluated: string;      // ISO date string
  status: 'Completed' | 'Pending Interpretation' | 'Awaiting MRI';
}

/** Matches backend PatientCreate schema — payload for POST /patients */
export interface PatientCreatePayload {
  demographics: {
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    mrn: string;
    dob: string;
    phone: string;
    email: string;
    education_years: number;
  };
  clinical_history: {
    symptoms: string[];
    family_history: {
      alzheimers_relation: string[];
      dementia_count: number;
    };
    risk_factors: string[];
    comorbidities: string[];
    medications: string[];
  };
  cognitive_scores: {
    mmse: number;   // 0–30
    moca: number;   // 0–30
    cdr: number;    // 0 | 0.5 | 1 | 2 | 3
  };
  imaging?: {
    scan_type: 'MRI 3T' | 'PET-FDG' | 'CT Scan';
    scan_date: string;          // ISO date string
    radiologist_notes: string;
    file_path?: string;         // path to .nii/.nii.gz on server
  };
}

/** Full patient detail returned by GET /patients/{patient_id} */
export interface PatientDetailOut {
  patient: PatientOut;
  demographics: {
    id: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    mrn: string;
    dob: string;
    phone: string;
    email: string;
    education_years: number;
  };
  clinical_history: {
    symptoms: string[];
    family_history: {
      alzheimers_relation: string[];
      dementia_count: number;
    };
    risk_factors: string[];
    comorbidities: string[];
    medications: string[];
  };
  cognitive: {
    patient_id: string;
    mmse: CognitiveScoreOut;
    moca: CognitiveScoreOut;
    cdr: CdrOut;
    history: CognitiveHistoryEntry[];
  };
  imaging_exam?: ImagingExamOut;
  imaging_analysis?: ImagingAnalysisOut;
  ai_analysis?: AIAnalysisOut;
}

export interface CognitiveScoreOut {
  score: number;
  max_score: number;
  status: 'Normal' | 'Mild Cognitive Impairment' | 'Severe';
  assessment_date: string;
}

export interface CdrOut {
  score: number;
  status: string;
  assessment_date: string;
}

export interface CognitiveHistoryEntry {
  date: string;
  mmse: number;
  moca: number;
  cdr: number;
}

export interface ImagingExamOut {
  id: string;
  scan_type: 'MRI 3T' | 'PET-FDG' | 'CT Scan';
  scan_date: string;
  radiologist_notes: string;
  status: 'Completed' | 'Pending AI Processing' | 'Artifact Detected';
  metadata: {
    magnetic_strength?: string;
    slice_thickness: string;
  };
}

export interface ImagingAnalysisOut {
  scan_id: string;
  status: 'Success' | 'Processing' | 'Failed';
  hippocampal_volume_left: number;   // cm³
  hippocampal_volume_right: number;  // cm³
  ventricle_enlargement_ratio: number;
  cortical_thickness_avg: number;    // mm
  findings: string[];
}

// ─── Prediction ───────────────────────────────────────────────────────────────

/**
 * Optional clinical context sent alongside the MRI path.
 * Matches backend ClinicalFeatures schema.
 */
export interface ClinicalFeaturesPayload {
  age?: number;
  sex?: 'M' | 'F';
  mmse?: number;
  moca?: number;
  cdr?: number;
  has_family_history?: boolean;
  comorbidities?: string[];
  risk_factors?: string[];
}

/** Payload for POST /predict */
export interface PredictPayload {
  patient_id: string;
  nii_path: string;                         // server-side path to .nii/.nii.gz
  clinical_features?: ClinicalFeaturesPayload;
}

/** Single SHAP feature importance entry */
export interface FeatureImportanceOut {
  feature: string;
  impact: number;        // positive = increases risk, negative = protective
  direction: 'risk' | 'protective';
}

/** Full prediction response — matches backend PredictionOutput schema */
export interface PredictionOut {
  patient_id: string;
  risk_score: number;        // 0.0–1.0
  classification: 'CN' | 'MCI' | 'AD';
  confidence: number;        // 0.0–1.0
  probabilities: {
    CN: number;
    MCI: number;
    AD: number;
  };
  explanation: FeatureImportanceOut[];
  model_version?: string;
}

/** AI analysis stored per-patient — compatible with existing AIAnalysisResult */
export interface AIAnalysisOut {
  patient_id: string;
  prediction_date: string;
  probability: number;
  risk_category: 'High' | 'Moderate' | 'Low';
  confidence_score: number;
  explainability: {
    shap_attributions: {
      feature_name: string;
      attribution_value: number;
      category: 'Cognitive' | 'Imaging' | 'Clinical' | 'Demographic';
    }[];
    ai_reasoning_summary: string;
    key_risk_drivers: string[];
    protective_factors: string[];
  };
}

// ─── Error ───────────────────────────────────────────────────────────────────

/** Standard FastAPI validation / HTTP error envelope */
export interface APIError {
  detail: string | { loc: string[]; msg: string; type: string }[];
}
