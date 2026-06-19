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
  sex: PatientSex;              // 'M' | 'F'
  date_of_birth?: string | null; // "YYYY-MM-DD"
  clinical_data?: ClinicalDataPayload | null;
};

export type PatientResponse = {
  id: string;
  name: string;
  age: number;
  sex: PatientSex;
  date_of_birth: string;        // "dd/mm/aaaa" (formatado pelo backend)
  created_at: string;           // "dd/mm/aaaa"
  last_prediction?: PatientLastPrediction | null;
};

export type PatientLastPrediction = {
  risk_score: number;
  classification: string;
  confidence: number;
};

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

export type PatientDetailResponse = {
  patient: PatientResponse;
  predictions: PatientLastPrediction[];
};
