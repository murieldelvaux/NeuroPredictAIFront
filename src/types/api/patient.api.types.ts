// Tipos espelhando exatamente os schemas Pydantic do backend (snake_case)

import type { PatientSex, PatientStatus, RiskCategory } from '../patient.types';

export type HealthResponse = {
  status: string;
  version: string;
};

export type ClinicalDataPayload = {
  mmse?: number | null;
  moca?: number | null;
  cdr?: number | null;
  cdrtot?: number | null;
  comorbidities: string[];
  family_history?: boolean | null;
  education_years?: number | null;
};

export type PatientCreatePayload = {
  name: string;
  age: number;
  sex: PatientSex;               // 'M' | 'F'
  date_of_birth?: string | null; // "YYYY-MM-DD"
  clinical_data?: ClinicalDataPayload | null;
};

export type PatientLastPrediction = {
  risk_score: number;
  classification: string;
  confidence: number;
};

/** Resposta de POST /patients e GET /patients/:id (campo .patient) */
export type PatientResponse = {
  id: string;
  name: string;
  age: number;
  sex: PatientSex;
  date_of_birth: string;
  created_at: string;
  last_prediction?: PatientLastPrediction | null;
};

/** Item do array de GET /patients */
export type PatientListItem = {
  id: string;
  name: string;
  age: number;
  sex: PatientSex;
  mrn?: string;
  riskScore?: number;
  riskCategory?: RiskCategory;
  lastEvaluated?: string;
  status?: PatientStatus;
};

/** Resposta completa de GET /patients/:id */
export type PatientDetailResponse = {
  patient: PatientResponse;
  demographics?: Record<string, unknown>;
  history?: Record<string, unknown>;
  cognitive?: Record<string, unknown>;
  exam?: Record<string, unknown>;
  imaging_analysis?: Record<string, unknown>;
  ai_analysis?: Record<string, unknown>;
  predictions?: PatientLastPrediction[];
};
